const fs = require('fs');
const path = require('path');

const files = ['index.html', 'about.html', 'products.html', 'product_details.html', 'machines.html'];
const baseDir = 'c:\\\\Users\\\\HP\\\\Desktop\\\\jb\\\\public';

const newHeaderTemplate = `
<header class="bg-white dark:bg-[#001e40] shadow-sm dark:shadow-none sticky top-0 z-50">
<nav class="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto relative">
    
    <!-- Left: Logo -->
    <div class="flex-1 flex justify-start">
        <a href="index.html" class="font-['Space_Grotesk'] text-xl font-bold tracking-tighter text-[#001e40] dark:text-white uppercase block">
            <div class="flex items-center gap-3">
                <img alt="JBGERMANY Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD56slf-yqw9R0BOfNlcB7T7PbF_9N2prgmV-ETg4LM1-gKesZ3Z9k8xl4liSTPg4GTRaczy3VO2Wznl-1LpLUogdZyjGOwdB9dfW7VIpS0pJff6QJxDJhwj_q6_5sl4QZPHKZLc2K7Im0qlursY0QjdDvYz4co4mhYs1m4P27GnSiIVFlladCDQptYbmT_81jeSkDCjUsL_8Ke9x9xDiHcGUv-nMif_NdvAWMrHSkslUprX91hFBONgkqdvykqM1gimW1Qief3V5c"/>
                <span>JBGERMANY</span>
            </div>
        </a>
    </div>

    <!-- Center: Navigation (Absolute perfectly centered) -->
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-8 font-['Space_Grotesk'] tracking-tight text-sm uppercase">
        <a class="nav-link text-slate-600 dark:text-slate-400 hover:text-[#003366] dark:hover:text-blue-200 transition-colors duration-200" href="index.html" data-page="index">Accueil</a>
        <a class="nav-link text-slate-600 dark:text-slate-400 hover:text-[#003366] dark:hover:text-blue-200 transition-colors duration-200" href="products.html" data-page="products">Produits</a>
        <a class="nav-link text-slate-600 dark:text-slate-400 hover:text-[#003366] dark:hover:text-blue-200 transition-colors duration-200" href="machines.html" data-page="machines">Machines</a>
        <a class="nav-link text-slate-600 dark:text-slate-400 hover:text-[#003366] dark:hover:text-blue-200 transition-colors duration-200" href="about.html" data-page="about">À Propos</a>
    </div>

    <!-- Right: Tools -->
    <div class="flex-1 flex justify-end items-center gap-6">
        <div class="relative hidden lg:block">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input class="bg-surface-container-high border-none text-xs py-2 pl-10 pr-4 w-64 focus:ring-1 focus:ring-primary" placeholder="Rechercher des composants..." type="text"/>
        </div>
        <button class="md:hidden text-primary dark:text-white">
            <span class="material-symbols-outlined">menu</span>
        </button>
    </div>

</nav>
</header>
`;

for (const file of files) {
    const filepath = path.join(baseDir, file);
    if (!fs.existsSync(filepath)) continue;
    let content = fs.readFileSync(filepath, 'utf-8');

    if (content.includes('<header')) {
        content = content.replace(/<header[\s\S]*?<\/header>/, newHeaderTemplate.trim());
    } else if (content.includes('<nav class="bg-white')) {
        content = content.replace(/<nav class="bg-white[\s\S]*?<\/nav>/, newHeaderTemplate.trim());
    }

    const pageName = file.replace('.html', '');
    const defaultClasses = 'text-slate-600 dark:text-slate-400 hover:text-[#003366] dark:hover:text-blue-200 transition-colors duration-200';
    const activeClasses = 'text-[#003366] dark:text-blue-300 border-b-2 border-[#003366] dark:border-blue-300 pb-1';
    
    let activePage = pageName;
    if (pageName === 'product_details') activePage = 'products';

    const searchString = '<a class="nav-link ' + defaultClasses + '" href="' + activePage + '.html" data-page="' + activePage + '">';
    const replaceString = '<a class="nav-link ' + activeClasses + '" href="' + activePage + '.html" data-page="' + activePage + '">';
    content = content.replace(searchString, replaceString);

    fs.writeFileSync(filepath, content, 'utf-8');
}
console.log("Headers standardized and centered.");
