
        const firebaseConfig = window.GLOBAL_FIREBASE_CONFIG;

        // Initialize Firebase SDK
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        let allData = [];
        let activeCategory = null; // fallback for backward compatibility
        let selectedSubCategories = [];

        const CATEGORY_DATA = {
            "Wellness & Healing": ["Yoga", "Breathwork", "Ayurveda", "Traditional Healing", "Detox Programs", "Nutrition", "Longevity", "Sleep Optimization", "Sound Healing", "Energy Healing"],
            "Mental Health & Emotional Growth": ["Burnout Recovery", "Emotional Healing", "Psychology", "Shadow Work", "Trauma Recovery", "Resilience", "Emotional Intelligence", "Stress Management"],
            "Spirituality & Consciousness": ["Meditation", "Silent Retreats", "Mindfulness", "Mysticism", "Religious Retreats", "Pilgrimage", "Sacred Practices", "Consciousness Exploration"],
            "Fitness, Movement & Martial Arts": ["Fitness Training", "Martial Arts", "Dance", "Mobility", "Physical Therapy", "Functional Fitness", "Movement Arts", "Body Conditioning"],
            "Adventure & Outdoor Exploration": ["Trekking", "Hiking", "Mountaineering", "Wilderness Survival", "Water Sports", "Extreme Sports", "Cycling Tours", "Overland Expeditions"],
            "Nature, Sustainability & Eco Living": ["Permaculture", "Sustainable Living", "Eco Retreats", "Regenerative Living", "Off-Grid Living", "Forest Bathing", "Organic Farming", "Environmental Stewardship"],
            "Leadership, Business & Career": ["Executive Leadership", "Entrepreneurship", "Business Growth", "Team Building", "Sales", "Networking", "Productivity", "Career Development"],
            "Technology & Innovation": ["AI & Emerging Tech", "Agile Methodologies", "Software Development", "STEM Learning", "Digital Skills", "Innovation Labs", "Crypto & Web3", "Future Trends"],
            "Creativity & Arts": ["Writing", "Literature", "Visual Arts", "Music", "Performing Arts", "Film & Media", "Photography", "Culinary Arts", "Handicrafts"],
            "Relationships & Connection": ["Couples Retreats", "Intimacy", "Family Retreats", "Parenting", "Communication Skills", "Conscious Relationships", "Friendship & Social Connection", "Community Experiences"],
            "Culture, Philosophy & Learning": ["Philosophy", "Ethics", "Cultural Immersion", "Language Learning", "Archaeology", "History", "Indigenous Wisdom", "Educational Travel"],
            "Lifestyle & Personal Transformation": ["Digital Detox", "Life Design", "Habit Change", "Minimalism", "Workations", "Nomadic Living", "Purpose Discovery", "Personal Development"],
            "Luxury, Leisure & Travel": ["Luxury Escapes", "Spa Retreats", "Boutique Travel", "Slow Travel", "Island Escapes", "Glamping", "Curated Holidays", "Premium Experiences"],
            "Identity & Belonging": ["Women's Retreats", "Men's Retreats", "LGBTQ+ Retreats", "Senior Retreats", "Faith-Based Communities", "Cultural Identity Groups", "Support Networks", "Shared Experience Groups"],
            "Other": ["Other"]
        };
        const STATES = ["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];

        window.toggleFilterOptions = function() {
            const block = document.getElementById('filterOptionsBlock');
            const btn = document.getElementById('filterToggleBtn');
            if (block) {
                if (block.classList.contains('hidden')) {
                    block.classList.remove('hidden');
                    if (btn) {
                        btn.classList.add('bg-[#f5ede8]');
                        btn.querySelector('span').innerText = 'Hide Filters';
                    }
                } else {
                    block.classList.add('hidden');
                    if (btn) {
                        btn.classList.remove('bg-[#f5ede8]');
                        btn.querySelector('span').innerText = 'More Filters';
                    }
                }
            }
        };

        document.addEventListener('click', function(event) {
            const block = document.getElementById('filterOptionsBlock');
            const btn = document.getElementById('filterToggleBtn');
            if (block && !block.classList.contains('hidden')) {
                // Check if the click occurred outside both the block and the toggle button
                if (!block.contains(event.target) && !btn.contains(event.target)) {
                    block.classList.add('hidden');
                    if (btn) {
                        btn.classList.remove('bg-[#f5ede8]');
                        btn.querySelector('span').innerText = 'More Filters';
                    }
                }
            }
        });

        window.toggleSubCategoryFilter = function(sub) {
            const index = selectedSubCategories.indexOf(sub);
            const btnId = `btn-sub-${sub.replace(/[^a-zA-Z0-9]/g, '')}`;
            const btn = document.getElementById(btnId);
            
            if (index > -1) {
                selectedSubCategories.splice(index, 1);
                if (btn) {
                    btn.classList.remove('selected');
                }
            } else {
                selectedSubCategories.push(sub);
                if (btn) {
                    btn.classList.add('selected');
                }
            }
            runFilter();
        };

        window.clearSelectedSubCategory = function(sub) {
            const index = selectedSubCategories.indexOf(sub);
            if (index > -1) {
                selectedSubCategories.splice(index, 1);
                const btnId = `btn-sub-${sub.replace(/[^a-zA-Z0-9]/g, '')}`;
                const btn = document.getElementById(btnId);
                if (btn) {
                    btn.classList.remove('selected');
                }
                runFilter();
            }
        };

        function getSubCategoryBadge(sub) {
            const safeId = sub.replace(/[^a-zA-Z0-9]/g, '');
            const badgeId = `badge-sub-${safeId}`;
            if (!allData || allData.length === 0) {
                return `<span id="${badgeId}" class="hidden absolute -top-1.5 -right-1 px-1.5 py-0.5 bg-stone-100 text-stone-400 text-[9px] font-semibold rounded-full border border-stone-200 leading-none">0</span>`;
            }
            const count = allData.filter(item => {
                const itemSubs = item.SubCategories || [];
                const itemCats = item.Categories || [];
                return itemSubs.includes(sub) || itemCats.includes(sub);
            }).length;
            
            if (count > 0) {
                return `<span id="${badgeId}" class="absolute -top-1.5 -right-1 px-1.5 py-0.5 bg-[#f5ede8] text-[#a37c6b] text-[9px] font-extrabold rounded-full border border-[#e8dad0] shadow-sm leading-none">${count}</span>`;
            } else {
                return `<span id="${badgeId}" class="hidden absolute -top-1.5 -right-1 px-1.5 py-0.5 bg-stone-100 text-stone-400 text-[9px] font-semibold rounded-full border border-stone-200 leading-none">0</span>`;
            }
        }

        function initFilterUI() {
            // Populate State Dropdown
            const stateSelect = document.getElementById('stateFilterSelect');
            if (stateSelect && stateSelect.children.length <= 1) {
                stateSelect.innerHTML = '<option value="">All States</option>' + STATES.map(st => `
                    <option value="${st}">${st}</option>
                `).join('');
            }

            // Populate Categories & Subcategories
            const catContainer = document.getElementById('categoriesFilterContainer');
            if (catContainer) {
                let html = '';
                for (const [mainCat, subCats] of Object.entries(CATEGORY_DATA)) {
                    html += `
                    <div class="flex flex-col py-1 border-b border-stone-50 last:border-0">
                        <div class="w-full font-bold text-stone-700 text-[11px] uppercase tracking-wider mb-1">
                            ${mainCat}
                        </div>
                        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth whitespace-nowrap">
                            ${subCats.map(sub => {
                                const isSelected = selectedSubCategories.includes(sub);
                                return `
                                    <button type="button" 
                                            id="btn-sub-${sub.replace(/[^a-zA-Z0-9]/g, '')}" 
                                            class="relative px-3.5 py-1.5 rounded-full text-[13px] font-semibold border select-none sub-cat-btn mr-1.5 ${isSelected ? 'selected' : ''}" 
                                            onclick="toggleSubCategoryFilter('${sub.replace(/'/g, "\\'")}')">
                                        ${sub}
                                        ${getSubCategoryBadge(sub)}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    `;
                }
                catContainer.innerHTML = html;
            }
        }

        // Run UI init
        setTimeout(initFilterUI, 100);

        // --- Analytics and Search/Filter Tracking State ---
        let hasSearchedInSession = false;
        let lastSearchQuery = "";
        let searchDebounceTimeout = null;

        window.trackClickAndNavigate = function(element) {
            const id = element.getAttribute('data-id');
            const name = element.getAttribute('data-name');
            if (typeof gtag === 'function') {
                gtag('event', 'click_experience_card', {
                    'experience_id': id,
                    'experience_name': name
                });
            }
            window.location.href = `experience.html?id=${id}`;
        };

        function trackSearchEvent(resultsCount) {
            if (typeof gtag !== 'function') return;

            const searchQuery = document.getElementById('searchInput').value.trim();
            const dateStart = document.getElementById('startDateInput').value;
            const dateEnd = document.getElementById('endDateInput').value;
            const stateVal = document.getElementById('stateFilterSelect') ? document.getElementById('stateFilterSelect').value : '';

            const hasActiveFilter = searchQuery !== "" || selectedSubCategories.length > 0 || dateStart !== "" || dateEnd !== "" || stateVal !== "";

            if (searchDebounceTimeout) {
                clearTimeout(searchDebounceTimeout);
            }

            searchDebounceTimeout = setTimeout(() => {
                if (hasActiveFilter) {
                    const isRedefined = hasSearchedInSession && (searchQuery !== lastSearchQuery || selectedSubCategories.length > 0 || dateStart !== "" || dateEnd !== "" || stateVal !== "");
                    
                    gtag('event', isRedefined ? 'redefine_search' : 'search_experiences', {
                        'search_term': searchQuery || '(empty)',
                        'results_count': resultsCount,
                        'category': selectedSubCategories.join(',') || 'all',
                        'start_date': dateStart || 'none',
                        'end_date': dateEnd || 'none',
                        'is_redefined': isRedefined
                    });

                    lastSearchQuery = searchQuery;
                    hasSearchedInSession = true;
                } else if (hasSearchedInSession) {
                    // Search criteria cleared - closed search
                    gtag('event', 'close_or_clear_search', {
                        'action': 'clear_all_filters'
                    });
                    lastSearchQuery = "";
                    hasSearchedInSession = false;
                }
            }, 1000);
        }

        // Date parsing helper
        function extractDateRange(text) {
            const monthMap = {
                jan:0, january:0,
                feb:1, february:1,
                mar:2, march:2,
                apr:3, april:3,
                may:4,
                jun:5, june:5,
                jul:6, july:6,
                aug:7, august:7,
                sep:8, september:8, sept:8,
                oct:9, october:9,
                nov:10, november:10,
                dec:11, december:11
            };
            
            const monthsStr = Object.keys(monthMap).join('|');
            
            let result = { start: null, end: null, cleanText: text, isNLP: false, originalMatch: '' };
            
            const regex1 = new RegExp(`\\b(\\d{1,2})\\s*(${monthsStr})\\s*(?:-|to)\\s*(\\d{1,2})\\s*(${monthsStr})\\b`, 'i');
            const regex2 = new RegExp(`\\b(\\d{1,2})\\s*(?:-|to)\\s*(\\d{1,2})\\s*(${monthsStr})\\b`, 'i');
            const regex2b = new RegExp(`\\b(${monthsStr})\\s*(\\d{1,2})\\s*(?:-|to)\\s*(\\d{1,2})\\b`, 'i');
            const regex3 = new RegExp(`\\b(\\d{1,2})\\s*(${monthsStr})\\b`, 'i');
            const regex4 = new RegExp(`\\b(${monthsStr})\\s*(\\d{1,2})\\b`, 'i');
            
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();
            
            function parseDate(dayStr, monthStr, refMonth, refYear) {
                let m = monthMap[monthStr.toLowerCase()];
                let d = parseInt(dayStr, 10);
                let y = refYear;
                if (m < currentMonth - 2 && refYear === currentYear) {
                    y = currentYear + 1;
                }
                return new Date(y, m, d);
            }
            
            function formatDateStr(dObj) {
                return `${dObj.getFullYear()}-${String(dObj.getMonth()+1).padStart(2,'0')}-${String(dObj.getDate()).padStart(2,'0')}`;
            }

            let match = text.match(regex1);
            if (match) {
                let d1 = match[1], m1 = match[2], d2 = match[3], m2 = match[4];
                let date1 = parseDate(d1, m1, currentMonth, currentYear);
                let date2 = parseDate(d2, m2, currentMonth, date1.getFullYear());
                if (date2 < date1) date2.setFullYear(date2.getFullYear() + 1);
                
                result.start = formatDateStr(date1);
                result.end = formatDateStr(date2);
                result.cleanText = text.replace(match[0], '').trim();
                result.isNLP = true;
                result.originalMatch = match[0];
                return result;
            }
            
            match = text.match(regex2);
            if (match) {
                let d1 = match[1], d2 = match[2], mStr = match[3];
                let date2 = parseDate(d2, mStr, currentMonth, currentYear);
                let date1 = parseDate(d1, mStr, currentMonth, date2.getFullYear());
                if (date1 > date2) date1.setMonth(date1.getMonth() - 1);
                
                result.start = formatDateStr(date1);
                result.end = formatDateStr(date2);
                result.cleanText = text.replace(match[0], '').trim();
                result.isNLP = true;
                result.originalMatch = match[0];
                return result;
            }
            
            match = text.match(regex2b);
            if (match) {
                let mStr = match[1], d1 = match[2], d2 = match[3];
                let date1 = parseDate(d1, mStr, currentMonth, currentYear);
                let date2 = parseDate(d2, mStr, currentMonth, date1.getFullYear());
                
                result.start = formatDateStr(date1);
                result.end = formatDateStr(date2);
                result.cleanText = text.replace(match[0], '').trim();
                result.isNLP = true;
                result.originalMatch = match[0];
                return result;
            }
            
            match = text.match(regex3);
            if (match) {
                let d1 = match[1], m1 = match[2];
                let date1 = parseDate(d1, m1, currentMonth, currentYear);
                result.start = result.end = formatDateStr(date1);
                result.cleanText = text.replace(match[0], '').trim();
                result.isNLP = true;
                result.originalMatch = match[0];
                return result;
            }
            
            match = text.match(regex4);
            if (match) {
                let m1 = match[1], d1 = match[2];
                let date1 = parseDate(d1, m1, currentMonth, currentYear);
                result.start = result.end = formatDateStr(date1);
                result.cleanText = text.replace(match[0], '').trim();
                result.isNLP = true;
                result.originalMatch = match[0];
                return result;
            }
            
            return result;
        }

        function formatDisplayDate(dateStr) {
            if (!dateStr || typeof dateStr !== 'string') return "";
            try {
                const parts = dateStr.split('-');
                if(parts.length !== 3) return dateStr;
                const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
                if (isNaN(dateObj.getTime())) return dateStr;
                
                const day = dateObj.getDate();
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return `${day} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
            } catch (e) {
                return dateStr;
            }
        }

        // Real-time Database Stream Listener
        db.collection('retreats').onSnapshot((snapshot) => {
            document.getElementById('connectionStatus').innerText = "Connected Live to Firestore";
            allData = [];
            
            const now = new Date();
            const currentDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            snapshot.forEach((doc) => {
                try {
                    const r = doc.data();
                    if (r.isHidden) return;
                    
                    let end_date = String(r.endDate || '').trim();
                    let end_time = String(r.endTime || '').trim();
                    let start_date = String(r.startDate || '').trim();
                    let start_time = String(r.startTime || '').trim();
                    
                    if (!end_date || end_date === 'undefined') {
                        end_date = start_date;
                        end_time = start_time;
                    }
                    if (!end_time || end_time === 'undefined') end_time = "23:59";
                    if (end_time.length === 4 && end_time[1] === ':') end_time = "0" + end_time;
                    
                    if (end_date && end_date !== 'undefined' && (end_date < currentDateStr || (end_date === currentDateStr && end_time < currentTimeStr))) {
                        return; // Skip expired experiences
                    }

                    let media = Array.isArray(r.fileUrls) ? [...r.fileUrls] : [];
                    let v_links = Array.isArray(r.videoLinks) ? [...r.videoLinks] : [];
                    media = media.concat(v_links);
                    let cats = Array.isArray(r.categories) ? r.categories : [];
                    let subCats = Array.isArray(r.subCategories) ? r.subCategories : [];

                    allData.push({
                        id: doc.id,
                        Name: String(r.retreatName || 'Untitled'),
                        Description: String(r.description || ''), 
                        Categories: cats,
                        SubCategories: subCats,
                        Hashtags: Array.isArray(r.hashtags) ? r.hashtags : [],
                        State: String(r.state || ''),
                        City: String(r.city || ''),
                        Start: start_date,
                        StartDisplay: formatDisplayDate(start_date),
                        StartTime: start_time,
                        End: end_date,
                        EndDisplay: formatDisplayDate(end_date),
                        EndTime: end_time,
                        Cost: String(r.contribution || ''),
                        Inclusions: String(r.inclusionsExclusions || ''),
                        Org: String(r.orgInfo || ''),
                        CName: String(r.contactName || ''),
                        CEmail: String(r.orgContactEmail || ''),
                        CPhone: String(r.contactWhatsApp || ''),
                        CNum: String(r.contactNumber || ''),
                        ExternalLinks: Array.isArray(r.externalLinks) ? r.externalLinks : [],
                        MediaArray: media,
                        Timestamp: r.timestamp || Date.now()
                    });
                } catch (err) {
                    console.error("Error parsing document data:", doc.id, err);
                }
            });

            allData.sort((a, b) => {
                // 1. Handle entries with no dates (push to bottom)
                if (!a.Start && b.Start) return 1;
                if (a.Start && !b.Start) return -1;
                if (!a.Start && !b.Start) {
                    return a.Name.localeCompare(b.Name); 
                }

                // 2. Format times for clean comparison
                let timeA = a.StartTime || "00:00";
                let timeB = b.StartTime || "00:00";
                if (timeA.length === 4 && timeA[1] === ':') timeA = "0" + timeA;
                if (timeB.length === 4 && timeB[1] === ':') timeB = "0" + timeB;
    
                // 3. Sort by Date -> If same, sort by Time -> If same, sort Alphabetically by Name
                return a.Start.localeCompare(b.Start) || 
                       timeA.localeCompare(timeB) || 
                       a.Name.localeCompare(b.Name);
            });

            initFilterUI();
            runFilter();
        }, (error) => {
            const el = document.getElementById('connectionStatus');
            el.innerText = "Connection Failed: " + error.message;
            el.style.display = 'block';
            console.error("Firestore Error:", error);
        });

        // Media Parsing Functions
        function getYouTubeId(url) {
            if (!url || typeof url !== 'string') return null;
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
            const match = url.trim().match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        }

        function getInstagramId(url) {
            if (!url || typeof url !== 'string') return null;
            const match = url.trim().match(/instagram\.com\/(?:reel|reels|p)\/([a-zA-Z0-9_-]+)/i);
            return match ? match[1] : null;
        }

        function isPdf(url) {
            if (!url || typeof url !== 'string') return false;
            return url.toLowerCase().includes('.pdf');
        }

        function isImage(url) {
            if (!url || typeof url !== 'string') return false;
            const cleanUrl = url.split('?')[0].toLowerCase();
            return (
                cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg') || 
                cleanUrl.endsWith('.png') || cleanUrl.endsWith('.gif') || 
                cleanUrl.endsWith('.webp')
            );
        }

        // Card Rendering
        function renderCards(data) {
            document.getElementById('resultCount').innerText = `${data.length} Experiences found`;
            let html = '';
            
            data.forEach(item => {
                const cats = item.Categories.map(c => `<span class="cat-badge mr-1">${c}</span>`).join('');
                let mediaArr = item.MediaArray;
                let primaryMedia = '';
                
                const ytUrl = mediaArr.find(url => typeof url === 'string' && (url.includes('youtube.com') || url.includes('youtu.be')));
                const instaUrl = mediaArr.find(url => typeof url === 'string' && url.includes('instagram.com'));
                const imgUrl = mediaArr.find(url => typeof url === 'string' && !url.includes('youtube.com') && !url.includes('youtu.be') && !url.includes('instagram.com') && !isPdf(url));
                const pdfUrl = mediaArr.find(url => isPdf(url));

                const ytId = getYouTubeId(ytUrl);
                const instaId = getInstagramId(instaUrl);

                if (ytId) {
                    primaryMedia = `<iframe class="absolute top-0 left-0 w-full h-full lazy-video pointer-events-none" data-src="https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}" frameborder="0" allow="autoplay; encrypted-media"></iframe>`;
                } else if (imgUrl) {
                    primaryMedia = `<img src="${imgUrl}" class="absolute top-0 left-0 w-full h-full object-cover object-top" alt="Experience Image">`;
                } else if (instaId) {
                    // We removed 'src' and changed it to 'data-src', and added the 'lazy-video' class
                    // This forces Instagram to use your custom Intersection Observer!
                    primaryMedia = `
                    <iframe
                        data-src="https://www.instagram.com/reel/${instaId}/embed/"
                        class="w-full h-[160%] -mt-[75px] pointer-events-none lazy-video"
                        onerror="this.parentNode.innerHTML='<div class=\\'absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white font-bold\\'>Instagram Reel</div>'">
                    </iframe>`;

                } else if (pdfUrl) {
                    primaryMedia = `
                    <div class="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 text-stone-600">
                        <div class="text-6xl mb-4">📄</div>
                        <div class="font-bold text-lg">PDF Document</div>
                    </div>`;
                } else {
                    primaryMedia = `<img src="https://via.placeholder.com/600x400" class="absolute top-0 left-0 w-full h-full object-contain" alt="Placeholder">`;
                }

                let hashtagsHtml = '';
                if (item.Hashtags && item.Hashtags.length > 0) {
                    hashtagsHtml = `
                        <div class="mt-2 flex flex-wrap gap-1 text-[11px] text-[#a37c6b] font-semibold tracking-wide">
                            ${item.Hashtags.map(t => `<span class="bg-[#f5ede8]/50 px-1.5 py-0.5 rounded">${t}</span>`).join('')}
                        </div>`;
                }

                html += `
                <div class="card relative" data-id="${item.id}" data-name="${item.Name.replace(/"/g, '&quot;')}" onclick="window.trackClickAndNavigate(this)">
                    <div class="card-media-container">
                        ${primaryMedia}
                        <div class="absolute inset-0 bg-transparent z-10"></div>
                    </div>
                    <div class="card-body relative">
                        <div class="mb-3 flex flex-wrap gap-1">${cats}</div>
                        <h3>${item.Name}</h3>
                        <p class="text-stone-500 text-base font-medium">📍 ${item.City ? item.City + ', ' : ''}${item.State ? item.State + ', ' : ''}India</p>
                        <p class="text-stone-400 text-base font-medium">
                            📅 ${item.StartDisplay || item.Start} ${item.EndDisplay ? ' - ' + item.EndDisplay : ''}
                        </p>
                        ${hashtagsHtml}
                    </div>
                </div>`;
            });
            
            document.getElementById('cardContainer').innerHTML = html || '<p class="col-span-full text-center py-20 text-stone-400">No matching experiences found.</p>';
            observeVideos();
        }

        // Lazy Load Videos
        function observeVideos() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const iframe = entry.target;
                    if (entry.isIntersecting) {
                        if (!iframe.src) {
                            iframe.src = iframe.dataset.src;
                            iframe.onload = () => {
                                iframe.classList.add('loaded');
                            };
                            // Safety fallback for cached videos / slow trigger
                            setTimeout(() => {
                                iframe.classList.add('loaded');
                            }, 1000);
                        }
                    }
                });
            }, { threshold: 0.01, rootMargin: "0px 0px 1200px 0px"});
            document.querySelectorAll('.lazy-video').forEach(vid => {
                if (vid.src) {
                    vid.classList.add('loaded');
                }
                observer.observe(vid);
            });
        }


        window.clearCategory = function() {
            selectedSubCategories = [];
            // Reset button styles
            document.querySelectorAll('#categoriesFilterContainer button').forEach(btn => {
                btn.classList.remove('bg-[#a37c6b]', 'text-white', 'border-[#a37c6b]');
                btn.classList.add('bg-white', 'text-stone-600', 'border-stone-200');
            });
            window.history.replaceState({}, document.title, window.location.pathname);
            runFilter();
        };

        window.clearStateFilter = function() {
            const stateSelect = document.getElementById('stateFilterSelect');
            if (stateSelect) {
                stateSelect.value = '';
            }
            runFilter();
        };

        // Filtering System
        function runFilter() {
            let sRaw = document.getElementById('searchInput').value.toLowerCase();
            
            const nlpDate = extractDateRange(sRaw);
            const s = nlpDate.cleanText;
            
            // Split the search input into an array of individual words
            const searchWords = s.split(/\s+/).filter(word => word.length > 0);
            
            const dStartRaw = document.getElementById('startDateInput').value;
            const dEndRaw = document.getElementById('endDateInput').value;
            
            const dStart = dStartRaw || nlpDate.start;
            const dEnd = dEndRaw || nlpDate.end;

            const tags = document.getElementById('filterStatus');
            tags.innerHTML = '';
            
            // Rebuild words into a search phrase for the tag (or keep raw if they didn't type a date that got stripped)
            if(s) {
                const words = s.split(/\s+/).filter(w => w.length > 0);
                words.forEach(word => {
                    tags.innerHTML += `<div class="tag">${word} <span onclick="clearSearchWord('${word.replace(/'/g, "\\'")}')">×</span></div>`;
                });
            }
            
            selectedSubCategories.forEach(cat => {
                tags.innerHTML += `<div class="tag">${cat} <span onclick="clearSelectedSubCategory('${cat.replace(/'/g, "\\'")}')">×</span></div>`;
            });

            const stateVal = document.getElementById('stateFilterSelect') ? document.getElementById('stateFilterSelect').value : '';
            if (stateVal) {
                tags.innerHTML += `<div class="tag">📍 ${stateVal} <span onclick="clearStateFilter()">×</span></div>`;
            }

            if(dStart || dEnd) {
                let txt = '';
                if (dStart && dEnd) {
                    if (dStart === dEnd) {
                        txt = `${formatDisplayDate(dStart)}`;
                    } else {
                        txt = `${formatDisplayDate(dStart)} to ${formatDisplayDate(dEnd)}`;
                    }
                } else if (dStart) {
                    txt = `From ${formatDisplayDate(dStart)}`;
                } else {
                    txt = `Until ${formatDisplayDate(dEnd)}`;
                }
                
                // If the user's manual inputs are empty, it means the date is from NLP string!
                if (!dStartRaw && nlpDate.start) {
                    tags.innerHTML += `<div class="tag">${txt} <span onclick="clearF('searchInputDate')">×</span></div>`;
                } else {
                    tags.innerHTML += `<div class="tag">${txt} <span onclick="clearF('dates')">×</span></div>`;
                }
                
            }

            const filtered = allData.filter(i => {
                
                // 1. Combine EVERY field into one massive string of text
                const searchableText = [
                    i.Name,
                    i.City,
                    i.State,
                    i.Cost,
                    i.Inclusions,
                    i.Org,
                    i.CName,
                    i.CEmail,
                    i.CPhone,
                    i.CNum,
                    i.StartDisplay,
                    i.EndDisplay,
                    i.Start, // Includes raw YYYY-MM-DD
                    i.End,   // Includes raw YYYY-MM-DD
                    (i.Categories || []).join(' '),     // Convert array to string
                    (i.SubCategories || []).join(' '),  // Convert subcategories array to string
                    (i.Hashtags || []).join(' '),       // Convert hashtags array to string
                    (i.ExternalLinks || []).join(' ')   // Convert array to string
                ].join(' ').toLowerCase();
                
                // 2. Ensure EVERY separate word typed exists somewhere in that massive text block
                const matchText = searchWords.length === 0 || searchWords.every(word => {
                    // Escape any special characters in the search word so it doesn't break the regex
                    const safeWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    // The \b ensures the match starts at a word boundary (prevents 'abundance' matching 'dance')
                    const regex = new RegExp('\\b' + safeWord, 'i'); 
                    return regex.test(searchableText);
                });

                const matchCategory = selectedSubCategories.length === 0 || 
                                    (i.Categories && selectedSubCategories.some(cat => i.Categories.includes(cat))) ||
                                    (i.SubCategories && selectedSubCategories.some(cat => i.SubCategories.includes(cat)));
                
                const matchState = !stateVal || (i.State && i.State.toLowerCase() === stateVal.toLowerCase());
                
                let matchDate = true;
                if (dStart || dEnd) {
                    const expStart = i.Start;
                    const expEnd = i.End || i.Start; 
                    
                    if (dStart && dEnd) {
                        matchDate = (expStart <= dEnd) && (expEnd >= dStart);
                    } else if (dStart) {
                        matchDate = (expEnd >= dStart);
                    } else if (dEnd) {
                        matchDate = (expStart <= dEnd);
                    }
                }
                return matchText && matchCategory && matchDate && matchState;
            });

            // Update subcategory badges dynamically based on OTHER filters (Search Words, State, Dates)
            for (const [mainCat, subCats] of Object.entries(CATEGORY_DATA)) {
                subCats.forEach(sub => {
                    const safeId = sub.replace(/[^a-zA-Z0-9]/g, '');
                    const badgeId = `badge-sub-${safeId}`;
                    const badgeEl = document.getElementById(badgeId);
                    if (badgeEl) {
                        const count = allData.filter(item => {
                            const matchState = !stateVal || (item.State && item.State.toLowerCase() === stateVal.toLowerCase());
                            if (!matchState) return false;

                            let matchDate = true;
                            if (dStart || dEnd) {
                                const expStart = item.Start;
                                const expEnd = item.End || item.Start; 
                                if (dStart && dEnd) {
                                    matchDate = (expStart <= dEnd) && (expEnd >= dStart);
                                } else if (dStart) {
                                    matchDate = (expEnd >= dStart);
                                } else if (dEnd) {
                                    matchDate = (expStart <= dEnd);
                                }
                            }
                            if (!matchDate) return false;

                            const searchableText = [
                                item.Name,
                                item.City,
                                item.State,
                                item.Cost,
                                item.Inclusions,
                                item.Org,
                                item.CName,
                                item.CEmail,
                                item.CPhone,
                                item.CNum,
                                item.StartDisplay,
                                item.EndDisplay,
                                item.Start,
                                item.End,
                                (item.Categories || []).join(' '),
                                (item.SubCategories || []).join(' '),
                                (item.Hashtags || []).join(' '),
                                (item.ExternalLinks || []).join(' ')
                            ].join(' ').toLowerCase();

                            const matchText = searchWords.length === 0 || searchWords.every(word => {
                                const safeWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                const regex = new RegExp('\\b' + safeWord, 'i'); 
                                return regex.test(searchableText);
                            });
                            if (!matchText) return false;

                            const itemSubs = item.SubCategories || [];
                            const itemCats = item.Categories || [];
                            return itemSubs.includes(sub) || itemCats.includes(sub);
                        }).length;

                        if (count > 0) {
                            badgeEl.innerText = count;
                            badgeEl.classList.remove('hidden');
                        } else {
                            badgeEl.innerText = '0';
                            badgeEl.classList.add('hidden');
                        }
                    }
                });
            }
            
            renderCards(filtered);
            trackSearchEvent(filtered.length);
        }

        function clearF(id) { 
            if (typeof gtag === 'function') {
                gtag('event', 'close_filter_tag', {
                    'tag_type': id
                });
            }
            if(id === 'dates') {
                document.getElementById('startDateInput').value = '';
                document.getElementById('endDateInput').value = '';
            } else if(id === 'searchInputDate') {
                // Remove the NLP recognized part from the search input
                const sRaw = document.getElementById('searchInput').value.toLowerCase();
                const nlpDate = extractDateRange(sRaw);
                document.getElementById('searchInput').value = nlpDate.cleanText;
            } else {
                document.getElementById(id).value = ''; 
            }
            runFilter(); 
        }

        function clearSearchWord(wordToRemove) {
            if (typeof gtag === 'function') {
                gtag('event', 'close_filter_tag', {
                    'tag_type': 'search_word_tag',
                    'tag_value': wordToRemove
                });
            }
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                let sRaw = searchInput.value;
                // Handle replacing the word case-insensitively, keeping other words
                const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`\\b${escapeRegExp(wordToRemove)}\\b`, 'gi');
                searchInput.value = sRaw.replace(regex, '').replace(/\s+/g, ' ').trim();
            }
            runFilter();
        }

        function validateAndFilter() {
            const start = document.getElementById('startDateInput') ? document.getElementById('startDateInput').value : '';
            const end = document.getElementById('endDateInput') ? document.getElementById('endDateInput').value : '';
            
            if (start && end && start > end) {
                alert("Error: The End Date cannot be earlier than the Start Date.");
                const endEl = document.getElementById('endDateInput');
                if (endEl) endEl.value = ''; 
            }
            runFilter();
        }

        // Event Listeners for Filters
        const searchInputEl = document.getElementById('searchInput');
        if (searchInputEl) searchInputEl.oninput = runFilter;
        const startDateInputEl = document.getElementById('startDateInput');
        if (startDateInputEl) startDateInputEl.onchange = validateAndFilter;
        const endDateInputEl = document.getElementById('endDateInput');
        if (endDateInputEl) endDateInputEl.onchange = validateAndFilter;

        // Setup initial dropdown states

    