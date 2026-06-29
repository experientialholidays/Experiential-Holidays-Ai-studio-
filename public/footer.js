// footer.js
document.addEventListener("DOMContentLoaded", function() {
    const footerHTML = `
        <footer class="w-full text-center py-2 mt-4 border-t text-stone-400" style="border-top-color: var(--border-soft);">
            <!-- Added flex-nowrap, whitespace-nowrap, and responsive text/gap sizes to force one line -->
            <div class="max-w-[1200px] mx-auto flex justify-center items-center flex-nowrap whitespace-nowrap gap-0.5 sm:gap-2 md:gap-4 font-semibold text-[11px] sm:text-xs md:text-sm px-1">
                <a href="contact.html" class="hover:text-[#a37c6b] transition">Contact</a>
                <span class="text-stone-300 select-none">|</span>
                <a href="privacy.html" class="hover:text-[#a37c6b] transition">Privacy Policy</a>
                <span class="text-stone-300 select-none">|</span>
                <a href="terms.html" class="hover:text-[#a37c6b] transition">Terms & Conditions</a>
                <span class="text-stone-300 select-none">|</span>
                <a href="https://www.instagram.com/experiential_holidays" target="_blank" rel="noopener noreferrer" class="hover:text-[#a37c6b] transition">Instagram</a>
            </div>
        </footer>
    `;

    // 1. Inject global reset styles to ensure html and body allow full-screen height
    const coreStyle = document.createElement('style');
    coreStyle.textContent = `
        html, body { height: 100%; margin: 0; padding: 0; }
    `;
    document.head.appendChild(coreStyle);

    const footerTarget = document.getElementById('site-footer');
    if (footerTarget) {
        // 2. Get the exact parent element wrapping the footer
        const parentElement = footerTarget.parentElement;
        
        if (parentElement) {
            // 3. Force that parent container to stretch to full viewport height and use flexbox
            parentElement.style.display = 'flex';
            parentElement.style.flexDirection = 'column';
            parentElement.style.minHeight = '100vh';
        }

        // 4. Force the footer placeholder to stick to the absolute bottom of that parent
        footerTarget.style.marginTop = 'auto';
        footerTarget.style.width = '100%';
        
        // 5. Render the HTML
        footerTarget.innerHTML = footerHTML;
    }
});
