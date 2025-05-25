$(document).ready(function() {
        // Инициализация Swiper
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
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            on: {
                init: function() {
                    console.log('Swiper initialized successfully');
                },
                slideChange: function() {
                    console.log('Slide changed');
                }
            }
        });

        // Параллакс эффект при движении мыши
        $(document).mousemove(function(e) {
            const screenWidth = $(window).width();
            const screenHeight = $(window).height();
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const moveX = Math.min(Math.max((mouseX - screenWidth / 2) / (screenWidth / 40), -15), 15);
            const moveY = Math.min(Math.max((mouseY - screenHeight / 2) / (screenHeight / 40), -15), 15);

            $('.product-main img').css({
                transform: `translate(${moveX}px, ${moveY}px)`
            });

            $('.product-shadow img').css({
                transform: `translate(${-moveX}px, ${-moveY}px) scale(0.7)`
            });

            $('.product-details').css({
                transform: `translate(${moveX}px, ${moveY}px)`
            });
        });

        

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
    })