// Cart Logic
let cart = JSON.parse(localStorage.getItem('cncCart')) || [];

function saveCart() {
    localStorage.setItem('cncCart', JSON.stringify(cart));
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    badges.forEach(badge => {
        badge.innerText = count;
        if (count > 0) {
            badge.style.display = 'inline-flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

function addToCart(id, name, price, img, quantity = 1) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ id, name, price, img, quantity });
    }
    saveCart();
    updateCartBadge();
    renderCart();

    // Show a small UI feedback
    alert(`${name} added to cart!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartBadge();
    renderCart();
}

// Cart UI (Modal)
function injectCartUI() {
    const html = `
    <div id="cart-modal" class="fixed inset-0 bg-black/50 z-[100] hidden flex justify-end">
        <div class="bg-surface w-full max-w-md h-full shadow-2xl flex flex-col transform transition-transform translate-x-full" id="cart-drawer">
            <div class="px-6 py-4 border-b border-surface-container-highest flex justify-between items-center">
                <h2 class="font-headline text-xl font-bold">Votre Panier</h2>
                <button id="close-cart" class="p-2 hover:bg-slate-100 rounded-full">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4" id="cart-items-container">
                <!-- Items will be rendered here -->
            </div>
            
            <div class="px-6 py-6 border-t border-surface-container-highest bg-surface-container-low">
                <div class="flex justify-between items-center mb-6">
                    <span class="font-label font-bold uppercase text-secondary tracking-widest text-sm">Total</span>
                    <span class="font-headline text-2xl font-bold text-primary" id="cart-total">0.00€</span>
                </div>
                <button class="w-full bg-primary text-white py-4 font-label font-bold uppercase tracking-widest hover:bg-primary-container transition-colors" onclick="alert('Proceeding to checkout. (Frontend Demo Only)')">Passer à la caisse</button>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    document.getElementById('close-cart').addEventListener('click', toggleCart);
    document.getElementById('cart-modal').addEventListener('click', (e) => {
        if (e.target.id === 'cart-modal') toggleCart();
    });
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = `<p class="text-secondary text-sm mt-4">Votre panier est vide.</p>`;
    }

    cart.forEach(item => {
        total += item.price * item.quantity;
        const itemHtml = `
            <div class="flex gap-4 p-4 bg-surface-container-highest">
                <div class="w-16 h-16 bg-white overflow-hidden">
                    <img src="${item.img || ''}" alt="${item.name}" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                    <h4 class="font-headline font-bold text-sm text-primary mb-1">${item.name}</h4>
                    <p class="font-label text-xs text-secondary">${item.price.toFixed(2)}€ x ${item.quantity}</p>
                </div>
                <button class="text-error hover:text-error-container" onclick="removeFromCart('${item.id}')">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHtml);
    });

    totalEl.innerText = total.toFixed(2) + '€';
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    const drawer = document.getElementById('cart-drawer');
    
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        // small delay to allow display:block to apply before animating
        setTimeout(() => drawer.classList.remove('translate-x-full'), 10);
    } else {
        drawer.classList.add('translate-x-full');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

// Attach Badge to Cart Buttons
function attachCartBadges() {
    const cartBtns = document.querySelectorAll('button:has(.material-symbols-outlined:contains("shopping_cart")), button:has(.material-symbols-outlined:contains("shopping_bag")), button[id="open-cart-btn"]');
    cartBtns.forEach(btn => {
        // Exclude the add_shopping_cart buttons on products
        if(btn.innerHTML.includes('add_shopping_cart')) return;
        
        btn.addEventListener('click', toggleCart);
        
        // ensure badge structural html exists
        if (!btn.querySelector('.cart-badge')) {
            btn.classList.add('relative');
            btn.insertAdjacentHTML('beforeend', `<span class="cart-badge absolute -top-1 -right-1 bg-error text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-label" style="display:none;">0</span>`);
        }
    });
}

function initAddToCartButtons() {
    const addBtns = document.querySelectorAll('.add-to-cart-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const image = btn.getAttribute('data-image');
            
            // Allow quantity override from detail page
            const qtyInput = document.getElementById('qty-input');
            const qty = qtyInput ? parseInt(qtyInput.value) : 1;

            addToCart(id, name, price, image, qty);
        });
    });
}

// Contact form — sends to server API + saves to Firestore
function initForms() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Envoi en cours...';
        btn.disabled = true;

        const data = {
            fullName: contactForm.querySelector('[name="fullName"]')?.value || contactForm.querySelectorAll('input[type="text"]')[0]?.value || '',
            company: contactForm.querySelector('[name="company"]')?.value || contactForm.querySelectorAll('input[type="text"]')[1]?.value || '',
            email: contactForm.querySelector('[name="email"]')?.value || contactForm.querySelector('input[type="email"]')?.value || '',
            requestType: contactForm.querySelector('[name="requestType"]')?.value || contactForm.querySelector('select')?.value || '',
            details: contactForm.querySelector('[name="details"]')?.value || contactForm.querySelector('textarea')?.value || '',
            sentAt: new Date().toISOString()
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.success) {
                alert('✅ Votre demande a bien été envoyée ! Nous vous répondrons dans les plus brefs délais.');
                contactForm.reset();
            } else {
                alert('❌ ' + result.message);
            }
        } catch (err) {
            alert('❌ Erreur réseau. Vérifiez votre connexion et réessayez.');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}

// Add simple routing based on URL params for details page
function handleDynamicDetails() {
    if(!window.location.pathname.includes('product_details.html')) return;
    
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    if(productId && window.productsData && window.productsData[productId]) {
        const p = window.productsData[productId];
        const titleEl = document.querySelector('h1');
        const priceEl = document.querySelector('.product-price');
        const imgEl = document.querySelector('.main-product-image');
        const btn = document.querySelector('.add-to-cart-btn');
        
        if(titleEl) titleEl.innerText = p.name;
        if(priceEl) priceEl.innerText = p.price.toFixed(2) + '€';
        if(imgEl && p.image) {
            imgEl.src = p.image;
            imgEl.dataset.alt = p.alt || '';
        }
        
        if(btn) {
            btn.dataset.id = p.id;
            btn.dataset.name = p.name;
            btn.dataset.price = p.price;
            btn.dataset.image = p.image;
        }
    }
}

// Simple product catalog data for details page navigation
window.productsData = {
    '1': { id: '1', name: 'Fraise Hélicoïdale Up-Down', price: 48.50, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVZcvqF2YTYqQLFFrAmtiyhULDKfPctJ652M0kdRSuzhEL_sxPg9CYP9clB_3bmo4tfZXHLYZHGhg4m3iDqOHoe7FxtDYVsTnD_wGdoxNT51rGNwrFlsUZukXf80HSYd07Oeg1b9f-VmkAKjEOv-x1QRKfB79HsoeswWl1jMV1qb786d8gbAI1_4MHbjzYG8Qc7cmgXrEOPObqF1kxxZk7wXXI1zQZxKq27RKVBd6aB4wJ604FxVKDM49sWvW6Cot1-Kg4f2NzOQ', alt: 'solid carbide 3-flute end mill tool' },
    '2': { id: '2', name: 'Fraise 1 Dent Polie Alu', price: 32.20, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq6msvHT-b74N7xP7WvsJHpJ1pAkcrhG9LRXfqWY6oxOkRjVZPPwKLQOYS-hSSBg2_jgNYkNig0n7whnyUlHG2wrSn55CAV0vUdIq0LcT9rxIeN-6muS0o0PTBBN2rESOXL1M0VCEaFCSQVUqtvKfAAIiTWGBdHy_CEB-18ujf0lNJasv1j_mDNOK4tRpB3HdTmKPEkmsThwhNWDlob8WGW0MGU2Gxx7EK01tuA5YZhsa7LC82mcL_6jM_J2gC82fVxxfOqKH3FQ', alt: 'aluminum cutting CNC bit' },
    '3': { id: '3', name: 'Fraise à Surfaçer à Plaquettes', price: 125.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVAH_ucKmxqiHxWKrFdz7Ej96uykcr64SbB1wkTR-HVUzjYY4eYouXgpzjpcsOKthwQiK8RVCc26b2kQEqrJChAiv14AoU9HH0DnaQSA_lfmelWM6cRYYhHYLWfdUDpTGMKT-sN4NjqONI-IvT3FDnIHlaEMj_Msvr2btIDJSl3MWA5of_ui37jQRBXtHQ633uwQ4aAjl8xXM9WpBsm_F-eHzbxCoo5QRPc923vpqBsPRv9975hquw-dANKutSa0w6swI-KG8TFQ', alt: 'surfacing tool' },
    '4': { id: '4', name: 'Fraise Diamant PCD', price: 210.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCot4BDKF1pV0UhmcscGuD3cBwSwQP-GbzfkeL5lmDJoP3nHIJxEp1-XTsypsabSfJ3UZYyaOAKYFyZsj2K-kN_jIghiGn4I-O9KqtWlc9PUW5hx4ePAHhtcpfRoTlgNj3RRYgqlMrwJcJN5E9iDWXKE8jx08KzCEWyywr81QNbd0IL8kf1doEsQeq6_10B139LcTtY7V0ebHXMH4mhVzg7yXiF-r6cTfEr1gO0SIAsHTVk9z4-F49BbW3URrRxLuHVwCVNBQGO7w', alt: 'diamond-tipped PCD CNC router' },
    '5': { id: '5', name: 'Fraise spirale à coupe montante', price: 25.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDXJOFtcikiZRXsKlE3yEtfoyskwSRANyYmByW_mdyPn4CH27ZhK_SJ-O1s85hRJSUu0BZuRQBBYHL9NFDTy2bhFQsghAOClUbU07V03_NI47YGwuIPLwQCavNvf4gXdymEvIP4sc2zfQuB1rj_SPaXEuV0AK9znHUOUa5LS0PyfrhHmDRyjgEUgDHvs8xDjLBOhs52sgTbETquPMeAZRIQMQVG7lGwCZAlAgINVhCOgZ8r7ghMIwo3sGodX2pgrbkiwzJhk-ETA', alt: 'single-flute spiral CNC router bit' },
    '6': { id: '6', name: 'Fraise de gravure en V', price: 18.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBVx-4xn1hnkFd1kXwKo-WWRpP39K5l4zvjvx3IUFD3LfhS3CUaA1ijCivQAx3TNR00AZIREUzfYBDIhpo8ZkfIX8VA05iVP1BN_C-Wnshouo4aSDxC_IfPyGVipe_bdR5-QrEmXnH__4vuXXCtdVunJGyzdv5pK6LMmx236KFDiV-f6fFwXDTMard8qu1yUtnAG_ih3jYH_Z__jjT_V6h3yLri2-xH1pwMx5da4VCAFdmUOZpSapwVKz586TTuvr_uC1ax1zIGQ', alt: 'V-groove engraving router bit' },
    '7': { id: '7', name: 'Fraise compression spirale', price: 45.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ8ZyHr4x9znp4Mgyo7AbnBpFmGO55oscHI4zlCb8plSy5SFI_kCA-2ygT9PgLimA7UtlNdZtYf5K-hcG01XcCKabL53e39CD_cXdcFKkGVJpGGGJ4srDqLxW3dlROGzqJMoTsZ0ZBIj9a8I46NQuBmUOSPZKUy6Gv7mOZwV5Adca0Cg02jovU-YNnpLuGPjDVtNfX4wIkXDNF-vLCyGz3umk2SaWeCCQ9P5SGDkZ-LzMjxCwPI0FSw2YqfqXbeRKifbspC8BS-w', alt: 'Up-down compression spiral CNC bit' }
};

document.addEventListener('DOMContentLoaded', () => {
    // Custom contains pseudo-selector for finding the cart icon
    jQuery.expr[':'].contains = function(a, i, m) {
      return jQuery(a).text().toUpperCase()
          .indexOf(m[3].toUpperCase()) >= 0;
    }; // using jQuery syntax logic just for the contains - wait, we don't have jQuery.
    
    // We will find headers directly. 
    // This removes jQuery dependency, overriding previous error prone attachCartBadges above.
    const icons = document.querySelectorAll('.material-symbols-outlined');
    icons.forEach(ic => {
        if(ic.innerText.trim() === 'shopping_cart' && !ic.closest('.add-to-cart-btn')) {
            const btn = ic.closest('button');
            if(btn) {
                btn.id = 'open-cart-btn'; // Normalize id so we can target easily
            }
        }
    });

    injectCartUI();
    attachCartBadges();
    initAddToCartButtons();
    initForms();
    handleDynamicDetails();
    updateCartBadge();
    renderCart();
    injectWhatsAppButton();
});

function injectWhatsAppButton() {
    const phoneNumber = "213555555555"; // Remplacez par votre numéro (ex: 213555000111)
    const message = encodeURIComponent("Bonjour, j'aimerais avoir plus d'informations sur vos produits CNC.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    const html = `
    <a href="${whatsappUrl}" target="_blank" class="fixed bottom-6 right-6 z-[99] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center" title="Contactez-nous sur WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
    </a>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}
