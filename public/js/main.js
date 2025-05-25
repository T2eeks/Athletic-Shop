$(document).ready(function() {
    // Swiper initialization
    var mySwiper = new Swiper('.product-carousel', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        watchOverflow: true,
        watchSlidesVisibility: true,
        // Отключаем перехват событий мыши Swiper'ом, чтобы не мешать Parallax
        touchRatio: 0,
        simulateTouch: false
    });

    // Parallax initialization (disabled on mobile)
    if (!/Mobi/.test(navigator.userAgent)) {
        $('.js-parallax-scene').each(function() {
            const parallax = new Parallax(this, {
                relativeInput: true,
                clipRelativeInput: false,
                hoverOnly: false,
                frictionX: 0.1,
                frictionY: 0.1
            });
            console.log('Parallax initialized for:', this);

            // Отладка: проверяем события мыши
            $(this).on('mousemove', function(e) {
                console.log('Mouse moved over parallax scene:', e.pageX, e.pageY);
            });
        });
    } else {
        console.log('Parallax disabled on mobile');
    }

    // Buy now button logic
    $('.buy-now-btn').on('click', function(e) {
        e.preventDefault();
        const productName = $(this).closest('.product-info').find('h2').text();
        const productPrice = $(this).closest('.product-info').find('p').text();

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