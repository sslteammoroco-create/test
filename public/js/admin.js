import { db } from './firebase-init.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    onSnapshot, 
    query, 
    orderBy, 
    deleteDoc, 
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const productsCollection = collection(db, 'products');
const tableBody = document.getElementById('products-table-body');
const productForm = document.getElementById('product-form');
const modal = document.getElementById('product-modal');

// Load Products with Real-time Updates
function initRealtimeUpdate() {
    const q = query(productsCollection, orderBy('name', 'asc'));
    onSnapshot(q, (snapshot) => {
        tableBody.innerHTML = '';
        if (snapshot.empty) {
            tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-12 text-center text-slate-400 text-sm italic">Aucun produit trouvé.</td></tr>';
            return;
        }

        snapshot.forEach((pDoc) => {
            const product = { id: pDoc.id, ...pDoc.data() };
            const row = `
                <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4">
                        <div class="w-12 h-12 bg-slate-100 overflow-hidden border border-slate-200">
                            <img src="${product.image}" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/100?text=Error'">
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm font-bold text-primary uppercase">${product.name}</div>
                        <div class="text-[10px] text-slate-400 font-mono mt-1">${product.id.substring(0, 8)}</div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 bg-slate-100 text-secondary text-[10px] font-bold uppercase tracking-wider">${product.category}</span>
                    </td>
                    <td class="px-6 py-4 font-headline font-bold text-sm text-primary">
                        ${parseFloat(product.price).toFixed(2)}€
                    </td>
                    <td class="px-6 py-4 text-right space-x-2">
                        <button onclick="editProduct('${product.id}')" class="text-slate-400 hover:text-primary p-2 transition-colors">
                            <span class="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button onclick="deleteProduct('${product.id}')" class="text-slate-400 hover:text-red-600 p-2 transition-colors">
                            <span class="material-symbols-outlined text-sm">delete</span>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    });
}

// Add/Update Functionality
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const productId = document.getElementById('product-id').value;
    const productData = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        category: document.getElementById('category').value,
        image: document.getElementById('image').value,
        description: document.getElementById('description').value,
        updatedAt: new Date().toISOString()
    };

    try {
        if (productId) {
            // Update
            const productRef = doc(db, 'products', productId);
            await updateDoc(productRef, productData);
        } else {
            // Add
            productData.createdAt = new Date().toISOString();
            await addDoc(productsCollection, productData);
        }
        closeModal();
    } catch (error) {
        console.error("Error saving product:", error);
        alert("Erreur lors de l'enregistrement du produit.");
    }
});

// Delete Product
window.deleteProduct = async (id) => {
    if (confirm("Voulez-vous vraiment supprimer cet outil de l'inventaire ?")) {
        try {
            await deleteDoc(doc(db, 'products', id));
        } catch (error) {
            console.error("Error deleting:", error);
        }
    }
};

// Edit Product (Fill form)
window.editProduct = async (id) => {
    // In a real app we'd fetch or find in locally cached list
    // For simplicity, we'll re-fetch specific doc
    const snapshot = await getDocs(productsCollection);
    const pDoc = snapshot.docs.find(d => d.id === id);
    if (!pDoc) return;
    
    const product = pDoc.data();
    document.getElementById('product-id').value = id;
    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
    document.getElementById('category').value = product.category;
    document.getElementById('image').value = product.image;
    document.getElementById('description').value = product.description;
    
    document.getElementById('modal-title').textContent = "Modifier l'Outil";
    modal.classList.remove('hidden');
};

// Modal UI Logic
const showAddModal = document.getElementById('show-add-modal');
const closeModalBtn = document.getElementById('close-modal');
const cancelModalBtn = document.getElementById('cancel-modal');

const closeModal = () => {
    modal.classList.add('hidden');
    productForm.reset();
    document.getElementById('product-id').value = '';
    document.getElementById('modal-title').textContent = "Ajouter un Outil";
};

showAddModal.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

// Initialize
initRealtimeUpdate();
