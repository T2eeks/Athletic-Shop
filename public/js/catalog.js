$(document).ready(function() {
    const cardsPerPage = 6;
    let currentPage = 1;

    function updatePagination() {
        const $cards = $('.product-card:visible'); 
        const totalPages = Math.ceil($cards.length / cardsPerPage);
        $cards.hide();
        $cards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage).show();

        $('#pagination').empty();
        for (let i = 1; i <= totalPages; i++) {
            $('#pagination').append(`<button class="page-btn ${i === currentPage ? 'active' : ''}">${i}</button>`);
        }
    }

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
        currentPage = 1; 
        updatePagination();
    });


    $(document).on('click', '.page-btn', function() {
        currentPage = parseInt($(this).text());
        updatePagination();
    });


    $('.product-card').on('click', function(e) {
        if (!$(e.target).hasClass('buy-now-btn')) { 
            e.preventDefault();
            const productName = $(this).find('.card-title').text();
            const productPrice = $(this).find('.card-price').text();
            const productImage = $(this).find('.card-image').css('background-image').slice(4, -1).replace(/"/g, '');
            const productDescription = $(this).data('extended-description') || $(this).find('.card-description').text();
            const productBrand = $(this).data('brand') || 'Не указан';
            const productId = $(this).data('id') || Math.random().toString(36).substr(2, 9); // Уникальный ID для избранного

            const modal = $(`
                <div class="modal fade" id="productDetailModal" tabindex="-1" role="dialog" aria-labelledby="productModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="modal">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="productModalLabel">${productName}</h5>
                                <button type="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <img src="${productImage}" alt="${productName}" class="img-fluid product-detail-image">
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong>Бренд:</strong> ${productBrand}</p>
                                        <p><strong>Цена:</strong> ${productPrice}</p>
                                        <p><strong>Описание:</strong> ${productDescription}</p>
                                        <button class="btn btn-warning add-to-favorites" data-product-id="${productId}" data-product-name="${productName}">Добавить в избранное</button>
                                        <a href="#" class="btn buy-now-btn mt-2">Купить сейчас</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
            $('body').append(modal);
            $('#productDetailModal').modal('show');

            $('#productDetailModal').on('hidden.bs.modal', function () {
                modal.remove();
            });

            $('.add-to-favorites').on('click', function() {
                const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                if (!favorites.includes(productId)) {
                    favorites.push({ id: productId, name: productName });
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    alert('Товар добавлен в избранное!');
                } else {
                    alert('Товар уже в избранном!');
                }
            });
        }
    });

    // Buy now button logic
    $('.buy-now-btn').on('click', function(e) {
        e.preventDefault();
        const productName = $(this).closest('.product-card').find('.card-title').text();
        const productPrice = $(this).closest('.product-card').find('.card-price').text();

        const modal = $(`
            <div class="modal fade" id="orderModal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Оформить заказ</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
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

$.getJSON('products.json', function(products) {
    const productList = $('#product-list');
    products.forEach(product => {
        productList.append(`
            <div class="col-12 col-md-6 col-lg-4 product-card" data-category="${product.category}" data-brand="${product.brand}" data-extended-description="${product.extendedDescription}" data-id="${product.id}">
                <div class="card-image" style="background-image: url('${product.image}');"></div>
                <h3 class="card-title">${product.title}</h3>
                <p class="card-description">${product.description}</p>
                <p class="card-price">${product.price}</p>
                <a href="#" class="buy-now-btn">Купить сейчас</a>
            </div>
        `);
    });
    updatePagination(); 
});
    updatePagination();
});