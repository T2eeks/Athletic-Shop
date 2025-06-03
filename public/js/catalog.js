$(document).ready(function() {
    // Category filter
    $('.dropdown-item').on('click', function(e) {
        e.preventDefault();
        const selectedCategory = $(this).data('category');
        $('.category-filter-btn').text($(this).text());
        $('.product-card').each(function() {
            const cardCategory = $(this).data('category');
            if (!selectedCategory || cardCategory === selectedCategory) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // Buy now button logic (оставляем без изменений)
    $('.buy-now-btn').on('click', function(e) {
        e.preventDefault();
        const productName = $(this).closest('.product-card').find('.card-title').text();
        const productPrice = $(this).closest('.product-card').find('.card-price').text();

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