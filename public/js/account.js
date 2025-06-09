$(document).ready(function() {
    $('#account-link').on('click', function(e) {
        e.preventDefault();
        $('#accountModal').modal('show');
    });

    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        console.log('Login attempt:', {
            email: $('#login-email').val(),
            password: $('#login-password').val()
        });
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
        // Здесь бэк можете добавить, возможно AJAX-запрос к API, например, POST /api/register
        showNotification('Регистрация выполнена');
        $('#accountModal').modal('hide');
    });
});