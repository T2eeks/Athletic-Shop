$(document).ready(function() {
    $('#open-mobile-menu').on('click', function(e) {
        e.preventDefault();
        $('#mobile-menu-sidebar').addClass('active');
        $('#mobile-menu-overlay').addClass('active');

        $(this).addClass('open');
    });

    $('#close-mobile-menu, #mobile-menu-overlay').on('click', function() {
        $('#mobile-menu-sidebar').removeClass('active');
        $('#mobile-menu-overlay').removeClass('active');
        $('#open-mobile-menu').removeClass('open');
    });
});