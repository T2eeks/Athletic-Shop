$(document).ready(function() {
    // Swiper initialization with touch support
    const swiper = new Swiper('.product-carousel', {
        loop: true,
        autoplay: {
            delay: 5000,
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

    // Parallax effect при движении мыши
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

    // Buy now button logic
    $('.buy-now-btn').on('click', function(e) {
        e.preventDefault();
        const productName = $(this).closest('.product-info-block').find('.product-title').text();
        const productPrice = $(this).closest('.product-info-block').find('.product-price').text();

        const modal = $(`
            <div class="modal" id="orderModal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Оформить заказ</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="orderForm">
                                <div class="form-group">
                                    <label for="productName">Товар</label>
                                    <input type="text" class="form-control" id="productName" value="${productName}" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="customerName">Ваше имя</label>
                                    <input type="text" class="form-control" id="customerName" required>
                                </div>
                                <button type="submit" class="btn btn-danger">Отправить</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `);
        $('body').append(modal);
        $('#orderModal').modal('show');

        $('#orderModal').on('hidden.bs.modal', function () {
            modal.remove();
        });

        $('#orderForm').on('submit', function(e) {
            e.preventDefault();
            const product = $('#productName').val();
            const name = $('#customerName').val();
            const message = `Здравствуйте, хочу заказать ${product}. Имя: ${name}. Цена: ${productPrice}`;
            const token = 'ВАШ_ТОКЕН';
            const chat_id = 'ВАШ_CHAT_ID';
            const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(message)}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        alert('Заказ отправлен!');
                        $('#orderModal').modal('hide');
                    } else {
                        alert('Ошибка при отправке заказа.');
                    }
                });
        });
    });
});