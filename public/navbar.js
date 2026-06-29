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
            <div id="dropdown-menu" class="hidden absolute right-0 top-12 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-100 py-2 z-50 transform origin-top-right transition-all">
                <div id="dropdown-profile" class="hidden px-4 py-3 border-b border-stone-100 mb-2 bg-stone-50/50">
                    <span id="admin-badge" class="hidden inline-block mb-1 bg-stone-800 text-white px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase">Admin</span>
                    <p id="user-email" class="text-sm font-semibold text-stone-500 truncate">user@email.com</p>
                </div>
                <a href="submit.html" class="block px-4 py-2.5 text-sm text-stone-600 hover:bg-[#f5ede8] hover:text-[#a37c6b] font-bold transition rounded-lg mx-2">Submit</a>
                <a href="dashboard.html" class="block px-4 py-2.5 text-sm text-stone-600 hover:bg-[#f5ede8] hover:text-[#a37c6b] font-bold transition rounded-lg mx-2">Dashboard</a>
                <a href="contact.html" class="block px-4 py-2.5 text-sm text-stone-600 hover:bg-[#f5ede8] hover:text-[#a37c6b] font-bold transition rounded-lg mx-2">Contact / Support</a>
                <div class="border-t border-stone-100 mt-2 pt-2">
                    <button id="login-btn-menu" class="w-full text-left px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 font-bold transition">Sign In</button>
                    <button id="logout-btn" class="hidden w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-black tracking-wider uppercase transition">Logout</button>
                </div>
            </div>
        </div>
    </nav>
`;

// Inject the HTML into the page immediately
document.getElementById('site-navbar').innerHTML = navbarHTML;

// Attach the mobile menu opening/closing logic
const menuBtn = document.getElementById('mobile-menu-btn');
const dropdownMenu = document.getElementById('dropdown-menu');

if (menuBtn && dropdownMenu) {
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!dropdownMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });
}
