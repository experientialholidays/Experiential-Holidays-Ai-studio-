const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = fs.readFileSync('public/index.html', 'utf8');
const dom = new JSDOM(html);
const scripts = dom.window.document.querySelectorAll('script');
scripts.forEach((s, i) => {
    if (s.textContent) {
        fs.writeFileSync(`script_${i}.js`, s.textContent);
    }
});
