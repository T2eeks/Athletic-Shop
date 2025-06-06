$(document).ready(function() {
    const cardsPerPage = 6;
    let currentPage = 1;
    let currentCategory = '';
    let allProducts = [];

    function updatePagination() {
        // Фильтруем продукты по текущей категории
        let filteredProducts = currentCategory 
            ? allProducts.filter(p => p.category === currentCategory) 
            : allProducts;

        const totalPages = Math.ceil(filteredProducts.length / cardsPerPage);

        // Корректируем текущую страницу, если она выходит за пределы
        if (totalPages > 0 && currentPage > totalPages) {
            currentPage = totalPages;
        } else if (totalPages === 0) {
            currentPage = 1;
        }

        // Скрываем все карточки
        $('.product-card').hide();

        // Показываем только карточки для текущей страницы
        const startIndex = (currentPage - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);

        // Показываем соответствующие карточки
        productsToShow.forEach(product => {
            $(`.product-card[data-id="${product.id}"]`).show();
        });

        // Обновляем пагинацию
        $('#pagination').empty();
        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                $('#pagination').append(`<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`);
            }
        } else if (filteredProducts.length === 0) {
            $('#pagination').html('<p>Товары не найдены</p>');
        }

        // Плавный скролл вверх
        $('html, body').animate({ scrollTop: 0 }, 500);
    }

    $('.dropdown-item').on('click', function(e) {
        e.preventDefault();
        currentCategory = $(this).data('category');
        $('.category-filter-btn').text($(this).text());
        currentPage = 1;
        updatePagination();
    });

    $(document).on('click', '.page-btn', function(e) {
        e.preventDefault();
        const newPage = parseInt($(this).data('page'));
        if (newPage !== currentPage) {
            currentPage = newPage;
            updatePagination();
        }
    });

    // Остальной код (модальное окно и добавление в корзину) остается без изменений
    $(document).on('click', '.product-card', function(e) {
        if (!$(e.target).hasClass('buy-now-btn')) {
            e.preventDefault();
            const productId = $(this).data('id');
            const product = allProducts.find(p => p.id === productId);
            
            if (!product) return;

            const modal = $(`
                <div class="modal fade" id="productDetailModal" tabindex="-1" role="dialog" aria-labelledby="productModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="productModalLabel">${product.title}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <img src="${product.image}" alt="${product.title}" class="img-fluid product-detail-image">
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong>Бренд:</strong> ${product.brand}</p>
                                        <p><strong>Цена:</strong> ${product.price}</p>
                                        <p><strong>Описание:</strong> ${product['extended-description'] || product.description || 'Описание отсутствует'}</p>
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
                const priceValue = parseFloat(product.price.replace('₸', '').replace(/\./g, '').replace(',', '.'));
                addToCart({ 
                    id: product.id,
                    name: product.title, 
                    price: priceValue,
                    image: product.image
                });
                showNotification('Товар добавлен в корзину!');
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
        const productId = $(this).closest('.product-card').data('id');
        const product = allProducts.find(p => p.id === productId);
        
        if (!product) return;
        
        const priceValue = parseFloat(product.price.replace('₸', '').replace(/\./g, '').replace(',', '.'));
        addToCart({ 
            id: product.id,
            name: product.title, 
            price: priceValue,
            image: product.image
        });
        showNotification('Товар добавлен в корзину!');
        updateCartCount();
    });

    $.getJSON('./products.json', function(products) {
        allProducts = products;
        const productList = $('#product-list');
        
        // Очищаем список перед добавлением
        productList.empty();
        
        products.forEach(product => {
            if (!product['extended-description']) {
                product['extended-description'] = 'Описание отсутствует';
            }
            productList.append(`
                <div class="col-12 col-md-6 col-lg-4 product-card" data-category="${product.category}" data-brand="${product.brand}" data-extended-description="${product['extended-description'].replace(/"/g, '&quot;')}" data-id="${product.id}">
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
});