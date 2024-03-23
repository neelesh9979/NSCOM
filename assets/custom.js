// On Scroll Load More Products From Ajax.
  var currentPage = 1;
  var productsPerPage = 12;
  var isLoading = false;

  // Function to fetch products via AJAX
  function fetchProducts(page) {
    isLoading = true;
    document.getElementById('loader').style.display = 'block';
    var collectionUrl = window.location.pathname;
    $.ajax({
      url: collectionUrl+'?page=' + page,
      method: 'GET',
      success: function(data) {
        //$('#product-container').append(data);
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