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
    $.ajax({
      url: '/collections/your-collection-handle?page=' + page,
      method: 'GET',
      success: function(data) {
        // Append fetched products to the container
        $('#product-container').append(data);
        isLoading = false;
        document.getElementById('loader').style.display = 'none';
      },
      error: function() {
        isLoading = false;
        document.getElementById('loader').style.display = 'none';
        // Handle error if AJAX request fails
      }
    });
  }

  // Function to check if the user has scrolled to the bottom of the page
  function isBottomOfPage() {
    return $(window).scrollTop() + $(window).height() >= $(document).height();
  }

  // Event listener for scrolling
  $(window).scroll(function() {
    if (!isLoading && isBottomOfPage()) {
      currentPage++;
      fetchProducts(currentPage);
    }
  });

  // Initial load
  fetchProducts(currentPage);