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

  // Initial render & limits setup
  if (typeof PRODUCTS_DATA !== 'undefined') {
    initFilterLimits();
    applyFiltersAndRender();
  } else {
    console.error('PRODUCTS_DATA is not defined. Make sure products.js is loaded before app.js');
  }
});
