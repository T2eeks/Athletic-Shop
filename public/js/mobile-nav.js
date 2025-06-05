$(document).ready(function() {
    // Открытие бургера
    $('#open-mobile-menu').on('click', function(e) {
        e.preventDefault();
        $('#mobile-menu-sidebar').addClass('active');
        $('#mobile-menu-overlay').addClass('active');
        // Преобразование в крестик
        $(this).addClass('open');
    });

    // Закрытие меню
    $('#close-mobile-menu, #mobile-menu-overlay').on('click', function() {
        $('#mobile-menu-sidebar').removeClass('active');
        $('#mobile-menu-overlay').removeClass('active');
        // Обратно в бургер
        $('#open-mobile-menu').removeClass('open');
    });
});