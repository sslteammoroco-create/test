const fs = require('fs');
const path = require('path');

const files = ['public/index.html', 'public/about.html', 'public/products.html', 'public/product_details.html'];
const baseDir = 'c:\\\\Users\\\\HP\\\\Desktop\\\\jb';

const cssLink = '<link rel="stylesheet" href="css/features.css">';
const jsLink = '<script src="js/features.js"></script>';

for (const file of files) {
    const filepath = path.join(baseDir, file);
    if (!fs.existsSync(filepath)) continue;
    
    let content = fs.readFileSync(filepath, 'utf-8');

    // Add CSS if not present
    if (!content.includes('css/features.css')) {
        content = content.replace('</head>', `    ${cssLink}\n</head>`);
    }

    // Add JS if not present
    if (!content.includes('js/features.js')) {
        content = content.replace('</body>', `    ${jsLink}\n</body>`);
    }

    // Add antigravity class to product cards (flex flex-col wrappers)
    // In index.html and products.html, the cards are like `<div class="flex flex-col">`
    content = content.replace(/<div class="flex flex-col">/g, '<div class="flex flex-col antigravity">');

    // Add antigravity to bento grid items
    content = content.replace(/<div class="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-surface-container-low">/g, '<div class="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-surface-container-low antigravity">');
    content = content.replace(/<div class="relative group overflow-hidden bg-surface-container-low">/g, '<div class="relative group overflow-hidden bg-surface-container-low antigravity">');
    content = content.replace(/<div class="md:col-span-2 relative group overflow-hidden bg-surface-container-low h-64 md:h-auto">/g, '<div class="md:col-span-2 relative group overflow-hidden bg-surface-container-low h-64 md:h-auto antigravity">');

    // Add antigravity to hero images / text
    // The hero image container: `<div class="absolute right-0 top-0 w-1/2 h-full hidden lg:block opacity-40">`
    content = content.replace(/<div class="absolute right-0 top-0 w-1\/2 h-full hidden lg:block opacity-40">/g, '<div class="absolute right-0 top-0 w-1/2 h-full hidden lg:block opacity-40 antigravity">');
    content = content.replace(/<h1 class="font-headline text-6xl md:text-8xl font-bold text-white tracking-tighter leading-\[0\.9\] mb-8">/g, '<h1 class="font-headline text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9] mb-8 antigravity">');

    // Replace images with sliders in product cards
    // This looks for `<a href="product_details.html" class="block w-full h-full"><img ... src="URL"/></a>`
    content = content.replace(/<a href="product_details.html" class="block w-full h-full"><img alt="([^"]+)" class="([^"]*)" src="([^"]+)"\/?><\/a>/g, (match, alt, classes, src) => {
        // Generate alternative placeholder image
        const altSrc1 = "https://images.unsplash.com/photo-1565439399-1da88b1ccf28?auto=format&fit=crop&q=80&w=600";
        const altSrc2 = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600";
        
        return `<a href="product_details.html" class="block w-full h-full">
            <div class="slider-container">
                <div class="slider-track">
                    <div class="slider-slide"><img alt="${alt}" class="${classes}" src="${src}"/></div>
                    <div class="slider-slide"><img alt="${alt} - Vue 2" class="${classes}" src="${altSrc1}"/></div>
                    <div class="slider-slide"><img alt="${alt} - Vue 3" class="${classes}" src="${altSrc2}"/></div>
                </div>
            </div>
        </a>`;
    });

    fs.writeFileSync(filepath, content, 'utf-8');
}
console.log("Features applied to HTML files.");
