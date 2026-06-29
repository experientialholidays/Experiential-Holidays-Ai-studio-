// navbar.js
const navbarHTML = `
    <nav class="bg-white px-4 py-4 sticky top-0 z-50 border-b shadow-sm" style="border-bottom-color: var(--border-soft);">
        <div class="max-w-[1600px] w-full mx-auto px-4 md:px-8 flex flex-wrap justify-between items-center gap-4 relative">
            <h1 class="text-base md:text-xl font-black tracking-widest uppercase text-stone-800">
                <a href="index.html" class="hover:opacity-80 transition">Experiential <span style="color:var(--accent)">Holidays</span></a>
            </h1>
            <button id="mobile-menu-btn" class="text-stone-600 hover:text-stone-900 focus:outline-none p-1 transition">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
            <div id="dropdown-menu" class="absolute right-0 top-12 mt-1 w-52 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-stone-100 py-2 z-50 transform origin-top-right transition-all duration-200 ease-out opacity-0 pointer-events-none scale-95">
                <div id="dropdown-profile" class="hidden px-4 py-2.5 border-b border-stone-100 mb-1.5 bg-stone-50/50 rounded-t-2xl">
                    <span id="admin-badge" class="hidden inline-block mb-1 bg-stone-800 text-white px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase">Admin</span>
                    <p id="user-email" class="text-xs font-semibold text-stone-500 truncate">user@email.com</p>
                </div>
                <div class="px-2 space-y-0.5">
                    <a href="submit.html" class="block px-3 py-2 text-[13px] text-stone-600 hover:bg-[#f5ede8] hover:text-[#a37c6b] font-semibold transition-colors rounded-xl">Submit Experience</a>
                    <a href="dashboard.html" class="block px-3 py-2 text-[13px] text-stone-600 hover:bg-[#f5ede8] hover:text-[#a37c6b] font-semibold transition-colors rounded-xl">Dashboard</a>
                    <a href="contact.html" class="block px-3 py-2 text-[13px] text-stone-600 hover:bg-[#f5ede8] hover:text-[#a37c6b] font-semibold transition-colors rounded-xl">Contact & Support</a>
                </div>
                <div class="border-t border-stone-100 mt-2 pt-2 px-2">
                    <button id="login-btn-menu" class="w-full text-left px-3 py-2 text-[13px] text-stone-600 hover:bg-stone-50 hover:text-stone-900 font-semibold transition-colors rounded-xl">Sign In</button>
                    <button id="logout-btn" class="hidden w-full text-left px-3 py-2 text-[12px] text-red-500 hover:bg-red-50 font-bold tracking-wider uppercase transition-colors rounded-xl">Logout</button>
                </div>
            </div>
        </div>
    </nav>
`;

// Inject the HTML into the page immediately
const siteNavbarEl = document.getElementById('site-navbar');
if (siteNavbarEl) {
    siteNavbarEl.innerHTML = navbarHTML;
}

// Attach the mobile menu opening/closing logic
const menuBtn = document.getElementById('mobile-menu-btn');
const dropdownMenu = document.getElementById('dropdown-menu');

if (menuBtn && dropdownMenu) {
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Ensure any external hard-hides are cleared so the transition can be seen
        dropdownMenu.classList.remove('hidden');

        // Toggle the smooth appearance classes
        dropdownMenu.classList.toggle('opacity-0');
        dropdownMenu.classList.toggle('pointer-events-none');
        dropdownMenu.classList.toggle('scale-95');
        
        dropdownMenu.classList.toggle('opacity-100');
        dropdownMenu.classList.toggle('pointer-events-auto');
        dropdownMenu.classList.toggle('scale-100');
    });

    document.addEventListener('click', (e) => {
        if (!dropdownMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            // Smooth hide
            dropdownMenu.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
            dropdownMenu.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
        }
    });
}
