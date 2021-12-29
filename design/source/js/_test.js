function onToggleStickyInfo() {
  var headerInitPos =
    $('.banner').length > 0 ? $('.banner').offset().top : 0;
  var headerHeight = $('.header').height();
  $(document).scroll(function() {
    var winTop = $(window).scrollTop();
    if (winTop > headerInitPos + headerHeight + 100) {
      $('.js-user-nav').addClass(
        'user-nav--sticky animated fadeInDown'
      );
    } else {
      $('.js-user-nav').removeClass(
        'user-nav--sticky animated fadeInDown'
      );
    }
  });
}

$(document).ready(function() {
  onToggleStickyInfo();

  var toggleNav = function() {
    if ($('.site-canvas').hasClass('site-canvas--active')) {
      // Nav Close
      $('body').removeClass('nav-active');
      $('.site-canvas').removeClass('site-canvas--active');
      $('.close-canvas').removeClass('close-canvas--active');
    } else {
      // Nav Open
      $('body').addClass('nav-active');
      $('.site-canvas').addClass('site-canvas--active');
      $('.close-canvas').addClass('close-canvas--active');
    }
  }

  // Toggle Nav on Click
  $('.toggle-nav, .close-canvas').click(function() {
    toggleNav();
  });

  // slick slider
  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: '.slider-nav',
    infinite: false,
    adaptiveHeight: true,
  });

  $('.slider-nav').slick({
    slidesToShow: 8,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: false,
    focusOnSelect: true,
    infinite: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 4,
        },
      },
    ],
  });

  // carousel Recommendations
  $('.recommend').slick({
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      }
    ]
  });

  $('.alert-customize').fadeTo(3000, 500).slideUp(500, function() {
    $('.alert-customize').slideUp(500);
  });
});

// Slick slider inside modal
$(document).ready(function() {
  $('.slider-roomdetail').slick();
});

$('.modal').on('shown.bs.modal', function() {
  $('.slider-roomdetail').slick('setPosition');
  $('.nav-detail').slick('setPosition');
  $('.slider-room').addClass('open');
})
