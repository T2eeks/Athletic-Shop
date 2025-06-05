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

    $(document).on('click', '.product-card', function(e) {
        if (!$(e.target).hasClass('buy-now-btn')) {
            e.preventDefault();
            const productName = $(this).find('.card-title').text();
            const productImage = $(this).find('.card-image').css('background-image').slice(4, -1).replace(/"/g, '');
            const productPrice = $(this).find('.card-price').text();
            const extendedDescription = $(this).attr('data-extended-description');
            const productDescription = extendedDescription || $(this).find('.card-description').text() || 'Описание отсутствует';
            const productBrand = $(this).data('brand') || 'Не указан';
            const productId = $(this).data('id') || Math.random().toString(36).substr(2, 9);
            const productCategory = $(this).data('category');

            const modal = $(`
                <div class="modal fade" id="productDetailModal" tabindex="-1" role="dialog" aria-labelledby="productModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="productModalLabel">${productName}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
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

            $('#productDetailModal .buy-now-btn').on('click', function(e) {
                e.preventDefault();
                const priceValue = parseFloat(productPrice.replace('₸', '').replace('.', ''));
                addToCart({ name: productName, price: priceValue });
                showNotification('Товар добавлен в корзину!'); // Заменяем alert
                updateCartCount();
                $('#productDetailModal').modal('hide');
            });

            $('#productDetailModal').on('hidden.bs.modal', function () {
                modal.remove();
                $('body').removeAttr('aria-hidden');
                $('.modal-backdrop').remove();
            });
        }
    });

    $(document).on('click', '.buy-now-btn', function(e) {
        e.preventDefault();
        const productName = $(this).closest('.product-card').find('.card-title').text();
        const productPrice = parseFloat($(this).closest('.product-card').find('.card-price').text().replace('₸', '').replace('.', ''));
        addToCart({ name: productName, price: productPrice });
        showNotification('Товар добавлен в корзину!'); // Заменяем alert
        updateCartCount();
    });

    $.getJSON('./products.json', function(products) {
        const productList = $('#product-list');
        products.forEach(product => {
            if (!product['extended-description']) {
                product['extended-description'] = 'Описание отсутствует';
            }
            productList.append(`
                <div class="col-12 col-md-6 col-lg-4 product-card" data-category="${product.category}" data-brand="${product.brand}" data-extended-description="${product['extended-description'].replace(/"/g, '"')}" data-id="${product.id}">
                    <div class="card-image" style="background-image: url('${product.image}');"></div>
                    <h3 class="card-title">${product.title}</h3>
                    <p class="card-description">${product.description}</p>
                    <p class="card-price">${product.price}</p>
                    <a href="#" class="buy-now-btn">Купить сейчас</a>
                </div>
            `);
        });
        updatePagination();
    }).fail(function(jqxhr, textStatus, error) {
        console.error('Error loading products.json:', textStatus, error);
    });

    updatePagination();
});