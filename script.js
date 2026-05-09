// Default products
const DEFAULT_PRODUCTS = [
  { id: '1', name: 'Golden Horizon Abstract', price: 2499.99, image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop', stock: 3, inStock: true },
  { id: '2', name: 'Sculptural Masterpiece', price: 1899.99, image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&h=600&fit=crop', stock: 5, inStock: true },
  { id: '3', name: 'Vintage Collector\'s Item', price: 899.99, image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=600&h=600&fit=crop', stock: 8, inStock: true },
  { id: '4', name: 'Modern Art Installation', price: 3499.99, image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&h=600&fit=crop', stock: 2, inStock: true },
  { id: '5', name: 'Heritage Decorative Piece', price: 649.99, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=600&fit=crop', stock: 12, inStock: true },
  { id: '6', name: 'Exclusive Limited Edition', price: 4999.99, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop', stock: 1, inStock: true }
];

// Data Management Functions
function getProducts() {
  const stored = localStorage.getItem('showpiece_products');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('showpiece_products', JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

function saveProducts(products) {
  localStorage.setItem('showpiece_products', JSON.stringify(products));
}

function getCart() {
  const stored = localStorage.getItem('showpiece_cart');
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem('showpiece_cart', JSON.stringify(cart));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Page Navigation
const sectionOrder = ['home', 'shop', 'about', 'contact', 'faq', 'admin', 'dashboard'];
const visibleSections = ['home', 'shop', 'about', 'contact', 'faq', 'admin', 'dashboard'];

// Admin password
const ADMIN_PASSWORD = 'admin123';
let isAdminLoggedIn = false;

// Auth System
function getUsers() {
  const stored = localStorage.getItem('showpiece_users');
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users) {
  localStorage.setItem('showpiece_users', JSON.stringify(users));
}

function getCurrentUser() {
  const stored = localStorage.getItem('showpiece_current_user');
  return stored ? JSON.parse(stored) : null;
}

function setCurrentUser(user, remember = false) {
  if (remember) {
    localStorage.setItem('showpiece_current_user', JSON.stringify(user));
  } else {
    sessionStorage.setItem('showpiece_current_user', JSON.stringify(user));
  }
}

function clearCurrentUser() {
  localStorage.removeItem('showpiece_current_user');
  sessionStorage.removeItem('showpiece_current_user');
}

function checkAuth() {
  let user = getCurrentUser();
  if (!user) {
    user = sessionStorage.getItem('showpiece_current_user') ? JSON.parse(sessionStorage.getItem('showpiece_current_user')) : null;
  }
  return user;
}

// Auth Tab Switching
function showAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

  if (tab === 'login') {
    document.getElementById('tabLogin').classList.add('active');
    document.getElementById('loginForm').classList.add('active');
  } else if (tab === 'signup') {
    document.getElementById('tabSignup').classList.add('active');
    document.getElementById('signupForm').classList.add('active');
  } else if (tab === 'admin') {
    document.getElementById('tabLogin').classList.add('active');
    document.getElementById('adminForm').classList.add('active');
  }
}

// Login Handler
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const remember = document.getElementById('loginRemember').checked;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    setCurrentUser(user, remember);
    showLoggedInView(user);
    showToast('Welcome back, ' + user.name + '!');
    updateAuthNav();
  } else {
    showToast('Invalid email or password!');
  }
}

// Signup Handler
function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;

  if (password !== confirm) {
    showToast('Passwords do not match!');
    return;
  }

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    showToast('Email already registered!');
    return;
  }

  const newUser = {
    id: generateId(),
    name: name,
    email: email,
    password: password,
    role: 'user',
    createdAt: new Date().toLocaleDateString()
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser, true);
  showLoggedInView(newUser);
  showToast('Account created successfully!');
  updateAuthNav();
}

// Admin Login Handler
function handleAdminLogin(e) {
  e.preventDefault();
  const key = document.getElementById('adminKey').value;

  if (key === ADMIN_PASSWORD) {
    const adminUser = {
      id: 'admin',
      name: 'Administrator',
      email: 'admin@showpiece.com',
      role: 'admin'
    };
    setCurrentUser(adminUser, true);
    isAdminLoggedIn = true;
    showLoggedInView(adminUser);
    showToast('Welcome, Admin!');
    updateAuthNav();
    showPage('admin');
  } else {
    showToast('Invalid admin key!');
  }
}

// Show Logged In View
function showLoggedInView(user) {
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.getElementById('loggedInForm').classList.add('active');

  document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('userName').textContent = 'Welcome, ' + user.name + '!';
  document.getElementById('userEmail').textContent = user.email || 'No email';
  document.getElementById('userEmail').style.display = user.email ? 'block' : 'none';

  const roleEl = document.getElementById('userRole');
  roleEl.textContent = user.role === 'admin' ? 'Administrator' : 'Member';
  roleEl.classList.toggle('admin', user.role === 'admin');
}

// Go to Dashboard
function goToDashboard() {
  const user = checkAuth();
  if (user && user.role === 'admin') {
    showPage('admin');
  } else {
    showPage('dashboard');
  }
}

// Logout
function logout() {
  clearCurrentUser();
  isAdminLoggedIn = false;
  showAuthTab('login');
  showPage('login');
  updateAuthNav();
  showToast('Logged out successfully!');
}

// Update Navigation based on auth
function updateAuthNav() {
  const user = checkAuth();
  const loginNav = document.querySelector('.nav-item[data-page="login"]');
  const adminNav = document.getElementById('adminNav');
  const dashboardNav = document.getElementById('dashboardNav');
  const logoutNav = document.getElementById('logoutNav');

  if (user) {
    if (loginNav) loginNav.style.display = 'none';
    if (user.role === 'admin') {
      adminNav.style.display = 'block';
    }
    dashboardNav.style.display = 'block';
    logoutNav.style.display = 'block';
  } else {
    if (loginNav) loginNav.style.display = 'block';
    adminNav.style.display = 'none';
    dashboardNav.style.display = 'none';
    logoutNav.style.display = 'none';
  }
}

function checkAdminAuth() {
  const user = checkAuth();
  if (user && user.role === 'admin') {
    return true;
  }
  showPage('login');
  showAuthTab('admin');
  return false;
}

function showPage(page, fromScroll = false) {
  // Check admin authentication for admin pages
  if ((page === 'admin' || page === 'dashboard') && !fromScroll) {
    if (!checkAdminAuth()) {
      return;
    }
  }

  // Handle non-scrolling pages
  if (page === 'checkout' || page === 'detail') {
    showPageContent(page);
    return;
  }
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Remove active from all nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.mobile-nav-item').forEach(n => n.classList.remove('active'));

  // Show selected page
  const pageEl = document.getElementById(page + 'Page');
  if (pageEl) {
    pageEl.classList.add('active');
  }

  // Update nav active state
  document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');
  document.querySelector(`.mobile-nav-item[data-page="${page}"]`)?.classList.add('active');

  // Update scroll dots
  updateScrollDots();

  // Handle hero visibility
  const hero = document.getElementById('hero');
  if (hero) {
    if (page === 'home') {
      hero.style.display = 'flex';
    } else {
      hero.style.display = 'none';
    }
  }

  // Page-specific actions
  if (page === 'shop') renderProducts();
  if (page === 'admin') renderAdminProducts();

  // Scroll to section
  if (!fromScroll && pageEl) {
    pageEl.scrollIntoView({ behavior: 'smooth' });
  }
}

// Handle non-scrolling pages (checkout, detail)
function showPageContent(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.mobile-nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = document.getElementById(page + 'Page');
  if (pageEl) {
    pageEl.classList.add('active');
  }

  document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');
  document.querySelector(`.mobile-nav-item[data-page="${page}"]`)?.classList.add('active');

  const hero = document.getElementById('hero');
  if (hero) {
    hero.style.display = 'none';
  }

  if (page === 'checkout') {
    renderCheckoutSummary();
    showPaymentDetails('cod');
  }

  window.scrollTo(0, 0);
}

// Mobile Navigation
function toggleMobileNav() {
  const mobileNav = document.getElementById('mobileNav');
  mobileNav.classList.toggle('open');
}

// FAQ Toggle
function toggleFaq(btn) {
  const faqItem = btn.parentElement;
  faqItem.classList.toggle('open');
}

// Contact Form Submit
function submitContact(e) {
  e.preventDefault();
  showToast('Message sent successfully! We\'ll get back to you soon.');
  e.target.reset();
}

// Toast Notification
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Product Rendering
function renderProducts() {
  const products = getProducts();
  const grid = document.getElementById('productGrid');

  grid.innerHTML = products.filter(p => p.inStock).map((product, index) => `
    <div class="product-card" style="animation-delay: ${index * 0.05}s" onclick="showProductDetail('${product.id}')">
      <div class="product-image">
        ${product.image ? `<img src="${product.image}" alt="${product.name}" onerror="this.parentElement.innerHTML='<span class=placeholder>🎨</span>'">` : '<span class="placeholder">🎨</span>'}
        <span class="product-badge">Collection</span>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <div class="product-stock">${product.stock} available</div>
        <button class="add-to-cart" onclick="event.stopPropagation(); addToCart('${product.id}')">Add to Collection</button>
      </div>
    </div>
  `).join('');
}

// Featured Products (Home Page)
function renderFeatured() {
  const products = getProducts();
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  const featured = products.filter(p => p.inStock).slice(0, 4);
  grid.innerHTML = featured.map(product => `
    <div class="product-card" onclick="showProductDetail('${product.id}')">
      <div class="product-image">
        ${product.image ? `<img src="${product.image}" alt="${product.name}" onerror="this.parentElement.innerHTML='<span class=placeholder>🎨</span>'">` : '<span class="placeholder">🎨</span>'}
        <span class="product-badge">Featured</span>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <div class="product-stock">${product.stock} available</div>
        <button class="add-to-cart" onclick="event.stopPropagation(); addToCart('${product.id}')">Add to Collection</button>
      </div>
    </div>
  `).join('');
}

// Product Detail Functions
let currentProductId = null;

function showProductDetail(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  currentProductId = productId;

  // Update page content
  document.getElementById('detailTitle').textContent = product.name;
  document.getElementById('detailPrice').textContent = '$' + product.price.toFixed(2);
  document.getElementById('detailStock').textContent = product.inStock ? 'In Stock' : 'Out of Stock';
  document.getElementById('detailStock').style.background = product.inStock ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)';
  document.getElementById('detailStock').style.color = product.inStock ? 'var(--success)' : 'var(--error)';
  document.getElementById('detailAvailability').textContent = product.inStock ? `${product.stock} available` : 'Out of Stock';
  document.getElementById('detailSku').textContent = 'SP-' + product.id.toUpperCase();
  document.getElementById('detailQty').value = 1;

  // Set main image
  const mainImage = document.getElementById('detailImage');
  if (product.image) {
    mainImage.src = product.image;
  }

  // Generate thumbnails (using same image + some variations)
  const thumbnails = document.getElementById('detailThumbnails');
  const thumbImages = [
    product.image || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=200&h=200&fit=crop'
  ];

  thumbnails.innerHTML = thumbImages.map((img, i) => `
    <div class="thumb ${i === 0 ? 'active' : ''}" onclick="changeDetailImage(this, '${img}')">
      <img src="${img}" alt="Thumbnail ${i + 1}">
    </div>
  `).join('');

  // Show detail page
  showPage('detail');
}

function changeDetailImage(thumb, src) {
  document.querySelectorAll('.detail-thumbnails .thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
  document.getElementById('detailImage').src = src;
}

function updateDetailQty(delta) {
  const input = document.getElementById('detailQty');
  let val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  if (val > 10) val = 10;
  input.value = val;
}

function addToCartFromDetail() {
  if (!currentProductId) return;
  const qty = parseInt(document.getElementById('detailQty').value) || 1;

  for (let i = 0; i < qty; i++) {
    addToCart(currentProductId);
  }
  showToast('Added to collection!');
}

function buyNow() {
  addToCartFromDetail();
  toggleCart();
}

// Cart Functions
function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('open');
  renderCart();
}

function closeCartOutside(e) {
  if (e.target === document.getElementById('cartOverlay')) {
    toggleCart();
  }
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(item => item.productId === productId);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ productId, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
  showToast('Added to collection!');
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cartCount').textContent = count;
}

function renderCart() {
  const cart = getCart();
  const products = getProducts();
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');

  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🎨</div><p>Your cart is empty</p></div>';
    totalEl.textContent = '$0.00';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return '';
    const itemTotal = product.price * item.quantity;
    total += itemTotal;
    return `
      <div class="cart-item">
        <div class="cart-item-image">
          ${product.image ? `<img src="${product.image}" alt="${product.name}" onerror="this.parentElement.innerHTML='<span style=font-size:2rem>🎨</span>'">` : '<span style="font-size:2rem">🎨</span>'}
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-price">$${product.price.toFixed(2)}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="updateQuantity('${item.productId}', -1)">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity('${item.productId}', 1)">+</button>
            <button class="remove-item" onclick="removeFromCart('${item.productId}')">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  totalEl.textContent = '$' + total.toFixed(2);
}

function updateQuantity(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.productId === productId);

  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart.splice(cart.indexOf(item), 1);
    }
  }

  saveCart(cart);
  updateCartCount();
  renderCart();
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.productId !== productId);
  saveCart(cart);
  updateCartCount();
  renderCart();
}

function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your collection is empty!');
    return;
  }

  // Go to checkout page
  toggleCart();
  renderCheckoutSummary();
  showPage('checkout');
}

// Checkout Page Functions
function showPaymentDetails(method) {
  document.querySelectorAll('.bkash-details, .nagad-details, .rocket-details, .cod-details').forEach(el => {
    el.style.display = 'none';
  });

  const details = document.querySelector('.' + method + '-details');
  if (details) {
    details.style.display = 'block';
  }

  // Update amount display
  const cart = getCart();
  const products = getProducts();
  let total = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  });

  document.getElementById('paymentAmount').textContent = '$' + total.toFixed(2);
  document.getElementById('nagadAmount').textContent = '$' + total.toFixed(2);
  document.getElementById('rocketAmount').textContent = '$' + total.toFixed(2);
}

function renderCheckoutSummary() {
  const cart = getCart();
  const products = getProducts();
  const container = document.getElementById('checkoutItems');

  let subtotal = 0;

  container.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return '';
    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    return `
      <div class="summary-item">
        <div class="summary-item-image">
          ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<span style="display:flex;align-items:center;justify-content:center;height:100%;font-size:1.5rem;">🎨</span>'}
        </div>
        <div class="summary-item-details">
          <div class="summary-item-name">${product.name}</div>
          <div class="summary-item-qty">Qty: ${item.quantity}</div>
        </div>
        <div class="summary-item-price">$${itemTotal.toFixed(2)}</div>
      </div>
    `;
  }).join('');

  const shipping = subtotal > 0 ? 5.00 : 0;
  const total = subtotal + shipping;

  document.getElementById('checkoutSubtotal').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('checkoutShipping').textContent = '$' + shipping.toFixed(2);
  document.getElementById('checkoutTotal').textContent = '$' + total.toFixed(2);
}

function processCheckout(e) {
  e.preventDefault();

  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }

  const name = document.getElementById('customerName').value;
  const phone = document.getElementById('customerPhone').value;
  const email = document.getElementById('customerEmail').value;
  const address = document.getElementById('customerAddress').value;
  const division = document.getElementById('customerDivision').value;
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

  const products = getProducts();
  let total = 0;
  const orderItems = [];

  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
      total += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        name: product.name,
        quantity: item.quantity,
        price: product.price
      });
    }
  });
  saveProducts(products);

  // Calculate total with shipping
  const shipping = 5.00;
  const finalTotal = total + shipping;

  // Get transaction details if applicable
  let transactionId = null;
  let senderNumber = null;

  if (paymentMethod === 'bkash') {
    transactionId = document.getElementById('transactionId').value;
    senderNumber = document.getElementById('senderNumber').value;
    if (!transactionId || !senderNumber) {
      showToast('Please enter transaction ID and sender number!');
      return;
    }
  } else if (paymentMethod === 'nagad') {
    transactionId = document.getElementById('nagadTransactionId').value;
    senderNumber = document.getElementById('nagadSenderNumber').value;
    if (!transactionId || !senderNumber) {
      showToast('Please enter transaction ID and sender number!');
      return;
    }
  } else if (paymentMethod === 'rocket') {
    transactionId = document.getElementById('rocketTransactionId').value;
    senderNumber = document.getElementById('rocketSenderNumber').value;
    if (!transactionId || !senderNumber) {
      showToast('Please enter transaction ID and sender number!');
      return;
    }
  }

  // Save order
  const orders = getOrders();
  const newOrder = {
    id: generateId(),
    items: orderItems,
    total: finalTotal,
    status: 'pending',
    date: new Date().toLocaleDateString(),
    customerName: name,
    customerPhone: phone,
    customerEmail: email,
    customerAddress: address + ', ' + division,
    paymentMethod: paymentMethod,
    transactionId: transactionId,
    senderNumber: senderNumber
  };
  orders.push(newOrder);
  saveOrders(orders);

  // Add customer
  addCustomerToSystem(newOrder);

  // Clear cart
  saveCart([]);
  updateCartCount();
  document.getElementById('checkoutForm').reset();

  showToast('Order placed successfully! 🎉');

  // Go to home or show confirmation
  setTimeout(() => {
    showPage('home');
  }, 1500);
}

// Admin Functions
function renderAdminProducts() {
  const products = getProducts();
  const list = document.getElementById('productsList');

  list.innerHTML = products.map(product => `
    <div class="table-row">
      <div class="product-cell-name">${product.name}</div>
      <div class="product-cell-price">$${product.price.toFixed(2)}</div>
      <div class="product-cell-stock">${product.stock}</div>
      <div>
        <button class="stock-toggle ${product.inStock ? '' : 'out'}" onclick="toggleStock('${product.id}')">
          ${product.inStock ? 'Available' : 'Unavailable'}
        </button>
      </div>
      <div class="product-actions">
        <button class="action-btn" onclick="editProduct('${product.id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteProduct('${product.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function saveProduct(e) {
  e.preventDefault();

  const id = document.getElementById('productId').value;
  const name = document.getElementById('productName').value;
  const price = parseFloat(document.getElementById('productPrice').value);
  const image = document.getElementById('productImage').value;
  const stock = parseInt(document.getElementById('productStock').value);

  const products = getProducts();

  if (id) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], name, price, image, stock, inStock: stock > 0 };
    }
    showToast('Piece updated!');
  } else {
    products.push({
      id: generateId(),
      name,
      price,
      image,
      stock,
      inStock: stock > 0
    });
    showToast('Piece added to gallery!');
  }

  saveProducts(products);
  resetForm();
  renderAdminProducts();
  renderProducts();
}

function editProduct(id) {
  const products = getProducts();
  const product = products.find(p => p.id === id);

  if (!product) return;

  document.getElementById('productId').value = product.id;
  document.getElementById('productName').value = product.name;
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productImage').value = product.image;
  document.getElementById('productStock').value = product.stock;

  document.getElementById('formTitle').textContent = 'Edit Piece';
  document.getElementById('submitBtn').textContent = 'Update Piece';
  document.getElementById('cancelBtn').style.display = 'block';

  document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' });
}

function deleteProduct(id) {
  if (!confirm('Are you sure you want to remove this piece from the gallery?')) return;

  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
  renderAdminProducts();
  renderProducts();
  showToast('Piece removed from gallery');
}

function toggleStock(id) {
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (product) {
    product.inStock = !product.inStock;
    saveProducts(products);
    renderAdminProducts();
    renderProducts();
  }
}

function resetForm() {
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
  document.getElementById('formTitle').textContent = 'Add New Piece';
  document.getElementById('submitBtn').textContent = 'Add Piece';
  document.getElementById('cancelBtn').style.display = 'none';
}

// Header scroll effect - simplified
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  const currentScroll = window.scrollY;

  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

// Scroll Navigation
function scrollToSection(section) {
  const pageEl = document.getElementById(section + 'Page');
  if (pageEl) {
    pageEl.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => showPage(section, true), 100);
  }
}

function updateScrollDots() {
  const scrollNav = document.getElementById('scrollNav');
  if (!scrollNav) return;

  // Hide scroll nav if not on a main page
  const activePage = document.querySelector('.page.active');
  if (activePage && (activePage.id === 'checkoutPage' || activePage.id === 'detailPage')) {
    scrollNav.style.display = 'none';
    return;
  }
  scrollNav.style.display = window.innerWidth <= 768 ? 'none' : 'flex';

  const dots = scrollNav.querySelectorAll('.scroll-dot');
  const scrollPos = window.scrollY + (window.innerHeight / 2);

  visibleSections.forEach((section, index) => {
    const pageEl = document.getElementById(section + 'Page');
    if (!pageEl) return;

    const sectionTop = pageEl.offsetTop;
    const sectionHeight = pageEl.offsetHeight;

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      dots.forEach(d => d.classList.remove('active'));
      if (dots[index]) dots[index].classList.add('active');
    }
  });
}

// Hide scroll nav on mobile
function handleScrollNavDisplay() {
  const scrollNav = document.getElementById('scrollNav');
  if (scrollNav) {
    if (window.innerWidth <= 768) {
      scrollNav.style.display = 'none';
    } else {
      scrollNav.style.display = 'flex';
    }
  }
}

window.addEventListener('resize', handleScrollNavDisplay);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  getProducts();
  updateCartCount();
  renderProducts();
  renderFeatured();
  handleScrollNavDisplay();
  initDashboard();
  initAuth();
});

function initAuth() {
  const user = checkAuth();
  if (user) {
    showPage('login');
    showLoggedInView(user);
  }
  updateAuthNav();
}

// Dashboard Functions
function initDashboard() {
  updateDashboardStats();
  renderRecentOrders();
}

function updateDashboardStats() {
  const products = getProducts();
  const orders = getOrders();
  const customers = getCustomers();

  document.getElementById('statOrders').textContent = orders.length;
  document.getElementById('statCustomers').textContent = customers.length;
  document.getElementById('statProducts').textContent = products.length;

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  document.getElementById('statRevenue').textContent = '$' + totalRevenue.toFixed(2);
}

function renderRecentOrders() {
  const orders = getOrders().slice(-5).reverse();
  const container = document.getElementById('recentOrders');

  if (orders.length === 0) {
    container.innerHTML = '<div class="order-mini"><span style="grid-column: span 4; color: var(--text-muted); text-align: center; padding: 40px;">No orders yet</span></div>';
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="order-mini">
      <div style="font-weight: 600;">#${order.id.slice(-6)}</div>
      <div>${order.customerName || 'Guest'}</div>
      <div style="color: var(--gold); font-weight: 600;">$${(order.total || 0).toFixed(2)}</div>
      <div>
        <span class="order-status ${order.status || 'pending'}">${order.status || 'Pending'}</span>
      </div>
    </div>
  `).join('');
}

// Admin Tab Functions
function showAdminTab(tabName) {
  showPage('admin');

  // Update tab buttons
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });

  // Update tab content
  document.querySelectorAll('.admin-content').forEach(content => {
    content.classList.toggle('active', content.id === 'tab-' + tabName);
  });

  // Load tab data
  if (tabName === 'products') {
    renderAdminProducts();
  } else if (tabName === 'orders') {
    renderOrders();
  } else if (tabName === 'customers') {
    renderCustomers();
  } else if (tabName === 'analytics') {
    renderAnalytics();
  }
}

// Orders Management
function getOrders() {
  const stored = localStorage.getItem('showpiece_orders');
  return stored ? JSON.parse(stored) : [];
}

function saveOrders(orders) {
  localStorage.setItem('showpiece_orders', JSON.stringify(orders));
}

function renderOrders() {
  const orders = getOrders();
  const container = document.getElementById('ordersList');

  if (orders.length === 0) {
    container.innerHTML = '<div class="table-row" style="grid-column: span 7; text-align: center; color: var(--text-muted); padding: 40px;">No orders yet</div>';
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="table-row">
      <div style="font-weight: 600;">#${order.id.slice(-6)}</div>
      <div>${order.customerName || 'Guest'}</div>
      <div>${order.items ? order.items.length : 0} items</div>
      <div style="color: var(--gold); font-weight: 600;">$${(order.total || 0).toFixed(2)}</div>
      <div>
        <select class="order-status-select" onchange="updateOrderStatus('${order.id}', this.value)" style="padding: 6px 12px; background: var(--bg-dark); border: 1px solid var(--border); border-radius: 20px; color: ${getStatusColor(order.status)};">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
          <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
          <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </div>
      <div>${order.date || new Date().toLocaleDateString()}</div>
      <div>
        <button class="action-btn" onclick="viewOrder('${order.id}')">View</button>
        <button class="action-btn delete" onclick="deleteOrder('${order.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function getStatusColor(status) {
  const colors = {
    pending: '#fbbf24',
    processing: '#60a5fa',
    shipped: '#a78bfa',
    delivered: '#4ade80',
    cancelled: '#f87171'
  };
  return colors[status] || '#fbbf24';
}

function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    saveOrders(orders);
    showToast('Order status updated!');
  }
}

function viewOrder(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    alert(`Order #${order.id.slice(-6)}\nCustomer: ${order.customerName || 'Guest'}\nItems: ${order.items ? order.items.length : 0}\nTotal: $${(order.total || 0).toFixed(2)}\nStatus: ${order.status || 'pending'}`);
  }
}

function deleteOrder(orderId) {
  if (!confirm('Delete this order?')) return;
  const orders = getOrders().filter(o => o.id !== orderId);
  saveOrders(orders);
  renderOrders();
  showToast('Order deleted');
}

function filterOrders() {
  const filter = document.getElementById('orderFilter').value;
  const orders = getOrders();
  const container = document.getElementById('ordersList');

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (filtered.length === 0) {
    container.innerHTML = '<div class="table-row" style="grid-column: span 7; text-align: center; color: var(--text-muted); padding: 40px;">No orders found</div>';
    return;
  }

  container.innerHTML = filtered.map(order => `
    <div class="table-row">
      <div style="font-weight: 600;">#${order.id.slice(-6)}</div>
      <div>${order.customerName || 'Guest'}</div>
      <div>${order.items ? order.items.length : 0} items</div>
      <div style="color: var(--gold); font-weight: 600;">$${(order.total || 0).toFixed(2)}</div>
      <div>
        <span class="order-status ${order.status || 'pending'}">${order.status || 'Pending'}</span>
      </div>
      <div>${order.date || new Date().toLocaleDateString()}</div>
      <div>
        <button class="action-btn" onclick="viewOrder('${order.id}')">View</button>
        <button class="action-btn delete" onclick="deleteOrder('${order.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Customers Management
function getCustomers() {
  const stored = localStorage.getItem('showpiece_customers');
  return stored ? JSON.parse(stored) : [];
}

function saveCustomers(customers) {
  localStorage.setItem('showpiece_customers', JSON.stringify(customers));
}

function renderCustomers() {
  const customers = getCustomers();
  const container = document.getElementById('customersList');

  if (customers.length === 0) {
    container.innerHTML = '<div class="table-row" style="grid-column: span 6; text-align: center; color: var(--text-muted); padding: 40px;">No customers yet. Customers will appear here after they make a purchase.</div>';
    return;
  }

  container.innerHTML = customers.map(customer => `
    <div class="table-row">
      <div class="customer-cell-name">
        <div class="customer-avatar">${(customer.name || 'G').charAt(0).toUpperCase()}</div>
        <div>${customer.name || 'Guest'}</div>
      </div>
      <div>${customer.email || '-'}</div>
      <div>${customer.orders || 0}</div>
      <div style="color: var(--gold); font-weight: 600;">$${(customer.totalSpent || 0).toFixed(2)}</div>
      <div>${customer.joined || new Date().toLocaleDateString()}</div>
      <div>
        <button class="action-btn" onclick="viewCustomer('${customer.id}')">View</button>
        <button class="action-btn delete" onclick="deleteCustomer('${customer.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function viewCustomer(customerId) {
  const customers = getCustomers();
  const customer = customers.find(c => c.id === customerId);
  if (customer) {
    alert(`Customer: ${customer.name || 'Guest'}\nEmail: ${customer.email || 'N/A'}\nOrders: ${customer.orders || 0}\nTotal Spent: $${(customer.totalSpent || 0).toFixed(2)}\nJoined: ${customer.joined || 'N/A'}`);
  }
}

function deleteCustomer(customerId) {
  if (!confirm('Delete this customer?')) return;
  const customers = getCustomers().filter(c => c.id !== customerId);
  saveCustomers(customers);
  renderCustomers();
  showToast('Customer deleted');
}

function searchCustomers() {
  const search = document.getElementById('customerSearch').value.toLowerCase();
  const customers = getCustomers();
  const container = document.getElementById('customersList');

  const filtered = customers.filter(c =>
    (c.name || '').toLowerCase().includes(search) ||
    (c.email || '').toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    container.innerHTML = '<div class="table-row" style="grid-column: span 6; text-align: center; color: var(--text-muted); padding: 40px;">No customers found</div>';
    return;
  }

  container.innerHTML = filtered.map(customer => `
    <div class="table-row">
      <div class="customer-cell-name">
        <div class="customer-avatar">${(customer.name || 'G').charAt(0).toUpperCase()}</div>
        <div>${customer.name || 'Guest'}</div>
      </div>
      <div>${customer.email || '-'}</div>
      <div>${customer.orders || 0}</div>
      <div style="color: var(--gold); font-weight: 600;">$${(customer.totalSpent || 0).toFixed(2)}</div>
      <div>${customer.joined || new Date().toLocaleDateString()}</div>
      <div>
        <button class="action-btn" onclick="viewCustomer('${customer.id}')">View</button>
        <button class="action-btn delete" onclick="deleteCustomer('${customer.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Analytics
function renderAnalytics() {
  // Sales chart (mock data)
  const salesChart = document.getElementById('salesChart');
  const salesData = [30, 45, 60, 40, 70, 55, 80];
  salesChart.innerHTML = salesData.map(val => `<div class="chart-bar" style="height: ${val}%"></div>`).join('');

  // Top products
  const products = getProducts();
  const topProducts = document.getElementById('topProducts');
  topProducts.innerHTML = products.slice(0, 5).map((p, i) => `
    <div class="top-product-item">
      <div class="top-product-rank">${i + 1}</div>
      <div class="top-product-name">${p.name}</div>
      <div class="top-product-sales">${p.stock} sold</div>
    </div>
  `).join('');

  // Activity feed
  const orders = getOrders();
  const activityFeed = document.getElementById('activityFeed');
  const activities = [
    { icon: '🛒', text: 'New order received', time: '2 min ago' },
    { icon: '👤', text: 'New customer registered', time: '15 min ago' },
    { icon: '📦', text: 'Order shipped', time: '1 hour ago' },
    { icon: '✅', text: 'Order delivered', time: '3 hours ago' }
  ];

  if (orders.length > 0) {
    activities[0] = { icon: '🛒', text: `Order #${orders[orders.length-1].id.slice(-6)} completed`, time: 'Just now' };
  }

  activityFeed.innerHTML = activities.map(a => `
    <div class="activity-item">
      <div class="activity-icon">${a.icon}</div>
      <div class="activity-text">${a.text}</div>
      <div class="activity-time">${a.time}</div>
    </div>
  `).join('');
}

// Save customer on checkout
function addCustomerToSystem(order) {
  const customers = getCustomers();
  const existingCustomer = customers.find(c => c.email === order.customerEmail);

  if (existingCustomer) {
    existingCustomer.orders = (existingCustomer.orders || 0) + 1;
    existingCustomer.totalSpent = (existingCustomer.totalSpent || 0) + (order.total || 0);
  } else {
    customers.push({
      id: generateId(),
      name: order.customerName || 'Guest',
      email: order.customerEmail || null,
      orders: 1,
      totalSpent: order.total || 0,
      joined: new Date().toLocaleDateString()
    });
  }

  saveCustomers(customers);
}