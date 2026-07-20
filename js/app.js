/**
 * FreshMart Online Grocery Delivery System - Core Application JS
 * Day 1 Setup: Initialization & Search handling placeholder
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('FreshMart Grocery System Initialized - Day 1');
  
  // Search Input listener
  const searchInput = document.getElementById('mainSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      console.log('Searching for:', query);
    });
  }
});
