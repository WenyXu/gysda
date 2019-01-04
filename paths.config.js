exports.js = {
    app: {
        default: 'app/src/js/app.js',
        glob: 'app/src/js/*.js'
    },
    lib: {
        default: [
            'app/lib/OwlCarousel/owl.carousel.min.js',
            'app/lib/magnific/jquery.magnific-popup.min.js',
            'app/lib/jarallax-master/dist/jarallax.min.js',
            'app/lib/jarallax-master/dist/jarallax-element.min.js',
            'app/lib/jquery.lazy-master/jquery.lazy.min.js',
            'app/lib/aos-master/aos.js',
            'app/lib/swiper/dist/js/swiper.min.js'
        ],
        glob: 'app/lib/**/*.js'
    },
    dist: {
        default: 'app/dist/js',
        glob: 'app/dist/**/*.js'
    }
};

exports.sass = {
    app: {
        glob: 'app/src/css/sass/**/*.sass'
    },
    dist: {
        default: 'app/dist/css',
        glob: 'app/dist/**/*.css'
    }
};

exports.html = {
    app: {
        default: 'app/src/index.html'
    },
    dist: {
        glob: 'app/*.html'
    }
};

exports.image = {
    app: {
        glob: 'app/src/img/**/*.{jpeg,png,svg,gif,ico}',
        default: 'app/src/img/**/*.jpg'
    },
    dist: {
        default: 'app/dist/img',
        glob: 'app/dist/img/**/*.{jpeg,jpg,png,svg,gif,ico}'
    }
};

exports.revision = {
    app: {
        glob: 'app/dist/**/*.{css,js,jpeg,jpg,png,svg,ico}',
        exclude: ['china.jpg', 'england.jpg'].map(image => `!app/dist/**/${image}`)
    },
    dist: {
        default: 'app/dist'
    }
}
