const fs = require('fs');

const filepath = 'c:\\\\Users\\\\HP\\\\Desktop\\\\jb\\\\public\\\\products.html';
let content = fs.readFileSync(filepath, 'utf-8');

// The grid starts with: <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
// And ends right before </main>
// I will use regex to replace everything between that opening div and </main>

const startStr = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">';
const endStr = '</main>';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    
    // Add Firebase script before closing </body>
    let newAfter = after;
    if (!newAfter.includes('<script type="module" src="js/products.js"></script>')) {
        newAfter = newAfter.replace('</body>', '    <script type="module" src="js/products.js"></script>\\n</body>');
    }
    
    // Add id to products-grid
    const newGrid = `<div id="products-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
    <!-- Products will be dynamically loaded here by Firebase -->
</div>
`;
    fs.writeFileSync(filepath, before + newGrid + newAfter, 'utf-8');
    console.log("products.html updated with dynamic grid.");
} else {
    console.log("Could not find grid bounds.");
}
