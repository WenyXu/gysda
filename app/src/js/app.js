$(function () {
    'use strict';

    $(document).ready(function () {
        setTimeout(function () {
            $('.preloader').fadeOut();
        }, 500);

        // menu toggle btn
        $('.btn-menu').click(function () {
            $('.fixed-menu').addClass('open');
        });
        $('.btn-close').click(function () {
            $('.fixed-menu').removeClass('open');
        });
        $(window).resize(function () {
            var width = $(window).width();
            if (width > 1200) {
                $('.fixed-menu').removeClass('open');
            }
        });

        // custom select
        $('.select').each(function () {
            var $this = $(this);
            var numberOfOptions = $(this).children('option').length;

            $this.addClass('select-hidden');
            $this.wrap('<div class="select"></div>');
            $this.after('<div class="select-styled"></div>');

            var regexp = /%(.*)%!(.*)!$/;
            var pattern = '<img class="selected-nation-flag" src="$1"/><em class="selected-nation-name">$2</em>';
            var $styledSelect = $this.next('div.select-styled');
            $styledSelect.html($this.children('option').eq(0).text().replace(regexp, pattern));
            var $list = $('<ul />', {
                'class': 'select-options'
            }).insertAfter($styledSelect);

            for (var i = 0; i < numberOfOptions; i++) {
                $('<li />', {
                    html: $this.children('option').eq(i).text().replace(regexp, pattern),
                    rel: $this.children('option').eq(i).val()
                }).appendTo($list);
            }

            var $listItems = $list.children('li');
            $styledSelect.click(function (e) {
                e.stopPropagation();
                $('div.select-styled.active').not(this).each(function () {
                    $(this).removeClass('active').next('ul.select-options').hide();
                });
                $(this).toggleClass('active').next('ul.select-options').fadeToggle();
            });

            $listItems.click(function (e) {
                e.stopPropagation();
                $styledSelect.html($(this).html()).removeClass('active');
                $this.val($(this).attr('rel'));
                $list.fadeOut();
            });

            $(document).click(function () {
                $styledSelect.removeClass('active');
                $list.fadeOut();
            });
        });

        // news carousel
        $('.news-carousel').owlCarousel({
            items: 3,
            margin: 30,
            dots: true,
            autoWidth: true,
            loop: true,
            center: true,
            lazyLoad: true,
            responsive: {}
        });

        // swiper
        var slidesPerColumn = 2;
        var spaceBetween = 73;
        if ($(window).width() < 1200) {
            slidesPerColumn = 1;
            spaceBetween = 0;
        }
        new Swiper('.swiper-container', {
            slidesPerView: 3,
            slidesPerColumn: slidesPerColumn,
            spaceBetween: spaceBetween,
            navigation: {
                nextEl: '.owl-next',
                prevEl: '.owl-prev',
                disabledClass: 'owl-button-disabled'
            },
            breakpoints: {
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 0
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 0
                },
                640: {
                    slidesPerView: 1,
                    spaceBetween: 0
                },
                320: {
                    slidesPerView: 1,
                    spaceBetween: 0
                }
            }
        });

        $('.popup-youtube').magnificPopup({
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });

        // scroll
        $('.menu__link').on('click', function (event) {
            var target = $(this.getAttribute('href'));
            if (target.length) {
                event.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: target.offset().top - 90
                }, 1000);
            }
        });

        $('.mob-menu__link').on('click', function (event) {
            var target = $(this.getAttribute('href'));
            if (target.length) {
                event.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: target.offset().top - 100
                }, 1000);
                $('.fixed-menu').removeClass('open');
            }
        });

        // accordion
        $('.accordion > li:eq(0) a').addClass('active').next().slideDown();
        $('.accordion a').click(function (j) {
            var dropDown = $(this).closest('li').find('p');
            $(this).closest('.accordion').find('p').not(dropDown).slideUp();

            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).closest('.accordion').find('a.active').removeClass('active');
                $(this).addClass('active');
            }

            dropDown.stop(false, true).slideToggle();
            j.preventDefault();
        });

        // jarallax
        $('.jarallax').jarallax({
            speed: 0.6
        });

        // animation
        AOS.init({
            disable: 'mobile',
            duration: 1000,
            once: true
        });
    });
});

// sticky header
var $window = $(window);
$window.on('scroll', function () {
    if ($window.scrollTop() > 1) {
        $('.header').addClass('sticky');
    } else {
        $('.header').removeClass('sticky');
    }
});
