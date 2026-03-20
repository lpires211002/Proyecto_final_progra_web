tailwind.config = {}

// --- SUPABASE CONFIGURATION ---
// PASTE YOUR SUPABASE URL AND ANON KEY HERE TO ENABLE DYNAMIC PRODUCTS
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_API_KEY';

let supabaseClient = null;
if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

async function fetchProducts() {
    if (!supabaseClient) return null;
    try {
        const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    } catch (e) {
        console.error("Supabase Error:", e.message);
        return null;
    }
}

function renderSupabaseProducts(products) {
    const grid = document.querySelector('section.grid');
    if (!grid) return;
    
    // Clear hardcoded products
    grid.innerHTML = '';
    
    products.forEach((product, index) => {
        // Retain the hybrid standard/asymmetric editorial layout
        let extraClass = '';
        if (index === 1 || index === 5) extraClass = 'mt-0 lg:mt-12';
        if (index === 3) extraClass = 'lg:-mt-12';
        
        const cardHTML = `
        <div class="group ${extraClass}">
            <div class="aspect-[3/4] overflow-hidden bg-surface-container mb-6 relative">
                <img alt="${product.name}"
                    class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    src="${product.image_url}" />
                <button class="add-to-cart-btn absolute bottom-6 right-6 lg:left-1/2 lg:-translate-x-1/2 bg-white text-primary py-3 px-6 font-label text-[10px] uppercase tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-xl whitespace-nowrap z-10"
                    data-name="${product.name}" 
                    data-price="${product.price}" 
                    data-img="${product.image_url}" 
                    data-size="M">
                    Add to Cart
                </button>
            </div>
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-body text-sm font-semibold tracking-wide text-on-surface mb-1">${product.name}</h3>
                    <p class="font-label text-[10px] uppercase tracking-widest text-outline">${product.color || 'Standard'}</p>
                    <p class="product-price font-body font-bold text-sm mt-1">$${product.price}</p>
                </div>
            </div>
        </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardHTML);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 0. Fetch Map Products BEFORE DOM logic starts parsing them statically
    fetchProducts().then(products => {
        if (products && products.length > 0) {
            console.log("Loaded products from Supabase");
            renderSupabaseProducts(products);
        } else {
            console.log("Using fallback static HTML products");
        }
    });

    // Mobile menu toggle logic
    const menuToggle = document.querySelector('.material-symbols-outlined:contains("menu")');
    const mobileNav = document.createElement('div');
    // Basic functionality can be expanded later
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            alert("Mobile menu clicked");
        });
    }

    // Connect top navigation links properly
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        const text = link.textContent.trim().toLowerCase();
        if (text === 'home') link.href = 'index.html';
        else if (text === 'shop' || text === 'collections') link.href = 'shop.html';
        else if (text === 'our story') link.href = '#';
        else link.href = '#';
    });
});

// Since :contains doesn't exist in standard DOM, here is a custom function
function findMenuToggle() {
    const spans = document.querySelectorAll('.material-symbols-outlined');
    for (let span of spans) {
        if (span.textContent.trim() === 'menu') return span;
    }
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    const toggle = findMenuToggle();
    if (toggle) {
        toggle.style.cursor = 'pointer';
        toggle.addEventListener('click', () => {
             // add a simple mobile menu 
             const nav = document.querySelector('nav.hidden, nav.md\:flex');
             if(nav) {
                 nav.classList.toggle('hidden');
                 nav.classList.toggle('flex');
                 nav.classList.toggle('flex-col');
                 nav.classList.toggle('absolute');
                 nav.classList.toggle('top-full');
                 nav.classList.toggle('left-0');
                 nav.classList.toggle('w-full');
                 nav.classList.toggle('bg-white');
                 nav.classList.toggle('dark:bg-black');
                 nav.classList.toggle('p-6');
             }
        });
    }
});



document.addEventListener('DOMContentLoaded', () => {
    // 1. Ensure Shopping Bag icon is in Navbar
    const navs = document.querySelectorAll('nav');
    navs.forEach(nav => {
        const container = nav.parentElement.querySelector('.flex.items-center.space-x-8, .flex.items-center.space-x-6, .flex.items-center.gap-8');
        if (container) {
            // Check if already has shopping_bag
            let hasBag = false;
            container.querySelectorAll('span').forEach(s => {
                if (s.textContent.trim() === 'shopping_bag' || s.dataset.icon === 'shopping_bag') hasBag = true;
            });
            if (!hasBag) {
                const btn = document.createElement('button');
                btn.className = 'scale-100 active:scale-95 transition-transform cart-toggle-btn relative';
                btn.innerHTML = '<span class="material-symbols-outlined text-zinc-950 dark:text-zinc-50">shopping_bag</span><span class="cart-badge absolute -top-2 -right-2 bg-primary text-on-primary text-[9px] w-4 h-4 flex items-center justify-center rounded-full hidden">0</span>';
                container.appendChild(btn);
            } else {
                // Add badge to existing bag
                container.querySelectorAll('span').forEach(s => {
                    if (s.textContent.trim() === 'shopping_bag' || s.dataset.icon === 'shopping_bag') {
                        s.parentElement.classList.add('cart-toggle-btn', 'relative');
                        if (!s.parentElement.querySelector('.cart-badge')) {
                            s.parentElement.insertAdjacentHTML('beforeend', '<span class="cart-badge absolute -top-2 -right-2 bg-primary text-on-primary text-[9px] w-4 h-4 flex items-center justify-center rounded-full hidden">0</span>');
                        }
                    }
                });
            }
        }
    });

    // 2. Inject Cart Sidebar
    if (!document.getElementById('cart-sidebar')) {
        const cartSidebarHTML = `
        <div id="cart-sidebar" class="fixed inset-y-0 right-0 w-full md:w-[400px] bg-surface shadow-2xl z-[100] transform translate-x-full transition-transform duration-500 flex flex-col border-l border-outline-variant/20">
            <div class="px-8 py-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest">
                <h2 class="serif-headline text-2xl italic">Your Cart</h2>
                <button id="close-cart" class="material-symbols-outlined hover:text-primary transition-colors text-outline">close</button>
            </div>
            <div id="cart-items" class="flex-1 overflow-y-auto p-8 space-y-6 bg-surface">
                <!-- Items go here -->
            </div>
            <div class="p-8 border-t border-outline-variant/20 bg-surface-container-lowest">
                <div class="flex justify-between items-center mb-6">
                    <span class="font-label text-[11px] uppercase tracking-widest text-outline">Subtotal</span>
                    <span id="cart-total" class="font-body font-bold text-lg">$0.00</span>
                </div>
                <button class="w-full bg-primary text-on-primary py-5 font-label text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity">Checkout securely</button>
            </div>
        </div>
        <div id="cart-overlay" class="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90] opacity-0 pointer-events-none transition-opacity duration-500"></div>
        `;
        document.body.insertAdjacentHTML('beforeend', cartSidebarHTML);
    }

    // 3. Inject Add to Cart buttons in HTML dynamically
    // In product.html:
    const sizeGrid = document.querySelector('.grid.grid-cols-4.gap-2');
    if (sizeGrid && !document.querySelector('.add-to-cart-btn')) {
        const addToCartHTML = `
        <div class="mt-12 mb-6">
            <div class="flex items-center justify-between mb-4">
                <span class="font-body text-2xl font-bold">$890</span>
            </div>
            <button class="add-to-cart-btn w-full bg-primary text-on-primary py-5 font-label text-[11px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity flex justify-center items-center gap-2" data-name="The Sculpted Wool Coat" data-price="890" data-img="https://lh3.googleusercontent.com/aida-public/AB6AXuCMiz8Vo7unuH_N-MLR1irttWlP1STrrAxtPw9KrDlWO6XyLw744N4CKsCHzVUKILN-ym9C0wG-SFxn_IYovaKrRmZD0SRST0aChyF3cktodQ2aQraaooU18bNtlcyc97Ho8u63hWyQ29LP7BmokgmNm56zYFlstZHYG65nj5CHnI0FLnZ4U3JQlWSLMwne8wi14ECQKx0zxgPWGFiO8mfiNTOSBflEV-2YHG5Na3Wa8Mu2C813AwFXzICroO8mpkzG05h38EDqBTE">
                <span>Add to Cart</span>
            </button>
        </div>
        `;
        sizeGrid.parentElement.insertAdjacentHTML('beforeend', addToCartHTML);
        // Add logic for size selection
        const sizeBtns = sizeGrid.querySelectorAll('div');
        sizeBtns.forEach(btn => {
            btn.classList.add('cursor-pointer', 'transition-colors');
            btn.addEventListener('click', () => {
                sizeBtns.forEach(b => {
                    b.classList.remove('bg-primary', 'text-on-primary', 'border-primary');
                    b.classList.add('text-outline');
                });
                btn.classList.add('bg-primary', 'text-on-primary', 'border-primary');
                btn.classList.remove('text-outline');
                const addBtn = document.querySelector('.add-to-cart-btn');
                if (addBtn) addBtn.dataset.size = btn.textContent.trim();
            });
        });
    }

    // In shop.html:
    const productCards = document.querySelectorAll('section.grid .group');
    if (productCards.length > 0) {
        productCards.forEach((card, index) => {
            const nameEl = card.querySelector('h3');
            if (!nameEl) return;
            const name = nameEl.textContent.trim();
            const price = 250 + (index * 50); // Fake dynamic price
            const imgEl = card.querySelector('img');
            const img = imgEl ? imgEl.src : '';
            
            // Add price to UI
            if (!card.querySelector('.product-price')) {
                const priceEl = document.createElement('p');
                priceEl.className = 'product-price font-body font-bold text-sm mt-1';
                priceEl.textContent = `$${price}`;
                nameEl.parentElement.appendChild(priceEl);
            }
            
            // Add "Add To Cart" overlay button instead of "Quick View"
            const imgContainer = card.querySelector('.aspect-\\[3\\/4\\]');
            if (imgContainer) {
                let btn = imgContainer.querySelector('button');
                if (!btn) {
                    btn = document.createElement('button');
                    imgContainer.appendChild(btn);
                }
                btn.textContent = 'Add to Cart';
                btn.className = 'add-to-cart-btn absolute bottom-6 right-6 lg:left-1/2 lg:-translate-x-1/2 bg-white text-primary py-3 px-6 font-label text-[10px] uppercase tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-xl whitespace-nowrap z-10';
                btn.dataset.name = name;
                btn.dataset.price = price;
                btn.dataset.img = img;
                btn.dataset.size = 'M'; // Default size
            }
        });
    }

    // 4. Cart State Management
    let cart = JSON.parse(localStorage.getItem('taiko_cart') || '[]');

    function saveCart() {
        localStorage.setItem('taiko_cart', JSON.stringify(cart));
        renderCart();
    }

    window.addToCart = function(item) {
        const existing = cart.find(i => i.name === item.name && i.size === item.size);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({...item, quantity: 1, id: Date.now()});
        }
        saveCart();
        openCartFn();
    }

    window.removeFromCart = function(id) {
        cart = cart.filter(i => i.id !== id);
        saveCart();
    }

    window.updateQuantity = function(id, change) {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) window.removeFromCart(id);
            else saveCart();
        }
    }

    function renderCart() {
        const container = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total');
        if (!container || !totalEl) return;
        
        let total = 0;
        
        if (cart.length === 0) {
            container.innerHTML = '<p class="font-label text-[10px] uppercase tracking-widest text-outline text-center mt-12">Your cart is empty.</p>';
        } else {
            container.innerHTML = cart.map(item => {
                total += item.price * item.quantity;
                return `
                <div class="flex gap-6 items-center">
                    <div class="w-20 h-24 bg-surface-container overflow-hidden shrink-0">
                        <img src="${item.img}" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1">
                        <h4 class="font-bold text-xs mb-1">${item.name}</h4>
                        <p class="font-label text-[9px] uppercase tracking-widest text-outline">Size: ${item.size}</p>
                        <div class="flex items-center gap-4 mt-3">
                            <button onclick="updateQuantity(${item.id}, -1)" class="w-6 h-6 flex items-center justify-center border border-outline/30 hover:bg-surface-variant transition-colors">-</button>
                            <span class="text-xs font-bold">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)" class="w-6 h-6 flex items-center justify-center border border-outline/30 hover:bg-surface-variant transition-colors">+</button>
                        </div>
                    </div>
                    <div class="text-right flex flex-col justify-between h-20">
                        <p class="font-bold text-sm">$${item.price * item.quantity}</p>
                        <button onclick="removeFromCart(${item.id})" class="font-label text-[9px] uppercase tracking-widest text-outline hover:text-error transition-colors">Remove</button>
                    </div>
                </div>
                `;
            }).join('<hr class="border-outline-variant/20" />');
        }
        
        totalEl.textContent = `$${total.toFixed(2)}`;
        
        // Update badges
        const badges = document.querySelectorAll('.cart-badge');
        const count = cart.reduce((sum, i) => sum + i.quantity, 0);
        badges.forEach(b => {
            if (count > 0) {
                b.classList.remove('hidden');
                b.textContent = count;
            } else {
                b.classList.add('hidden');
            }
        });
    }

    // 5. Connect UI
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    const closeBtn = document.getElementById('close-cart');

    function openCartFn() {
        if(sidebar) sidebar.classList.remove('translate-x-full');
        if(overlay) overlay.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden';
    }

    function closeCartFn() {
        if(sidebar) sidebar.classList.add('translate-x-full');
        if(overlay) overlay.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    }

    // Bind document clicks
    document.addEventListener('click', (e) => {
        // Open cart
        let isToggle = false;
        let current = e.target;
        while(current && current !== document) {
            if (current.classList && current.classList.contains('cart-toggle-btn')) { isToggle = true; break; }
            if (current.textContent && current.textContent.trim() === 'shopping_bag') { isToggle = true; break; }
            current = current.parentNode;
        }
        if (isToggle) { 
            e.preventDefault(); 
            openCartFn(); 
        }
        
        // Add to cart
        const addBtn = e.target.closest('.add-to-cart-btn');
        if (addBtn) {
            e.preventDefault();
            const data = addBtn.dataset;
            // if product page logic where size selector exists but size is not chosen yet
            if (!data.size && document.querySelector('.grid.grid-cols-4.gap-2')) {
                alert("Please select a size first.");
                return;
            }
            window.addToCart({
                name: data.name,
                price: Number(data.price),
                img: data.img,
                size: data.size || 'M'
            });
        }
    });

    if(closeBtn) closeBtn.addEventListener('click', closeCartFn);
    if(overlay) overlay.addEventListener('click', closeCartFn);

    // Initialize
    renderCart();

});
