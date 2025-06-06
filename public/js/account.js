$(document).ready(function() {
    $('#account-link').on('click', function(e) {
        e.preventDefault();
        $('#accountModal').modal('show');
    });

    // Заглушка для отправки форм (для бэкендера)
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        console.log('Login attempt:', {
            email: $('#login-email').val(),
            password: $('#login-password').val()
        });
        // Здесь бэкендер добавит AJAX-запрос к API, например, POST /api/login
        showNotification('Вход выполнен (заглушка для фронта)');
        $('#accountModal').modal('hide');
    });

    $('#register-form').on('submit', function(e) {
        e.preventDefault();
        console.log('Register attempt:', {
            name: $('#register-name').val(),
            email: $('#register-email').val(),
            password: $('#register-password').val()
        });
        // Здесь бэкендер добавит AJAX-запрос к API, например, POST /api/register
        showNotification('Регистрация выполнена (заглушка для фронта)');
        $('#accountModal').modal('hide');
    });
});