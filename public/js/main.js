$(document).ready(function() {
    const swiper = new Swiper('.product-carousel', {
        loop: true,
        autoplay: {
            delay: 123123000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'slide',
        speed: 800,
        slidesPerView: 1,
        spaceBetween: 0,
        simulateTouch: true,
        touchRatio: 1,
        grabCursor: true
    });

    function applyMouseParallax() {
        window.addEventListener('mousemove', (e) => {
            const x = -(e.clientX / window.innerWidth - 0.5);
            const y = -(e.clientY / window.innerHeight - 0.5);

            const activeSlide = document.querySelector('.swiper-slide-active');
            if (!activeSlide) return;

            const main = activeSlide.querySelector('.image-main');
            const blur = activeSlide.querySelector('.image-blur');

            if (main && blur) {
                main.style.transform = `translate(-50%, -50%) rotate(-5deg) translate(${x * 60}px, ${y * 60}px)`;
                blur.style.transform = `rotate(5deg) translate(${x * 30}px, ${y * 30}px)`;
            }
        });

        window.addEventListener('mouseleave', () => {
            const slides = document.querySelectorAll('.swiper-slide');
            slides.forEach(slide => {
                const main = slide.querySelector('.image-main');
                const blur = slide.querySelector('.image-blur');
                if (main) main.style.transform = 'translate(-50%, -50%) rotate(-5deg)';
                if (blur) blur.style.transform = 'rotate(5deg)';
            });
        });
    }

    applyMouseParallax();

    $('.buy-now-btn').on('click', function(e) {
        e.preventDefault();
        const productName = $(this).closest('.product-info-block').find('.product-title').text();
        const productPrice = parseFloat($(this).closest('.product-info-block').find('.product-price').text().replace('₸', '').replace('.', ''));
        window.addToCart({ name: productName, price: productPrice });
        window.showNotification('Товар добавлен в корзину!'); 
        window.updateCartCount();
    });
});