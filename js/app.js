/**
 * FreshMart Online Grocery Delivery System - Core Application JS
 * Hero Carousel & Search handling
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('FreshMart Grocery System Initialized - Day 3');
  
  // Search Input listener
  const mainSearchInput = document.getElementById('mainSearchInput');
  const mobileSearchInput = document.getElementById('mobileSearchInput');

  [mainSearchInput, mobileSearchInput].forEach(input => {
    if (input) {
      input.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        console.log('Searching for:', query);
      });
    }
  });

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

  // --- Day 3: Grocery Categories & Product Cards Rendering ---
  const productsGrid = document.getElementById('productsGrid');
  const categoryButtons = document.querySelectorAll('.btn-category');
  const cartCountEl = document.getElementById('cartCount');

  // Keep track of total items added in current session
  let sessionCartCount = 0;

  function renderProducts(categoryFilter = 'all') {
    if (!productsGrid) return;
    
    // Clear grid
    productsGrid.innerHTML = '';
    
    // Filter products
    const filteredProducts = categoryFilter === 'all'
      ? PRODUCTS_DATA
      : PRODUCTS_DATA.filter(p => p.category === categoryFilter);
      
    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bi bi-inbox fs-1 text-muted"></i>
          <p class="text-muted mt-2">No products found in this category.</p>
        </div>
      `;
      return;
    }
    
    // Render cards
    filteredProducts.forEach(product => {
      const cardCol = document.createElement('div');
      cardCol.className = 'col';
      
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
      
      productsGrid.appendChild(cardCol);
    });
    
    // Re-attach listeners to the new add buttons
    attachAddButtonListeners();
  }

  function attachAddButtonListeners() {
    const addButtons = document.querySelectorAll('.btn-add-product');
    addButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.currentTarget.getAttribute('data-id');
        console.log(`Product added to cart: ${productId}`);
        
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
        
        // Increment global badge count
        sessionCartCount++;
        if (cartCountEl) {
          cartCountEl.textContent = sessionCartCount;
          
          // Animate badge scale effect
          cartCountEl.style.transform = 'scale(1.35)';
          cartCountEl.style.transition = 'transform 0.15s ease-in-out';
          setTimeout(() => {
            cartCountEl.style.transform = 'scale(1)';
          }, 150);
        }
      });
    });
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
      const selectedCategory = clickedBtn.getAttribute('data-category');
      renderProducts(selectedCategory);
    });
  });

  // Initial render
  if (typeof PRODUCTS_DATA !== 'undefined') {
    renderProducts('all');
  } else {
    console.error('PRODUCTS_DATA is not defined. Make sure products.js is loaded before app.js');
  }
});
