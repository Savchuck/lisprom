$(document).ready(function(){
    $('.slider').slick({
        dots:true,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        speed: 500,
        autoplaySpeed: 5000,
        infinite: true,
        autoplay: true,
        centerMode: true,
        
        centerPadding:"0",
        responsive: [
            {
              breakpoint: 1400,
              settings: {
                arrows: true,
                centerMode: true,
                centerPadding: '0px',
                slidesToShow: 3
              }
            },
            {
              breakpoint: 768,
              settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '0px',
                slidesToShow: 3
              }
            },
            {
              breakpoint: 450,
              settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '0px',
                slidesToShow: 1
              }
            }
          ]
      });
});

