$(document).ready(function() {
    // Инициализация SlickNav
    $('#nav-menu').slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true,
        label: '', // Убираем текст "Menu" на кнопке
        duration: 300, // Длительность анимации
        easingOpen: 'swing', // Тип анимации
        easingClose: 'swing'
    });
});