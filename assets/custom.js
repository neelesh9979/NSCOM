// On Scroll Load More Products From Ajax.
var currentPage = 1;
var productsPerPage = 12;
var isLoading = false;

// Function to fetch products via AJAX
function fetchProducts(page) {
  console.log('currentPage',currentPage);
  isLoading = true;
  document.getElementById('loader').style.display = 'block';

  // Perform AJAX request to fetch products
  // Example: Replace this with your actual AJAX call to fetch products
  // Make sure to update the URL to your actual Shopify endpoint
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/collections/your-collection-handle?page=' + page, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        // Append fetched products to the container
        document.getElementById('product-container').innerHTML += xhr.responseText;
        isLoading = false;
        document.getElementById('loader').style.display = 'none';
      } else {
        isLoading = false;
        document.getElementById('loader').style.display = 'none';
        // Handle error if AJAX request fails
      }
    }
  };
  xhr.send();
}

// Function to check if the user has scrolled to the bottom of the page
function isBottomOfPage() {
  return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight;
}

// Event listener for scrolling
window.addEventListener('scroll', function() {
  if (!isLoading && isBottomOfPage()) {
    currentPage++;
    fetchProducts(currentPage);
  }
});

// Initial load
fetchProducts(currentPage);
