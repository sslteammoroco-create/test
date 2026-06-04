const fs = require('fs');
const path = require('path');

const files = ['public/index.html', 'public/about.html', 'public/products.html', 'public/product_details.html'];
const baseDir = 'c:\\\\Users\\\\HP\\\\Desktop\\\\jb';

for (const file of files) {
    const filepath = path.join(baseDir, file);
    if (!fs.existsSync(filepath)) continue;
    
    let content = fs.readFileSync(filepath, 'utf-8');

    // Fix remaining footer contacts
    content = content.replace(/href="#"([^>]*)>info@cnctools\.com<\/a>/g, 'href="mailto:info@cnctools.com"$1>info@cnctools.com</a>');
    content = content.replace(/href="#"([^>]*)>\(555\) 012-3456<\/a>/g, 'href="tel:5550123456"$1>(555) 012-3456</a>');

    fs.writeFileSync(filepath, content, 'utf-8');
}

console.log("Footer contact links updated.");
