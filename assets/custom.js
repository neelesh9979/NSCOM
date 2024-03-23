let triggered = false;
function ScrollExecute() {
    var moreButon = $('#more').last();
    var nextUrl = moreButon.find('a').attr("href");
    if (moreButon.length > 0 && (triggered == false)) {
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
                //console.log('Load More',e.innerHTML);
                //updateGridView(e)
                $('#product-grid').append(e.innerHTML);
                // productVariants();
                // gridPickUpAvailability();
                // productHoverSlider();
                // if(animationStatus){
                //   if (AOS) { 
                //     AOS.refreshHard() 
                //   }
                // }
                triggered = false
            });
    }
}
$(document).ready(function() {
    $(window).scroll(function() {
        ScrollExecute();
    });
});