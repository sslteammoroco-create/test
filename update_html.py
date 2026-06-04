import os
import re

files = ['public/index.html', 'public/about.html', 'public/products.html', 'public/product_details.html']
base_dir = r'c:\Users\HP\Desktop\jb'

whatsapp_widget = '''
<!-- WhatsApp Floating Widget -->
<a href="https://wa.me/212665376678" target="_blank" class="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all z-50 flex items-center justify-center group">
    <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
    </svg>
    <span class="absolute right-full mr-4 bg-white text-primary text-xs font-bold px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Support WhatsApp</span>
</a>
'''

mobile_menu_script = '''
<script>
    // Mobile menu toggle logic
    document.addEventListener('DOMContentLoaded', () => {
        const menuBtn = document.querySelector('button.md\\\\:hidden');
        const navMenu = document.querySelector('.hidden.md\\\\:flex.items-center, nav .hidden.md\\\\:flex');
        
        if (menuBtn && navMenu) {
            menuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('hidden');
                navMenu.classList.toggle('flex');
                navMenu.classList.toggle('flex-col');
                navMenu.classList.toggle('absolute');
                navMenu.classList.toggle('top-full');
                navMenu.classList.toggle('left-0');
                navMenu.classList.toggle('w-full');
                navMenu.classList.toggle('bg-white');
                navMenu.classList.toggle('dark:bg-[#001e40]');
                navMenu.classList.toggle('p-8');
                navMenu.classList.toggle('shadow-lg');
            });
        }
    });
</script>
'''

for file in files:
    filepath = os.path.join(base_dir, file)
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, does not exist.")
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Navigation Links
    # Using specific replaces for precision instead of regex that might match too broadly.
    # We replace href="#" for Accueil, Produits, À Propos, Bois, Aluminium, Diamant, Gravure
    
    # We use a pattern that catches href="#" specifically when immediately followed by the text
    content = re.sub(r'href="#"([^>]*)>Accueil</a>', r'href="index.html"\1>Accueil</a>', content)
    content = re.sub(r'href="#"([^>]*)>Produits</a>', r'href="products.html"\1>Produits</a>', content)
    content = re.sub(r'href="#"([^>]*)>À Propos</a>', r'href="about.html"\1>À Propos</a>', content)
    
    # Footer Links
    content = re.sub(r'href="#"([^>]*)>Bois</a>', r'href="products.html"\1>Bois</a>', content)
    content = re.sub(r'href="#"([^>]*)>Aluminium</a>', r'href="products.html"\1>Aluminium</a>', content)
    content = re.sub(r'href="#"([^>]*)>Diamant</a>', r'href="products.html"\1>Diamant</a>', content)
    content = re.sub(r'href="#"([^>]*)>Gravure</a>', r'href="products.html"\1>Gravure</a>', content)

    # 2. Update Product Buttons
    # Buttons to <a> tags
    content = re.sub(r'<button([^>]*)>\s*Acheter maintenant\s*([^<]*)</button>', r'<a href="product_details.html"\1>Acheter maintenant\2</a>', content)
    content = re.sub(r'<button([^>]*)>\s*Détails\s*<span', r'<a href="product_details.html"\1>Détails <span', content)
    content = re.sub(r'</button>\s*</div>\s*</div>\s*</div>\s*<!-- Produit', r'</a>\n</div>\n</div>\n</div>\n<!-- Produit', content) # Fix for closing tag, but it's simpler to just replace </button> correctly.
    # Actually, the button replacement for Détails is:
    # <button class="...">Détails <span.../span></button> -> <a href="..." class="...">Détails <span.../span></a>
    content = re.sub(r'<button([^>]*)>([^<]*)Détails([^<]*<span[^>]*>[^<]*</span>\s*)</button>', r'<a href="product_details.html"\1>\2Détails\3</a>', content)
    content = re.sub(r'<button([^>]*)>([^<]*)Ajouter au panier([^<]*<span[^>]*>[^<]*</span>\s*)</button>', r'<a href="product_details.html"\1>\2Ajouter au panier\3</a>', content)
    
    # Also fix any "Ajouter au panier" that doesn't have an icon inside:
    content = re.sub(r'<button([^>]*)>\s*Ajouter au panier\s*</button>', r'<a href="product_details.html"\1>Ajouter au panier</a>', content)

    # Wrap product images in anchor tags
    content = re.sub(r'(<img alt="(Fraise|Aluma-Cut|Mise en bout|Fraise Spirale)[^"]*" class="[^"]*" src="[^"]*".*?>)', r'<a href="product_details.html" class="block w-full h-full">\1</a>', content)

    # 3. Add WhatsApp Widget and Mobile Script
    if '<!-- WhatsApp Floating Widget -->' not in content:
        content = content.replace('</body>', whatsapp_widget + '\n' + mobile_menu_script + '\n</body>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("HTML update completed.")
