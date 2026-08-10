/**
 * FreshMart Online Grocery Delivery System - Core Application JS
 * Hero Carousel & Search handling
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('FreshMart Grocery System Initialized - Day 3');
  
  const mainSearchInput = document.getElementById('mainSearchInput');
  const mobileSearchInput = document.getElementById('mobileSearchInput');

  // Initialize Hero Carousel with Bootstrap Carousel API
  const heroCarouselEl = document.getElementById('heroCarousel');
  if (heroCarouselEl && typeof bootstrap !== 'undefined') {
    new bootstrap.Carousel(heroCarouselEl, {
      interval: 4500,
      pause: 'hover',
      wrap: true,
      touch: true
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // --- Day 3 & 4: Grocery Categories, Filtering & Product Cards Rendering ---
  const productsGrid = document.getElementById('productsGrid');
  const categoryButtons = document.querySelectorAll('.btn-category');
  const cartCountEl = document.getElementById('cartCount');

  // Keep track of total items added in current session
  let sessionCartCount = 0;

  // --- Day 4: State management for filtering, search and sorting ---
  const filterState = {
    category: 'all',
    searchQuery: '',
    diet: 'all',
    maxPrice: 0,
    selectedBrands: new Set(),
    sortBy: 'featured'
  };

  // Dynamic Range and Brand Setup limits
  let minPrice = 0;
  let maxPrice = 0;
  let allBrands = [];

  function initFilterLimits() {
    if (typeof PRODUCTS_DATA === 'undefined' || PRODUCTS_DATA.length === 0) return;
    
    // Find min and max price
    const prices = PRODUCTS_DATA.map(p => p.price);
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
    
    // Default initial maxPrice to max price
    filterState.maxPrice = maxPrice;
    
    // Update price slider elements
    const desktopSlider = document.getElementById('priceRange');
    const mobileSlider = document.getElementById('priceRangeMobile');
    
    [desktopSlider, mobileSlider].forEach(slider => {
      if (slider) {
        slider.min = Math.floor(minPrice);
        slider.max = Math.ceil(maxPrice);
        slider.step = '0.01';
        slider.value = Math.ceil(maxPrice);
      }
    });

    // Update max indicators text
    const maxInds = document.querySelectorAll('.price-max-indicator, .price-max-indicator-mobile');
    maxInds.forEach(ind => ind.textContent = Math.ceil(maxPrice).toFixed(2));
    
    updatePriceIndicators(Math.ceil(maxPrice));

    // Get unique brands
    const brandsSet = new Set(PRODUCTS_DATA.map(p => p.brand));
    allBrands = Array.from(brandsSet).sort();

    // Render Brand lists in DOM
    renderBrandCheckboxes();
  }

  function updatePriceIndicators(val) {
    const indicators = document.querySelectorAll('.price-val-indicator, .price-val-indicator-mobile');
    indicators.forEach(ind => ind.textContent = parseFloat(val).toFixed(2));
  }

  function renderBrandCheckboxes() {
    const brandList = document.getElementById('brandList');
    const brandListMobile = document.getElementById('brandListMobile');
    
    if (brandList) brandList.innerHTML = '';
    if (brandListMobile) brandListMobile.innerHTML = '';
    
    allBrands.forEach((brand, idx) => {
      // Desktop checkbox
      if (brandList) {
        const item = document.createElement('div');
        item.className = 'form-check mb-2';
        item.innerHTML = `
          <input class="form-check-input brand-checkbox" type="checkbox" value="${brand}" id="brand_${idx}">
          <label class="form-check-label text-truncate w-100" for="brand_${idx}" title="${brand}">
            ${brand}
          </label>
        `;
        brandList.appendChild(item);
      }
      
      // Mobile checkbox
      if (brandListMobile) {
        const item = document.createElement('div');
        item.className = 'form-check mb-2';
        item.innerHTML = `
          <input class="form-check-input brand-checkbox-mobile" type="checkbox" value="${brand}" id="brand_mobile_${idx}">
          <label class="form-check-label text-truncate w-100" for="brand_mobile_${idx}" title="${brand}">
            ${brand}
          </label>
        `;
        brandListMobile.appendChild(item);
      }
    });
  }

  function applyFiltersAndRender() {
    if (!productsGrid) return;
    
    // Clear grid
    productsGrid.innerHTML = '';
    
    // Filter products
    const filtered = PRODUCTS_DATA.filter(product => {
      // 1. Category Filter
      const matchesCategory = filterState.category === 'all' || product.category === filterState.category;
      
      // 2. Diet Filter
      const matchesDiet = filterState.diet === 'all' || 
                           (filterState.diet === 'veg' && product.isVeg) || 
                           (filterState.diet === 'non-veg' && !product.isVeg);
      
      // 3. Price Filter
      const matchesPrice = product.price <= filterState.maxPrice;
      
      // 4. Brand Filter
      const matchesBrand = filterState.selectedBrands.size === 0 || filterState.selectedBrands.has(product.brand);
      
      // 5. Search Query Filter
      const query = filterState.searchQuery.toLowerCase().trim();
      const matchesSearch = query === '' || 
                            product.name.toLowerCase().includes(query) ||
                            product.brand.toLowerCase().includes(query) ||
                            product.description.toLowerCase().includes(query);
                            
      return matchesCategory && matchesDiet && matchesPrice && matchesBrand && matchesSearch;
    });
    
    // Apply Sorting
    if (filterState.sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filterState.sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filterState.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      // featured / default
      filtered.sort((a, b) => a.id - b.id);
    }
    
    // Update count labels
    const productCountEl = document.getElementById('productCount');
    const totalProductCountEl = document.getElementById('totalProductCount');
    if (productCountEl) productCountEl.textContent = filtered.length;
    if (totalProductCountEl) {
      const currentCategoryTotal = filterState.category === 'all' 
        ? PRODUCTS_DATA.length 
        : PRODUCTS_DATA.filter(p => p.category === filterState.category).length;
      totalProductCountEl.textContent = currentCategoryTotal;
    }
    
    // If no match found
    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="empty-state-card mx-auto" style="max-width: 480px;">
            <i class="bi bi-inbox fs-1 text-success mb-3 d-block"></i>
            <h5 class="fw-bold text-dark">No Products Found</h5>
            <p class="text-muted small mb-4">We couldn't find any groceries matching your exact criteria. Try resetting filters or modifying your search.</p>
            <button class="btn btn-success btn-clear-filters rounded-pill px-4 py-2">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
            </button>
          </div>
        </div>
      `;
      
      // Re-attach clear listeners in the empty state card
      document.querySelectorAll('.btn-clear-filters').forEach(btn => {
        btn.addEventListener('click', resetAllFilters);
      });
      return;
    }
    
    // Render cards
    filtered.forEach(product => {
      const cardCol = document.createElement('div');
      cardCol.className = 'col product-card-animated';
      
      const originalPriceHTML = product.originalPrice 
        ? `<span class="price-original">$${product.originalPrice.toFixed(2)}</span>` 
        : '';
        
      cardCol.innerHTML = `
        <div class="product-card">
          <div class="product-img-wrapper">
            <span class="product-rating-badge">
              <i class="bi bi-star-fill"></i> ${product.rating.toFixed(1)}
            </span>
            <img src="${product.image}" alt="${product.name}" class="product-card-img" loading="lazy">
          </div>
          <div class="card-body p-3 d-flex flex-column justify-content-between" style="min-height: 190px;">
            <div>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="product-brand">${product.brand}</span>
                <span class="badge-diet ${product.isVeg ? 'veg' : 'non-veg'}">
                  <span class="diet-dot"></span>
                  ${product.isVeg ? 'Veg' : 'Non-Veg'}
                </span>
              </div>
              <h5 class="product-card-title" title="${product.name}">${product.name}</h5>
              <p class="product-card-unit mb-3">${product.unit}</p>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              <div class="product-price-wrapper">
                <span class="price-current">$${product.price.toFixed(2)}</span>
                ${originalPriceHTML}
              </div>
              <button class="btn btn-add-product" data-id="${product.id}">
                <i class="bi bi-plus-lg"></i> Add
              </button>
            </div>
          </div>
        </div>
      `;
      
      // Attach click listeners to view details modal
      const imgWrapper = cardCol.querySelector('.product-img-wrapper');
      const cardTitle = cardCol.querySelector('.product-card-title');
      
      const openDetails = () => {
        showProductDetails(product);
      };
      
      if (imgWrapper) imgWrapper.addEventListener('click', openDetails);
      if (cardTitle) cardTitle.addEventListener('click', openDetails);

      productsGrid.appendChild(cardCol);
    });
    
    // Re-attach listeners to the new add buttons
    attachAddButtonListeners();
  }

  // --- Day 5, 6 & 7: Shopping Cart State, Persistence, Details Modal & Success Confirmation logic ---
  let cart = []; // Array of { id, quantity }
  let appliedPromo = null; // Store applied promo code

  function initCart() {
    const savedCart = localStorage.getItem('freshmart_cart');
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
      } catch (e) {
        cart = [];
      }
    }
    appliedPromo = localStorage.getItem('freshmart_promo') || null;
    updateCartUI();
  }

  function saveCart() {
    localStorage.setItem('freshmart_cart', JSON.stringify(cart));
    if (appliedPromo) {
      localStorage.setItem('freshmart_promo', appliedPromo);
    } else {
      localStorage.removeItem('freshmart_promo');
    }
    updateCartUI();
  }

  function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) {
      const prevCount = parseInt(cartCountEl.textContent) || 0;
      cartCountEl.textContent = totalItems;
      
      // Animate badge scale effect if count changed
      if (prevCount !== totalItems) {
        cartCountEl.style.transform = 'scale(1.35)';
        cartCountEl.style.transition = 'transform 0.15s ease-in-out';
        setTimeout(() => {
          cartCountEl.style.transform = 'scale(1)';
        }, 150);
      }
    }

    const cartItemsList = document.getElementById('cartItemsList');
    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-cart-x fs-1 text-muted mb-3 d-block"></i>
          <p class="text-muted small">Your cart is empty.</p>
          <a href="#categories" class="btn btn-outline-success btn-sm rounded-pill px-4 py-2 mt-2" data-bs-dismiss="offcanvas">
            Start Shopping
          </a>
        </div>
      `;
      updateTotals(0);
      return;
    }

    cartItemsList.innerHTML = '';
    cart.forEach(item => {
      const product = PRODUCTS_DATA.find(p => p.id === item.id);
      if (!product) return;

      const itemRow = document.createElement('div');
      itemRow.className = 'cart-item-row';
      itemRow.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h6 class="cart-item-name mb-0" title="${product.name}">${product.name}</h6>
          <span class="small text-muted">${product.unit}</span>
          <div class="cart-item-price">$${product.price.toFixed(2)}</div>
        </div>
        <div class="cart-item-actions">
          <button class="btn-remove-item" data-id="${item.id}" title="Remove item">
            <i class="bi bi-trash3"></i>
          </button>
          <div class="quantity-selector">
            <button class="btn btn-qty-minus" data-id="${item.id}" type="button">
              <i class="bi bi-dash"></i>
            </button>
            <input type="text" value="${item.quantity}" readonly style="width: 25px; text-align: center;">
            <button class="btn btn-qty-plus" data-id="${item.id}" type="button">
              <i class="bi bi-plus"></i>
            </button>
          </div>
        </div>
      `;
      cartItemsList.appendChild(itemRow);
    });

    // Attach click listeners to cart drawer rows
    cartItemsList.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'));
        removeFromCart(id);
      });
    });

    cartItemsList.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'));
        const item = cart.find(i => i.id === id);
        if (item) {
          updateCartQty(id, item.quantity - 1);
        }
      });
    });

    cartItemsList.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'));
        const item = cart.find(i => i.id === id);
        if (item) {
          updateCartQty(id, item.quantity + 1);
        }
      });
    });

    // Compute subtotal
    const subtotal = cart.reduce((sum, item) => {
      const product = PRODUCTS_DATA.find(p => p.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    updateTotals(subtotal);
  }

  function addToCart(productId, quantity = 1) {
    productId = parseInt(productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ id: productId, quantity: quantity });
    }
    
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    const prodName = product ? product.name : 'Product';
    showToast(`Added ${quantity} x ${prodName} to cart.`);
    
    saveCart();
  }

  function updateCartQty(productId, qty) {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.quantity = qty;
      saveCart();
    }
  }

  function removeFromCart(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    const prodName = product ? product.name : 'Product';
    cart = cart.filter(item => item.id !== productId);
    showToast(`Removed ${prodName} from cart.`, 'warning');
    saveCart();
  }

  function updateTotals(subtotal) {
    const subtotalEl = document.getElementById('cartSubtotal');
    const feeEl = document.getElementById('cartDeliveryFee');
    const discountEl = document.getElementById('cartDiscount');
    const discountRow = document.getElementById('promoDiscountRow');
    const totalEl = document.getElementById('cartTotal');

    if (!subtotalEl || !feeEl || !totalEl) return;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    let deliveryFee = 0;
    if (subtotal > 0) {
      deliveryFee = subtotal >= 35 ? 0 : 4.99;
    }
    feeEl.textContent = deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`;

    let discount = 0;
    if (appliedPromo === 'FRESH35' && subtotal > 0) {
      discount = subtotal * 0.10;
      if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`;
      if (discountRow) discountRow.classList.remove('d-none');
    } else {
      if (discountRow) discountRow.classList.add('d-none');
    }

    const total = subtotal + deliveryFee - discount;
    totalEl.textContent = `$${total.toFixed(2)}`;
  }

  function attachAddButtonListeners() {
    const addButtons = document.querySelectorAll('.btn-add-product');
    addButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.currentTarget.getAttribute('data-id');
        addToCart(productId, 1);
        
        // Simple micro-animation feedback
        const btn = e.currentTarget;
        const originalContent = btn.innerHTML;
        btn.innerHTML = `<i class="bi bi-check-lg"></i> Added`;
        btn.classList.add('bg-success');
        btn.style.pointerEvents = 'none';
        
        // Reset button after 1.2s
        setTimeout(() => {
          btn.innerHTML = originalContent;
          btn.classList.remove('bg-success');
          btn.style.pointerEvents = 'auto';
        }, 1200);
      });
    });
  }

  function showProductDetails(product) {
    const modalBody = document.getElementById('productDetailsModalBody');
    if (!modalBody) return;

    const originalPriceHTML = product.originalPrice 
      ? `<span class="price-original fs-6 text-decoration-line-through text-muted ms-2">$${product.originalPrice.toFixed(2)}</span>` 
      : '';
    
    const discountBadgeHTML = product.originalPrice 
      ? `<span class="badge bg-danger-subtle text-danger rounded-pill fs-7 px-2.5 py-1">Save ${(((product.originalPrice - product.price) / product.originalPrice) * 100).toFixed(0)}%</span>` 
      : '';

    modalBody.innerHTML = `
      <div class="row g-0">
        <!-- Product Image Column -->
        <div class="col-md-6 modal-img-col position-relative bg-light d-flex align-items-center justify-content-center" style="min-height: 350px;">
          <span class="product-rating-badge position-absolute" style="top: 15px; left: 15px; background: rgba(255, 255, 255, 0.95); border-radius: 50px; padding: 4px 10px; font-weight: 700; font-size: 0.85rem; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
            <i class="bi bi-star-fill text-warning me-1"></i> ${product.rating.toFixed(1)}
          </span>
          <span class="badge-diet ${product.isVeg ? 'veg' : 'non-veg'} position-absolute" style="top: 15px; right: 15px; padding: 4px 10px; font-weight: 700; font-size: 0.8rem; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
            <span class="diet-dot"></span>
            ${product.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
          <img src="${product.image}" alt="${product.name}" class="img-fluid w-100 h-100 object-fit-cover" style="max-height: 400px;">
        </div>
        
        <!-- Product Details Column -->
        <div class="col-md-6 p-4 p-lg-5 d-flex flex-column justify-content-between">
          <div>
            <span class="product-brand fs-7 text-uppercase fw-semibold text-muted d-block mb-1">${product.brand}</span>
            <h3 class="fw-bold text-dark mb-2" id="productDetailsModalLabel">${product.name}</h3>
            <p class="text-secondary small mb-3">${product.unit}</p>
            
            <div class="d-flex align-items-center gap-2 mb-4">
              <span class="fs-3 fw-bold text-success">$${product.price.toFixed(2)}</span>
              ${originalPriceHTML}
              ${discountBadgeHTML}
            </div>
            
            <h6 class="fw-bold text-dark mb-2">Description</h6>
            <p class="text-secondary small mb-4">${product.description}</p>
          </div>
          
          <!-- Quantity & Add to Cart Action -->
          <div>
            <div class="d-flex align-items-center gap-3 mb-4">
              <span class="fw-semibold text-dark small">Quantity:</span>
              <div class="input-group quantity-selector" style="width: 130px;">
                <button class="btn btn-outline-secondary btn-sm px-2.5 border-secondary-subtle" type="button" id="modalQtyMinus">
                  <i class="bi bi-dash-lg"></i>
                </button>
                <input type="text" class="form-control form-control-sm text-center border-secondary-subtle fw-bold" id="modalQtyInput" value="1" readonly>
                <button class="btn btn-outline-secondary btn-sm px-2.5 border-secondary-subtle" type="button" id="modalQtyPlus">
                  <i class="bi bi-plus-lg"></i>
                </button>
              </div>
            </div>
            
            <button class="btn btn-success btn-lg w-100 rounded-pill fw-bold shadow-sm" id="modalAddToCartBtn">
              <i class="bi bi-cart-plus-fill me-2"></i> Add To Cart
            </button>
          </div>
        </div>
      </div>
    `;

    const qtyInput = document.getElementById('modalQtyInput');
    const btnMinus = document.getElementById('modalQtyMinus');
    const btnPlus = document.getElementById('modalQtyPlus');
    const btnAdd = document.getElementById('modalAddToCartBtn');

    if (btnMinus && btnPlus && qtyInput) {
      btnMinus.addEventListener('click', () => {
        let qty = parseInt(qtyInput.value) || 1;
        if (qty > 1) {
          qtyInput.value = qty - 1;
        }
      });

      btnPlus.addEventListener('click', () => {
        let qty = parseInt(qtyInput.value) || 1;
        qtyInput.value = qty + 1;
      });
    }

    if (btnAdd && qtyInput) {
      btnAdd.addEventListener('click', () => {
        const qty = parseInt(qtyInput.value) || 1;
        addToCart(product.id, qty);
        
        const originalContent = btnAdd.innerHTML;
        btnAdd.innerHTML = `<i class="bi bi-check-lg"></i> Added to Cart!`;
        btnAdd.classList.replace('btn-success', 'btn-outline-success');
        btnAdd.style.pointerEvents = 'none';

        setTimeout(() => {
          const modalEl = document.getElementById('productDetailsModal');
          if (modalEl && typeof bootstrap !== 'undefined') {
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
        }, 850);
      });
    }

    const modalEl = document.getElementById('productDetailsModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
      modalInstance.show();
    }
  }

  function initPromoCodeHandler() {
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const promoCodeInput = document.getElementById('promoCodeInput');
    const promoFeedback = document.getElementById('promoFeedback');

    if (!applyPromoBtn || !promoCodeInput || !promoFeedback) return;

    if (appliedPromo) {
      promoCodeInput.value = appliedPromo;
      promoFeedback.textContent = `Promo code "${appliedPromo}" applied! (10% Off)`;
      promoFeedback.className = 'small mt-1 px-1 text-success';
    }

    applyPromoBtn.addEventListener('click', () => {
      const code = promoCodeInput.value.trim().toUpperCase();
      if (code === 'FRESH35') {
        appliedPromo = 'FRESH35';
        promoFeedback.textContent = 'Promo code "FRESH35" applied! (10% Off)';
        promoFeedback.className = 'small mt-1 px-1 text-success';
        saveCart();
        showToast('Promo code "FRESH35" applied successfully.');
      } else if (code === '') {
        appliedPromo = null;
        promoFeedback.textContent = '';
        saveCart();
      } else {
        promoFeedback.textContent = 'Invalid promo code.';
        promoFeedback.className = 'small mt-1 px-1 text-danger';
        showToast('Invalid promo code entered.', 'error');
      }
    });
  }

  function initCheckoutHandler() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener('click', async () => {
      if (cart.length === 0) {
        showToast('Your cart is empty! Please add some items before checking out.', 'warning');
        return;
      }

      const subtotal = cart.reduce((sum, item) => {
        const product = PRODUCTS_DATA.find(p => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);
      const deliveryFee = subtotal >= 35 ? 0 : 4.99;
      const discount = appliedPromo === 'FRESH35' ? subtotal * 0.10 : 0;
      const total = subtotal + deliveryFee - discount;

      // Disable checkout button while processing
      checkoutBtn.disabled = true;
      checkoutBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Processing...`;

      try {
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            items: cart,
            subtotal,
            deliveryFee,
            discount,
            total
          })
        });

        if (!response.ok) throw new Error('Failed to create order on server');

        const orderData = await response.json();

        // Populate Success Modal from server response
        const successOrderTotal = document.getElementById('successOrderTotal');
        const successTrackingCode = document.getElementById('successTrackingCode');
        
        if (successOrderTotal) {
          successOrderTotal.textContent = `$${orderData.total.toFixed(2)}`;
        }
        
        if (successTrackingCode) {
          successTrackingCode.textContent = orderData.trackingCode;
        }

        const offcanvasCartEl = document.getElementById('offcanvasCart');
        if (offcanvasCartEl && typeof bootstrap !== 'undefined') {
          const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasCartEl);
          if (offcanvasInstance) {
            offcanvasInstance.hide();
          }
        }

        const successModalEl = document.getElementById('checkoutSuccessModal');
        if (successModalEl && typeof bootstrap !== 'undefined') {
          const successModal = bootstrap.Modal.getOrCreateInstance(successModalEl);
          successModal.show();
        }

        // Reset cart state
        cart = [];
        appliedPromo = null;
        
        const promoCodeInput = document.getElementById('promoCodeInput');
        const promoFeedback = document.getElementById('promoFeedback');
        if (promoCodeInput) promoCodeInput.value = '';
        if (promoFeedback) promoFeedback.textContent = '';

        saveCart();
        showToast('Order checkout completed successfully.');
      } catch (err) {
        console.error('Checkout error:', err);
        showToast('Could not reach backend. Checkout failed.', 'error');
      } finally {
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = `Proceed to Checkout <i class="bi bi-arrow-right ms-1"></i>`;
      }
    });
  }

  function showToast(message, type = 'success') {
    const toastEl = document.getElementById('cartToast');
    const toastBody = document.getElementById('cartToastBody');
    if (!toastEl || !toastBody) return;

    toastBody.textContent = message;

    const headerEl = toastEl.querySelector('.toast-header');
    if (headerEl) {
      headerEl.className = 'toast-header border-0 rounded-top-4 text-white';
      if (type === 'success') {
        headerEl.classList.add('bg-success');
      } else if (type === 'error' || type === 'danger') {
        headerEl.classList.add('bg-danger');
      } else if (type === 'warning') {
        headerEl.classList.add('bg-warning', 'text-dark');
      } else {
        headerEl.classList.add('bg-primary');
      }
    }

    if (typeof bootstrap !== 'undefined') {
      const toastInstance = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3000 });
      toastInstance.show();
    }
  }

  function resetAllFilters() {
    // 1. Reset state
    filterState.category = 'all';
    filterState.searchQuery = '';
    filterState.diet = 'all';
    filterState.maxPrice = Math.ceil(maxPrice);
    filterState.selectedBrands.clear();
    filterState.sortBy = 'featured';
    
    // 2. Reset category active pills
    categoryButtons.forEach(btn => {
      if (btn.getAttribute('data-category') === 'all') {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // 3. Reset search inputs
    if (mainSearchInput) mainSearchInput.value = '';
    if (mobileSearchInput) mobileSearchInput.value = '';
    
    // 4. Reset diet radio inputs
    const allRadio = document.getElementById('dietAll');
    const allRadioMobile = document.getElementById('dietAllMobile');
    if (allRadio) allRadio.checked = true;
    if (allRadioMobile) allRadioMobile.checked = true;
    
    // 5. Reset Price sliders
    const desktopSlider = document.getElementById('priceRange');
    const mobileSlider = document.getElementById('priceRangeMobile');
    if (desktopSlider) desktopSlider.value = Math.ceil(maxPrice);
    if (mobileSlider) mobileSlider.value = Math.ceil(maxPrice);
    updatePriceIndicators(Math.ceil(maxPrice));
    
    // 6. Reset Brand checkboxes
    document.querySelectorAll('.brand-checkbox, .brand-checkbox-mobile').forEach(cb => {
      cb.checked = false;
    });
    
    // 7. Reset Sort select
    const sortSelect = document.getElementById('sortBySelect');
    if (sortSelect) sortSelect.value = 'featured';
    
    // 8. Re-render
    applyFiltersAndRender();
  }

  // Set up category buttons filtering
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active class from all
      categoryButtons.forEach(b => b.classList.remove('active'));
      
      // Add active to clicked button
      const clickedBtn = e.currentTarget;
      clickedBtn.classList.add('active');
      
      // Filter & Render
      filterState.category = clickedBtn.getAttribute('data-category');
      applyFiltersAndRender();
    });
  });

  // Setup dynamic brand listeners (using event delegation for simplicity)
  const brandList = document.getElementById('brandList');
  if (brandList) {
    brandList.addEventListener('change', (e) => {
      if (e.target.classList.contains('brand-checkbox')) {
        const brand = e.target.value;
        const checked = e.target.checked;
        
        // Sync mobile checkbox
        const mobileCheck = document.querySelector(`.brand-checkbox-mobile[value="${brand}"]`);
        if (mobileCheck) mobileCheck.checked = checked;
        
        if (checked) {
          filterState.selectedBrands.add(brand);
        } else {
          filterState.selectedBrands.delete(brand);
        }
        applyFiltersAndRender();
      }
    });
  }

  const brandListMobile = document.getElementById('brandListMobile');
  if (brandListMobile) {
    brandListMobile.addEventListener('change', (e) => {
      if (e.target.classList.contains('brand-checkbox-mobile')) {
        const brand = e.target.value;
        const checked = e.target.checked;
        
        // Sync desktop checkbox
        const desktopCheck = document.querySelector(`.brand-checkbox[value="${brand}"]`);
        if (desktopCheck) desktopCheck.checked = checked;
        
        if (checked) {
          filterState.selectedBrands.add(brand);
        } else {
          filterState.selectedBrands.delete(brand);
        }
        applyFiltersAndRender();
      }
    });
  }

  // Setup Diet Filter Radio Listeners
  document.querySelectorAll('.btn-diet').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const val = e.target.value;
      filterState.diet = val;
      
      // Sync mobile radio check
      const mobRadio = document.querySelector(`.btn-diet-mobile[value="${val}"]`);
      if (mobRadio) mobRadio.checked = true;
      
      applyFiltersAndRender();
    });
  });

  document.querySelectorAll('.btn-diet-mobile').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const val = e.target.value;
      filterState.diet = val;
      
      // Sync desktop radio check
      const deskRadio = document.querySelector(`.btn-diet[value="${val}"]`);
      if (deskRadio) deskRadio.checked = true;
      
      applyFiltersAndRender();
    });
  });

  // Setup Price slider Range Listeners
  const desktopSlider = document.getElementById('priceRange');
  const mobileSlider = document.getElementById('priceRangeMobile');

  [desktopSlider, mobileSlider].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        
        // Sync other slider
        if (slider === desktopSlider && mobileSlider) {
          mobileSlider.value = val;
        } else if (slider === mobileSlider && desktopSlider) {
          desktopSlider.value = val;
        }
        
        updatePriceIndicators(val);
        filterState.maxPrice = val;
        applyFiltersAndRender();
      });
    }
  });

  // Setup Sort listener
  const sortSelect = document.getElementById('sortBySelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      filterState.sortBy = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Setup Clear filter buttons listeners
  document.querySelectorAll('.btn-clear-filters').forEach(btn => {
    btn.addEventListener('click', resetAllFilters);
  });

  // Search input listeners (Syncing desktop and mobile search bars)
  [mainSearchInput, mobileSearchInput].forEach(input => {
    if (input) {
      input.addEventListener('input', (e) => {
        const queryVal = e.target.value;
        if (input === mainSearchInput && mobileSearchInput) {
          mobileSearchInput.value = queryVal;
        } else if (input === mobileSearchInput && mainSearchInput) {
          mainSearchInput.value = queryVal;
        }
        filterState.searchQuery = queryVal;
        applyFiltersAndRender();
      });
    }
  });

  async function fetchProducts() {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) throw new Error('API response error');
      const data = await response.json();
      
      // Update global PRODUCTS_DATA array content dynamically
      if (Array.isArray(PRODUCTS_DATA)) {
        PRODUCTS_DATA.length = 0;
        PRODUCTS_DATA.push(...data);
      }
    } catch (err) {
      console.warn('Failed to fetch products from backend, falling back to static local data:', err);
    }
  }

  // Initial render, limits & cart setup
  if (typeof PRODUCTS_DATA !== 'undefined') {
    fetchProducts().then(() => {
      initFilterLimits();
      applyFiltersAndRender();
      initCart();
      initPromoCodeHandler();
      initCheckoutHandler();
    });
  } else {
    console.error('PRODUCTS_DATA is not defined. Make sure products.js is loaded before app.js');
  }
});
