tailwind.config = {}

// --- SUPABASE CONFIGURATION ---
// PASTE YOUR SUPABASE URL AND ANON KEY HERE TO ENABLE DYNAMIC PRODUCTS
const SUPABASE_URL = 'https://pqimnilolgjsalzrziqq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxaW1uaWxvbGdqc2FsenJ6aXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NjI4NDIsImV4cCI6MjA4OTUzODg0Mn0.WiU3tWRf1i9xlZw6DLydb8po19j6sP4B6JMPm3dw6Ic';

let supabaseClient = null;
let currentUser = null;
if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Listen for auth state changes
    supabaseClient.auth.onAuthStateChange((event, session) => {
        currentUser = session?.user || null;
        if (window.updateProfileUI) window.updateProfileUI();
    });
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
        <div class="group ${extraClass} cursor-pointer relative" onclick="window.location.href='product.html?name=${encodeURIComponent(product.name).replace(/'/g, "\\'")}'">
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
                    <p class="font-label text-[10px] uppercase tracking-widest text-outline">${product.color || 'Standard'} ${product.origin ? (product.origin.toLowerCase() === 'imported' ? '• Imported' : '• Made in ' + product.origin) : ''}</p>
                    <p class="product-price font-body font-bold text-sm mt-1">$${product.price}</p>
                </div>
            </div>
        </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardHTML);
    });
}

window.allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    // 0. Fetch Map Products BEFORE DOM logic starts parsing them statically
    fetchProducts().then(products => {
        if (products && products.length > 0) {
            console.log("Loaded products from Supabase");
            window.allProducts = products;
            renderSupabaseProducts(products);
            populateFallbackProducts();
            setupProductPage();
        } else {
            console.log("Using fallback static HTML products");
            populateFallbackProducts();
            setupProductPage();
        }
    });

    function populateFallbackProducts() {
        // Collect from DOM if any exist static
        const cards = document.querySelectorAll('.group.cursor-pointer');
        cards.forEach(card => {
            const nameEl = card.querySelector('h3') || card.querySelector('h4');
            if (nameEl) {
                const name = nameEl.textContent.trim();
                const imgEl = card.querySelector('img');
                const img = imgEl ? imgEl.src : '';
                const priceEl = card.querySelector('.product-price');
                let price = 250;
                if (priceEl && priceEl.textContent) price = Number(priceEl.textContent.trim().replace('$', ''));
                
                // Override static routing
                card.onclick = (e) => {
                    if (e.target.closest('.add-to-cart-btn') || e.target.closest('button')) return;
                    window.location.href = `product.html?name=${encodeURIComponent(name)}&img=${encodeURIComponent(img)}&price=${price}`;
                };

                if (!window.allProducts.find(p => p.name === name)) {
                    window.allProducts.push({ name, price, image_url: img, color: card.querySelector('.text-outline') ? card.querySelector('.text-outline').textContent.trim() : null });
                }
            }
        });
    }

    function setupProductPage() {
        if (!window.location.pathname.includes('product.html')) return;
        
        const params = new URLSearchParams(window.location.search);
        const productName = params.get('name');
        if (!productName) {
            const container = document.getElementById('product-detail-container') || document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-12.gap-16');
            if (container) container.style.opacity = '1';
            return;
        }

        let product = window.allProducts.find(p => p.name === productName);
        if (!product && params.has('img')) {
             product = {
                 name: productName,
                 image_url: params.get('img'),
                 price: Number(params.get('price')) || 250,
                 color: 'Standard',
                 origin: 'Imported'
             };
             window.allProducts.push(product);
        }

        if (product) {
            // Update Title
            const titleEl = document.querySelector('h1.serif-headline');
            if (titleEl) titleEl.textContent = product.name;

            // Update Main Image
            const mainImg = document.querySelector('.lg\\:col-span-7 img');
            if (mainImg) mainImg.src = product.image_url || product.img;

            const secondImg = document.querySelectorAll('.lg\\:col-span-7 img')[1];
            if (secondImg && product.image_url) secondImg.src = product.image_url;

            // Update Breadcrumb/Color
            const colorEl = document.querySelector('.text-\\[10px\\].uppercase.tracking-\\[0\\.2em\\].text-outline.mb-4');
            if (colorEl && product.color) colorEl.textContent = `Atelier Series / ${product.color}`;

            // Update Origin
            const originEl = document.getElementById('product-origin');
            if (originEl) {
                if (product.origin && product.origin.toLowerCase() !== 'imported') {
                    originEl.textContent = `Made in ${product.origin}`;
                } else {
                    originEl.textContent = 'Imported';
                }
            }

            // Store product for Add To Cart logic to pick up globally
            window.currentProduct = product;
            
            // Wait for Cart logic to inject the button, then update it
            setTimeout(() => {
                const priceSpans = document.querySelectorAll('.font-body.text-2xl.font-bold, .product-price');
                priceSpans.forEach(span => {
                    if (span.textContent.includes('$')) span.textContent = `$${product.price}`;
                });
                
                const btns = document.querySelectorAll('.add-to-cart-btn');
                btns.forEach(btn => {
                    btn.dataset.name = product.name;
                    btn.dataset.price = product.price;
                    btn.dataset.img = product.image_url || product.img;
                });

                // Update size stock availability
                const sizeGrid = document.querySelector('.grid.grid-cols-4.gap-2');
                if (sizeGrid) {
                    const sizeBtns = sizeGrid.querySelectorAll('div');
                    sizeBtns.forEach(btn => {
                        const size = btn.textContent.trim();
                        const stockKey = 'stock_' + size.toLowerCase();
                        if (product.hasOwnProperty(stockKey)) {
                            const stock = product[stockKey];
                            if (stock <= 0) {
                                btn.classList.add('opacity-30', 'pointer-events-none');
                                btn.classList.remove('cursor-pointer');
                                btn.style.textDecoration = 'line-through';
                                btn.title = "Out of stock";
                            }
                        }
                    });
                }

                const container = document.getElementById('product-detail-container') || document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-12.gap-16');
                if (container) container.style.opacity = '1';
            }, 100);
        } else {
            const container = document.getElementById('product-detail-container') || document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-12.gap-16');
            if (container) container.style.opacity = '1';
        }
    }

    // Mobile menu toggle logic is handled by findMenuToggle below

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
    const navs = document.querySelectorAll('nav, header');
    navs.forEach(nav => {
        const container = nav.querySelector('.flex.items-center.space-x-8, .flex.items-center.space-x-6, .flex.items-center.gap-8');
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
            
            // Link placeholder buttons (search/person)
            container.querySelectorAll('span').forEach(s => {
                if (s.textContent.trim() === 'search') {
                    s.parentElement.addEventListener('click', (e) => { 
                        e.preventDefault(); 
                        if (window.openSearchFn) window.openSearchFn(); 
                    });
                }
                if (s.textContent.trim() === 'person') {
                    s.parentElement.addEventListener('click', (e) => { 
                        e.preventDefault(); 
                        if (currentUser) {
                            if (window.openProfileFn) window.openProfileFn();
                        } else {
                            if (window.openAuthFn) window.openAuthFn();
                        }
                    });
                }
            });
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

    // 2.5 Inject Search Modal
    if (!document.getElementById('search-overlay')) {
        const searchModalHTML = `
        <div id="search-overlay" class="fixed inset-0 bg-surface/95 backdrop-blur-xl z-[150] opacity-0 pointer-events-none transition-opacity duration-500 flex flex-col">
            <div class="px-6 md:px-12 py-8 flex justify-between items-center border-b border-outline-variant/20">
                <div class="w-full max-w-4xl mx-auto relative flex items-center">
                    <span class="material-symbols-outlined absolute left-0 text-outline text-2xl">search</span>
                    <input id="search-input" type="text" placeholder="Search for products..." class="w-full bg-transparent border-none text-2xl md:text-5xl font-serif italic text-on-surface focus:ring-0 pl-12 placeholder:text-outline/50" />
                </div>
                <button id="close-search" class="material-symbols-outlined hover:text-primary transition-colors text-outline text-3xl shrink-0 ml-4 md:ml-8">close</button>
            </div>
            <div class="flex-1 overflow-y-auto px-6 md:px-12 py-12">
                <div id="search-results" class="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-[1600px] mx-auto">
                    <!-- Results go here -->
                </div>
                <div id="search-empty" class="hidden text-center mt-20">
                    <p class="font-label text-sm uppercase tracking-widest text-outline">No products found.</p>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', searchModalHTML);
    }

    window.openSearchFn = function() {
        const s = document.getElementById('search-overlay');
        if (s) {
            s.classList.remove('opacity-0', 'pointer-events-none');
            const input = document.getElementById('search-input');
            if (input) {
                input.value = '';
                input.focus();
                // trigger input event to clear results
                input.dispatchEvent(new Event('input'));
            }
            document.body.style.overflow = 'hidden';
            if (!window.allProducts || window.allProducts.length === 0) {
                // Try populate again if not loaded
                const cards = document.querySelectorAll('.group.cursor-pointer');
                cards.forEach(card => {
                    const nameEl = card.querySelector('h3') || card.querySelector('h4');
                    if (!nameEl) return;
                    const name = nameEl.textContent.trim();
                    const imgEl = card.querySelector('img');
                    const img = imgEl ? imgEl.src : '';
                    if (name && !window.allProducts.find(p => p.name === name)) {
                        const priceEl = card.querySelector('.product-price');
                        let price = 250;
                        if (priceEl && priceEl.textContent) price = Number(priceEl.textContent.trim().replace('$', ''));
                        window.allProducts.push({ name, price, image_url: img });
                    }
                });
            }
        }
    };

    window.closeSearchFn = function() {
        const s = document.getElementById('search-overlay');
        if (s) {
            s.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = '';
        }
    };

    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'close-search') {
            window.closeSearchFn();
        }
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const resultsEl = document.getElementById('search-results');
            const emptyEl = document.getElementById('search-empty');
            if (!resultsEl || !emptyEl) return;
            
            resultsEl.innerHTML = '';
            if (!query) {
                emptyEl.classList.add('hidden');
                return;
            }

            let productsToSearch = window.allProducts || [];
            
            const matches = productsToSearch.filter(p => 
                (p.name && p.name.toLowerCase().includes(query)) || 
                (p.color && p.color.toLowerCase().includes(query))
            );
            
            if (matches.length === 0) {
                emptyEl.classList.remove('hidden');
            } else {
                emptyEl.classList.add('hidden');
                resultsEl.innerHTML = matches.map(product => `
                <div class="group cursor-pointer relative" onclick="window.location.href='product.html?name=${encodeURIComponent(product.name).replace(/'/g, "\\'")}'">
                    <div class="aspect-[3/4] overflow-hidden bg-surface-container mb-4 relative">
                        <img alt="${product.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="${product.image_url || product.img}" />
                        <button class="add-to-cart-btn absolute bottom-4 right-4 bg-white text-primary py-2 px-4 font-label text-[9px] uppercase tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl whitespace-nowrap z-10"
                            data-name="${product.name}" 
                            data-price="${product.price}" 
                            data-img="${product.image_url || product.img}" 
                            data-size="M">
                            Add to Cart
                        </button>
                    </div>
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-body text-xs font-semibold tracking-wide mb-1">${product.name}</h3>
                            <p class="font-label text-[8px] uppercase tracking-widest text-outline mb-1">${product.origin ? (product.origin.toLowerCase() === 'imported' ? 'Imported' : 'Made in ' + product.origin) : ''}</p>
                            <p class="product-price font-body text-xs mt-1">$${product.price}</p>
                        </div>
                    </div>
                </div>
                `).join('');
            }
        });
    }

    // 2.75 Inject Auth Modal & Profile Sidebar
    if (!document.getElementById('auth-overlay')) {
        const authModalHTML = `
        <div id="auth-overlay" class="fixed inset-0 bg-surface/95 backdrop-blur-xl z-[150] opacity-0 pointer-events-none transition-opacity duration-500 flex items-center justify-center p-4">
            <div class="bg-surface text-on-surface w-full max-w-md p-10 shadow-2xl relative border border-outline-variant/20">
                <button id="close-auth" class="absolute top-6 right-6 material-symbols-outlined hover:text-on-surface transition-colors text-outline">close</button>
                <div class="text-center mb-10">
                    <h2 class="serif-headline text-4xl italic mb-3 text-on-surface">Welcome</h2>
                    <p class="font-label text-[10px] uppercase tracking-[0.2em] text-outline">Sign in to your account</p>
                </div>
                
                <form id="auth-form" class="space-y-5">
                    <div>
                        <input id="auth-email" type="email" placeholder="Email Address" required class="w-full bg-surface-container-lowest border border-outline-variant/30 px-5 py-4 font-body text-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" />
                    </div>
                    <div>
                        <input id="auth-password" type="password" placeholder="Password" required class="w-full bg-surface-container-lowest border border-outline-variant/30 px-5 py-4 font-body text-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" />
                    </div>
                    <div id="auth-error" class="hidden text-error text-xs font-medium text-center"></div>
                    <div id="auth-success" class="hidden text-primary text-xs font-medium text-center"></div>
                    <button type="submit" id="auth-submit-btn" class="w-full bg-primary text-on-primary py-5 font-label text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity mt-2">Sign In</button>
                    <div class="text-center mt-6">
                        <button type="button" id="toggle-auth-mode" class="font-label text-[9px] uppercase tracking-[0.1em] text-outline hover:text-on-surface border-b border-transparent hover:border-on-surface pb-1 transition-all">Don't have an account? Create one</button>
                    </div>
                </form>
            </div>
        </div>
        
        <div id="profile-sidebar" class="fixed inset-y-0 right-0 w-full md:w-[400px] bg-surface shadow-2xl z-[100] transform translate-x-full transition-transform duration-500 flex flex-col border-l border-outline-variant/20">
            <div class="px-8 py-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest">
                <h2 class="serif-headline text-2xl italic">My Account</h2>
                <button id="close-profile" class="material-symbols-outlined hover:text-primary transition-colors text-outline">close</button>
            </div>
            <div class="flex-1 overflow-y-auto p-8 bg-surface">
                <div class="mb-8">
                    <p class="font-label text-[10px] uppercase tracking-widest text-outline mb-2">Logged in as</p>
                    <p id="profile-email" class="font-body font-bold text-lg"></p>
                </div>
                <hr class="border-outline-variant/20 mb-8" />
                <button id="signout-btn" class="w-full border border-primary text-primary py-4 font-label text-[10px] uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors">Sign Out</button>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', authModalHTML);
    }

    let isSignUpMode = false;

    window.openAuthFn = function() {
        const s = document.getElementById('auth-overlay');
        if (s) {
            s.classList.remove('opacity-0', 'pointer-events-none');
            document.body.style.overflow = 'hidden';
            document.getElementById('auth-error').classList.add('hidden');
            document.getElementById('auth-success').classList.add('hidden');
        }
    };
    
    window.closeAuthFn = function() {
        const s = document.getElementById('auth-overlay');
        if (s) {
            s.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = '';
        }
    };

    window.openProfileFn = function() {
        const sidebar = document.getElementById('profile-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if(sidebar) sidebar.classList.remove('translate-x-full');
        if(overlay) overlay.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden';
        if (currentUser) {
            const emailEl = document.getElementById('profile-email');
            if (emailEl) emailEl.textContent = currentUser.email;
        }
    };

    window.closeProfileFn = function() {
        const sidebar = document.getElementById('profile-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if(sidebar) sidebar.classList.add('translate-x-full');
        // only hide overlay if cart isn't open
        const cartSidebar = document.getElementById('cart-sidebar');
        if(overlay && cartSidebar && cartSidebar.classList.contains('translate-x-full')) {
            overlay.classList.add('opacity-0', 'pointer-events-none');
        }
        document.body.style.overflow = '';
    };

    window.updateProfileUI = function() {
        if (currentUser) {
            window.closeAuthFn(); // Close auth modal on login success
        } else {
            window.closeProfileFn(); // Close profile on logout
        }
    };

    // Initialize UI state handler for dynamic actions
    document.addEventListener('click', async (e) => {
        if (e.target && e.target.id === 'close-auth') window.closeAuthFn();
        if (e.target && e.target.id === 'close-profile') window.closeProfileFn();
        
        // Sign Out
        if (e.target && e.target.id === 'signout-btn') {
            if (supabaseClient) await supabaseClient.auth.signOut();
        }

        // Toggle Auth Mode (Login / Register)
        if (e.target && e.target.id === 'toggle-auth-mode') {
            isSignUpMode = !isSignUpMode;
            document.getElementById('auth-submit-btn').textContent = isSignUpMode ? 'Create Account' : 'Sign In';
            e.target.textContent = isSignUpMode ? 'Already have an account? Sign In' : "Don't have an account? Create one";
            document.getElementById('auth-error').classList.add('hidden');
            document.getElementById('auth-success').classList.add('hidden');
        }
    });

    // Form Registration/Login
    document.addEventListener('submit', async (e) => {
        if (e.target && e.target.id === 'auth-form') {
            e.preventDefault();
            if (!supabaseClient) return;
            
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            const errorEl = document.getElementById('auth-error');
            const successEl = document.getElementById('auth-success');
            const submitBtn = document.getElementById('auth-submit-btn');
            
            errorEl.classList.add('hidden');
            successEl.classList.add('hidden');
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            
            let result;
            if (isSignUpMode) {
                result = await supabaseClient.auth.signUp({ email, password });
            } else {
                result = await supabaseClient.auth.signInWithPassword({ email, password });
            }
            
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';

            if (result.error) {
                errorEl.textContent = result.error.message;
                errorEl.classList.remove('hidden');
            } else if (isSignUpMode && result.data?.user?.identities?.length === 0) {
                 successEl.textContent = 'Account created/linked. You can now Sign In.';
                 successEl.classList.remove('hidden');
            } else if (isSignUpMode && result.data?.session === null) {
                 successEl.textContent = 'Check your email for a confirmation link.';
                 successEl.classList.remove('hidden');
            } else if (!isSignUpMode) {
                // Success is handled by onAuthStateChange triggering updateProfileUI
            }
        }
    });

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
                    b.classList.remove('bg-zinc-950', 'text-white', 'border-zinc-950');
                    b.classList.add('text-outline');
                });
                btn.classList.add('bg-zinc-950', 'text-white', 'border-zinc-950');
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
        const product = window.allProducts.find(p => p.name === item.name);
        if (product) {
            const stockKey = 'stock_' + item.size.toLowerCase();
            const maxStock = product[stockKey] !== undefined ? product[stockKey] : 99;
            
            const existing = cart.find(i => i.name === item.name && i.size === item.size);
            const currentQty = existing ? existing.quantity : 0;
            
            if (currentQty + 1 > maxStock) {
                alert(`Cannot add more to cart. Only ${maxStock} items available in size ${item.size}.`);
                return;
            }
        }

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
    function openCartFn() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if(sidebar) sidebar.classList.remove('translate-x-full');
        if(overlay) overlay.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden';
    }

    function closeCartFn() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
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
        
        const addBtn = e.target.closest('.add-to-cart-btn');
        if (addBtn) {
            e.preventDefault();
            e.stopPropagation();
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

    // Delegate close button manually since it's injected dynamically
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'close-cart') {
            closeCartFn();
        }
    });
    
    // Delegate overlay click
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'cart-overlay') {
            closeCartFn();
        }
    });

    // Initialize
    renderCart();

    // 6. Newsletter Logic
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletter-email').value;
            const msgEl = document.getElementById('newsletter-msg');
            msgEl.classList.remove('hidden', 'text-[#5c6858]', 'text-error', 'text-primary');
            msgEl.classList.add('text-primary');
            msgEl.textContent = 'Suscribiendo...';
            
            if (!supabaseClient) {
                msgEl.textContent = 'Error: Base de datos no conectada.';
                msgEl.classList.add('text-error');
                return;
            }
            
            const { error } = await supabaseClient
                .from('newsletter_subscribers')
                .insert([{ email }]);
                
            if (error && error.code === '23505') { // Unique constraint
                msgEl.textContent = '¡Ya estás suscrito!';
            } else if (error) {
                msgEl.textContent = 'Error al suscribirse. Intenta de nuevo.';
                msgEl.classList.add('text-error');
            } else {
                msgEl.textContent = 'Suscrito con éxito. ¡Te llegará un correo!';
                msgEl.classList.add('text-[#5c6858]');
                document.getElementById('newsletter-email').value = '';
            }
            
            setTimeout(() => {
                msgEl.classList.add('hidden');
            }, 5000);
        });
    }

});
