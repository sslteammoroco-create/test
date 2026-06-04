const fs = require('fs');
const path = require('path');

const files = ['public/index.html', 'public/about.html', 'public/products.html', 'public/product_details.html', 'public/machines.html'];
const baseDir = 'c:\\\\Users\\\\HP\\\\Desktop\\\\jb';

for (const file of files) {
    const filepath = path.join(baseDir, file);
    if (!fs.existsSync(filepath)) continue;
    
    let content = fs.readFileSync(filepath, 'utf-8');

    // Fix mismatched tags: <a ...> ... </button>
    // Specifically for "Catalogue Technique"
    content = content.replace(/<a([^>]*)(href="[^"]*")[^>]*>([^<]*)Catalogue Technique([^<]*)<\/button>/g, '<a$1$2> $3Catalogue Technique$4 </a>');
    
    // Some tags might just be <a ...> ... </button> without a specific text
    content = content.replace(/(<a[^>]*>)(\s*Catalogue Technique\s*)<\/button>/g, '$1$2</a>');

    // Fix <button ...> ... </a>
    // Specifically for "Ajouter au panier"
    content = content.replace(/<button([^>]*)>\s*Ajouter au panier([\s\S]*?)<\/a>/g, '<a href="product_details.html"$1>Ajouter au panier$2</a>');

    // Also check for "Détails" or "Acheter maintenant" mismatched tags
    content = content.replace(/<button([^>]*)>\s*Détails([\s\S]*?)<\/a>/g, '<a href="product_details.html"$1>Détails$2</a>');
    content = content.replace(/<button([^>]*)>\s*Acheter maintenant([\s\S]*?)<\/a>/g, '<a href="product_details.html"$1>Acheter maintenant$2</a>');

    fs.writeFileSync(filepath, content, 'utf-8');
}
console.log("HTML tag mismatches fixed.");

// Fix features.js to use <div> instead of <button>
const featuresJsPath = path.join(baseDir, 'public/js/features.js');
if (fs.existsSync(featuresJsPath)) {
    let featuresJs = fs.readFileSync(featuresJsPath, 'utf-8');
    
    featuresJs = featuresJs.replace(/document\.createElement\('button'\)/g, "document.createElement('div')");
    
    fs.writeFileSync(featuresJsPath, featuresJs, 'utf-8');
    console.log("features.js updated to use <div> for slider buttons.");
}
