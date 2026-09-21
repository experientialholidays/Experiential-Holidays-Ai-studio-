// navbar.js
const logoUrl = "https://firebasestorage.googleapis.com/v0/b/submit-a.firebasestorage.app/o/LogoExpHol.png?alt=media&token=abb2ac3b-9c43-46b9-9d03-34219556da5e";

const navbarHTML = `
    <nav class="bg-white px-3 py-2.5 sm:py-3 sticky top-0 z-50 border-b shadow-sm" style="border-bottom-color: var(--border-soft);">
        <div class="max-w-[1600px] w-full mx-auto px-1 sm:px-4 md:px-8 flex items-center justify-between relative gap-2 sm:gap-4">
            <!-- Left Side: Logo + Title + Subtitle -->
            <div class="flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0 mr-1 sm:mr-2">
                <a href="/" class="shrink-0 flex items-center">
                    <img id="header-logo" src="${logoUrl}" alt="Experiential Holidays Logo" class="h-9 sm:h-11 md:h-12 w-auto object-contain">
                </a>
                <div class="flex flex-col justify-center flex-1 min-w-0">
                    <h1 class="text-sm sm:text-base md:text-xl font-black tracking-widest uppercase text-stone-800 leading-tight truncate"> 
                        <a href="/" class="hover:opacity-80 transition">Experiential <span style="color:var(--accent)">Holidays</span></a>
                    </h1>
                    <div class="text-[8.5px] xs:text-[9.5px] sm:text-[11px] md:text-[12.5px] text-stone-500 font-bold tracking-wider sm:tracking-widest uppercase mt-0.5 leading-tight">
                        <span class="inline sm:inline-block">Retreats | Workshops | Wellness | Journeys</span>
                        <span class="block sm:inline font-black text-stone-700 mt-0.5 sm:mt-0"><span class="hidden sm:inline"> | </span>India</span>
                    </div>
                </div>
            </div>
            
            <!-- Right Side: Account / Hamburger Menu Button -->
            <button id="mobile-menu-btn" class="text-stone-600 hover:text-stone-900 focus:outline-none p-1.5 transition shrink-0 ml-auto" title="Account Menu">
                <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <div id="dropdown-menu" class="absolute right-1 sm:right-4 md:right-8 top-14 w-44 bg-white rounded-2xl shadow-2xl border border-stone-100 py-1 z-50 transform origin-top-right transition-all duration-200 scale-95 opacity-0 pointer-events-none">
                <div id="dropdown-profile" class="hidden px-4 py-2 border-b border-stone-100 mb-1 bg-stone-50/50">
                    <span id="admin-badge" class="hidden inline-block mb-1 bg-stone-800 text-white px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase">Admin</span>
                    <p id="user-email" class="text-xs font-semibold text-stone-500 truncate">user</p>
                </div>
                <a href="/about" class="block px-4 py-1.5 text-base text-stone-500 hover:bg-[#f5ede8] hover:text-[#a37c6b] font-medium transition rounded-xl mx-2">About</a>
                <a href="/submit" class="block px-4 py-1.5 text-base text-stone-500 hover:bg-[#f5ede8] hover:text-[#a37c6b] font-medium transition rounded-xl mx-2">Submit</a>
                <a href="/dashboard" class="block px-4 py-1.5 text-base text-stone-500 hover:bg-[#f5ede8] hover:text-[#a37c6b] font-medium transition rounded-xl mx-2">Dashboard</a>
                <a href="/contact" class="block px-4 py-1.5 text-base text-stone-500 hover:bg-[#f5ede8] hover:text-[#a37c6b] font-medium transition rounded-xl mx-2">Contact</a>
                <div class="border-t border-stone-100 mt-1 pt-1 mb-1">
                    <button id="login-btn-menu" class="w-[calc(100%-16px)] text-left px-4 py-1.5 text-base text-stone-500 hover:bg-stone-50 hover:text-stone-900 font-medium transition rounded-xl mx-2">Sign In</button>
                    <button id="logout-btn" class="hidden w-[calc(100%-16px)] text-left px-4 py-1.5 text-base text-stone-500 hover:bg-[#f5ede8] hover:text-[#a37c6b] font-medium transition rounded-xl mx-2">Logout</button>
                </div>
            </div>
        </div>
    </nav>
`;

function initNavbar() {
    const targetNavbar = document.getElementById('site-navbar');
    if (!targetNavbar) return false;
    
    targetNavbar.innerHTML = navbarHTML;

    // Attach the mobile menu opening/closing logic
    const menuBtn = document.getElementById('mobile-menu-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');

    function toggleMenu(forceClose = false) {
        if (!dropdownMenu) return;
        if (forceClose || dropdownMenu.classList.contains('scale-100')) {
            dropdownMenu.classList.remove('scale-100', 'opacity-100', 'pointer-events-auto');
            dropdownMenu.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
        } else {
            dropdownMenu.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
            dropdownMenu.classList.add('scale-100', 'opacity-100', 'pointer-events-auto');
        }
    }

    if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        document.addEventListener('click', (e) => {
            if (!dropdownMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                toggleMenu(true);
            }
        });
    }
    return true;
}

// Attempt immediate execution
if (!initNavbar()) {
    // Fallback to DOMContentLoaded if the element wasn't ready yet
    document.addEventListener("DOMContentLoaded", initNavbar);
}
