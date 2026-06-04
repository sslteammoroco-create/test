const fs = require('fs');
const path = require('path');

const files = ['public/index.html', 'public/about.html', 'public/products.html', 'public/product_details.html'];
const baseDir = 'c:\\\\Users\\\\HP\\\\Desktop\\\\jb';

for (const file of files) {
    const filepath = path.join(baseDir, file);
    if (!fs.existsSync(filepath)) continue;
    let content = fs.readFileSync(filepath, 'utf-8');
    
    // Replace <a href="#">Machines</a> with <a href="machines.html">Machines</a>
    // We can use a regex to match the anchor text
    content = content.replace(/href="#"([^>]*)>Machines<\/a>/g, 'href="machines.html"$1>Machines</a>');

    fs.writeFileSync(filepath, content, 'utf-8');
}
console.log("Machines link updated.");
