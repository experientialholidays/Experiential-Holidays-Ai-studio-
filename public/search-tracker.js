// public/search-tracker.js
// Universal Search & User Activity Analytics Tracker

(function() {
    // 1. Session Management
    function getSessionId() {
        let sid = sessionStorage.getItem('exp_session_id');
        if (!sid) {
            sid = 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
            sessionStorage.setItem('exp_session_id', sid);
        }
        return sid;
    }

    // 2. Helper to get Firestore DB handle
    function getFirestoreDb() {
        if (typeof window.db !== 'undefined' && window.db) {
            return window.db;
        }
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            const instance = firebase.firestore();
            try {
                instance.settings({ experimentalAutoDetectLongPolling: true });
            } catch(e) {}
            return instance;
        }
        return null;
    }

    // 3. Track Search Query (Smart Debouncing & Full-Word Capture)
    window.trackSearchQueryToFirestore = async function(searchData) {
        const queryText = (searchData.query || '').trim();
        const hasFilters = searchData.filters && Object.values(searchData.filters).some(v => v && (Array.isArray(v) ? v.length > 0 : true));

        // 1. Ignore very short unfinished queries (< 3 chars) unless structured filters are active
        if (queryText.length > 0 && queryText.length < 3 && !hasFilters) {
            return;
        }

        if (!queryText && !hasFilters) {
            return; // Skip empty searches
        }

        const sessionId = getSessionId();
        const now = Date.now();
        const lastSearchDocId = sessionStorage.getItem('last_search_doc_id');
        const lastSearchTime = parseInt(sessionStorage.getItem('last_search_time') || '0', 10);
        const hasClickedOnLastSearch = sessionStorage.getItem('last_search_has_clicked') === 'true';

        const payload = {
            sessionId: sessionId,
            searchQuery: queryText || '(Category/Date Filter)',
            resultsCount: typeof searchData.resultsCount === 'number' ? searchData.resultsCount : 0,
            filters: searchData.filters || {},
            timestamp: now,
            dateStr: new Date(now).toISOString().split('T')[0],
            userAgent: navigator.userAgent
        };

        try {
            const db = getFirestoreDb();
            if (!db) return;

            // 2. If user continues typing within 30 seconds without clicking a card,
            // update the existing search record with the full query instead of creating duplicate half-typed entries.
            if (lastSearchDocId && (now - lastSearchTime < 30000) && !hasClickedOnLastSearch) {
                if (db.collection) {
                    await db.collection('search_analytics').doc(lastSearchDocId).update({
                        searchQuery: payload.searchQuery,
                        resultsCount: payload.resultsCount,
                        filters: payload.filters,
                        timestamp: now
                    }).catch(() => {});
                } else if (typeof window.doc === 'function' && typeof window.updateDoc === 'function') {
                    await window.updateDoc(window.doc(db, 'search_analytics', lastSearchDocId), {
                        searchQuery: payload.searchQuery,
                        resultsCount: payload.resultsCount,
                        filters: payload.filters,
                        timestamp: now
                    }).catch(() => {});
                }
                sessionStorage.setItem('last_search_time', now.toString());
                return;
            }

            // 3. Create a new search document for fresh searches
            let docRefId = null;
            if (db.collection) {
                const docRef = await db.collection('search_analytics').add({ ...payload, actions: [] });
                docRefId = docRef.id;
            } else if (typeof window.addDoc === 'function' && typeof window.collection === 'function') {
                const docRef = await window.addDoc(window.collection(db, 'search_analytics'), { ...payload, actions: [] });
                docRefId = docRef.id;
            }

            if (docRefId) {
                sessionStorage.setItem('last_search_doc_id', docRefId);
                sessionStorage.setItem('last_search_time', now.toString());
                sessionStorage.setItem('last_search_has_clicked', 'false');
            }
        } catch (err) {
            console.warn("Search tracker bypass:", err);
        }
    };

    // 4. Track Card Click
    window.trackCardClickToFirestore = async function(cardData) {
        sessionStorage.setItem('last_search_has_clicked', 'true');
        const sessionId = getSessionId();
        const lastSearchDocId = sessionStorage.getItem('last_search_doc_id') || null;

        const payload = {
            eventType: 'card_click',
            sessionId: sessionId,
            searchDocId: lastSearchDocId,
            experienceId: cardData.experienceId || '',
            experienceName: cardData.experienceName || '',
            experienceSlug: cardData.experienceSlug || '',
            searchQuery: cardData.searchQuery || sessionStorage.getItem('last_search_query') || '',
            timestamp: Date.now(),
            dateStr: new Date().toISOString().split('T')[0]
        };

        try {
            const db = getFirestoreDb();
            if (!db) return;

            if (db.collection) {
                await db.collection('activity_logs').add(payload);
                if (lastSearchDocId) {
                    db.collection('search_analytics').doc(lastSearchDocId).update({
                        clickedExperience: cardData.experienceName || cardData.experienceId,
                        hasClick: true
                    }).catch(() => {});
                }
            } else if (typeof window.addDoc === 'function' && typeof window.collection === 'function') {
                await window.addDoc(window.collection(db, 'activity_logs'), payload);
                if (lastSearchDocId && typeof window.doc === 'function' && typeof window.updateDoc === 'function') {
                    window.updateDoc(window.doc(db, 'search_analytics', lastSearchDocId), {
                        clickedExperience: cardData.experienceName || cardData.experienceId,
                        hasClick: true
                    }).catch(() => {});
                }
            }
        } catch (err) {
            console.warn("Card click tracker bypass:", err);
        }
    };

    // 5. Track Direct Action Clicks (WhatsApp, Details Link, External Links)
    window.trackUserActionToFirestore = async function(actionData) {
        const sessionId = getSessionId();
        const payload = {
            eventType: actionData.eventType || 'link_click', // whatsapp_click, detail_link_click, external_link_click
            sessionId: sessionId,
            experienceId: actionData.experienceId || '',
            experienceName: actionData.experienceName || '',
            targetUrl: actionData.targetUrl || '',
            hostName: actionData.hostName || '',
            timestamp: Date.now(),
            dateStr: new Date().toISOString().split('T')[0]
        };

        try {
            const db = getFirestoreDb();
            if (!db) return;

            if (db.collection) {
                await db.collection('activity_logs').add(payload);
            } else if (typeof window.addDoc === 'function' && typeof window.collection === 'function') {
                await window.addDoc(window.collection(db, 'activity_logs'), payload);
            }
        } catch (err) {
            console.warn("User action tracker bypass:", err);
        }
    };
})();
