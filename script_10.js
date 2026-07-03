
        import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

        const firebaseConfig = window.GLOBAL_FIREBASE_CONFIG;

        const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        

        onAuthStateChanged(auth, (user) => {
            const dropdownProfile = document.getElementById('dropdown-profile');
            const userEmailEl = document.getElementById('user-email');
            const logoutBtn = document.getElementById('logout-btn');
            const loginBtnMenu = document.getElementById('login-btn-menu');

            if (user) {
                if (userEmailEl) userEmailEl.innerText = user.email.split('@')[0];
                if (dropdownProfile) dropdownProfile.classList.remove('hidden');
                if (logoutBtn) logoutBtn.classList.remove('hidden');
                if (loginBtnMenu) loginBtnMenu.classList.add('hidden');
            } else {
                if (dropdownProfile) dropdownProfile.classList.add('hidden');
                if (logoutBtn) logoutBtn.classList.add('hidden');
                if (loginBtnMenu) loginBtnMenu.classList.remove('hidden');
            }
        });

        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category') || urlParams.get('subcategory') || urlParams.get('search');
        const tagParam = urlParams.get('tag');

        if (categoryParam) {
            // Assign directly to the database category filter instead of the text input box
            if (typeof selectedSubCategories !== 'undefined') {
                if (!selectedSubCategories.includes(categoryParam)) {
                    selectedSubCategories.push(categoryParam);
                }
                // Toggle the state of the button
                setTimeout(() => {
                    const btnId = `btn-sub-${categoryParam.replace(/[^a-zA-Z0-9]/g, '')}`;
                    const btn = document.getElementById(btnId);
                    if (btn) {
                        btn.classList.add('selected');
                    }
                }, 500);
            }
        }

        if (tagParam) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = tagParam;
            }
        }

        if ((categoryParam || tagParam) && typeof allData !== 'undefined' && allData.length > 0) {
            runFilter();
        }
        const loginBtnMenuEl = document.getElementById('login-btn-menu');
        if (loginBtnMenuEl) loginBtnMenuEl.onclick = () => signInWithPopup(auth, provider);

        const logoutBtnEl = document.getElementById('logout-btn');
        if (logoutBtnEl) logoutBtnEl.onclick = () => signOut(auth);

        // Check for category search parameters in the URL when the page loads
        

        
    