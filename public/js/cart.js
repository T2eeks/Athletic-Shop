$(document).ready(function() {
    // Инициализация корзины (делаем cart глобальным)
    window.cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Функция для показа уведомления
    function showNotification(message) {
        $('#notification-message').text(message);
        $('#notification').addClass('show');
        setTimeout(() => {
            $('#notification').removeClass('show');
        }, 3000); // Уведомление исчезает через 3 секунды
    }

    // Функция добавления в корзину
    window.addToCart = function(product) {
        const existingProduct = cart.find(item => item.name === product.name);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
        showNotification('Товар добавлен в корзину!'); // Заменяем alert
    };

    // Функция обновления отображения корзины
    function updateCartDisplay() {
        const cartItems = $('#cart-items');
        cartItems.empty();
        let totalPrice = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            cartItems.append(`
                <div class="cart-item">
                    <p>${item.name} (x${item.quantity})</p>
                    <p>${itemTotal.toLocaleString()} ₸</p>
                </div>
            `);
        });

        $('#cart-total-price').text(`${totalPrice.toLocaleString()} ₸`);
        $('#checkout-btn').prop('disabled', cart.length === 0);
    }

    // Функция обновления количества товаров в корзине
    window.updateCartCount = function() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        $('.cart-count').text(totalItems > 0 ? ` (${totalItems})` : '');
    };

    // Открытие корзины
    $('#open-cart').on('click', function(e) {
        e.preventDefault();
        $('#cart-sidebar').addClass('open');
        $('#cart-overlay').addClass('open');
        updateCartDisplay();
    });

    // Закрытие корзины
    $('#close-cart, #cart-overlay').on('click', function() {
        $('#cart-sidebar').removeClass('open');
        $('#cart-overlay').removeClass('open');
    });

    // Показать опции мессенджеров
    $('#checkout-btn').on('click', function() {
        $('#messenger-options').toggle();
    });

    // Оформление заказа
    $('.messenger-link').on('click', function(e) {
        e.preventDefault();
        const messenger = $(this).hasClass('whatsapp') ? 'whatsapp' : 'telegram';
        let message = 'Здравствуйте, хочу заказать:\n';
        let totalPrice = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            message += `- ${item.name} (x${item.quantity}) - ${itemTotal.toLocaleString()} ₸\n`;
        });

        message += `\nИтоговая сумма: ${totalPrice.toLocaleString()} ₸`;

        let url;
        if (messenger === 'whatsapp') {
            url = `https://wa.me/xxxxxxxxxx?text=${encodeURIComponent(message)}`;
        } else {
            url = `https://t.me/athletic_8?text=${encodeURIComponent(message)}`;
        }

        window.open(url, '_blank');
        $('#cart-sidebar').removeClass('open');
        $('#cart-overlay').removeClass('open');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
    });

    // Инициализация при загрузке
    updateCartCount();
});