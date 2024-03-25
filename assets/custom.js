// infinate product scrolling on the collection page 
let triggered = false;
function ScrollExecute() {
    var moreButon = $('#more').last();
    var nextUrl = moreButon.find('a').attr("href");
    if (screenVisibility(moreButon) && (triggered == false)) {
        triggered = true;
        $.ajax({
                url: nextUrl,
                type: 'GET',
                beforeSend: function() {
                    moreButon.find('.load').removeClass('hidden');
                }
            })
            .done(function(data) {
                moreButon.remove();
                var e = document.createElement('div');
                e.innerHTML = $(data).find('#product-grid').html();
                $('#product-grid').append(e.innerHTML);
                triggered = false
            });
    }
}
function screenVisibility(elem) {
  if (elem.length == 0) {
    return;
  }

  var $window = $(window);
  var viewport_top = $window.scrollTop();
  var viewport_height = $window.height();
  var viewport_bottom = viewport_top + viewport_height;
  var $elem = elem;
  var top = $elem.offset().top;
  var height = $elem.height();
  var bottom = top + height;
  return (
    (top >= viewport_top && top < viewport_bottom) ||
    (bottom > viewport_top && bottom <= viewport_bottom) ||
    (height > viewport_height &&
      top <= viewport_top &&
      bottom >= viewport_bottom)
  );
}
$(document).ready(function() {
    $(window).scroll(function() {
        ScrollExecute();
    });
});