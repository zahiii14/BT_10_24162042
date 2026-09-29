$(document).ready(function() {

    function showAlert(message, type) {
        var alertBox = $('#alertBox');
        if (alertBox.length) {
            alertBox.removeClass('d-none alert-success alert-danger alert-warning')
                    .addClass('alert-' + type)
                    .html(message);
        }
    }

    // Trang Profile: Tải thông tin người dùng từ REST API /users/me
    if ($('#profile').length) {
        if (localStorage.token) {
            $('#tokenDisplay').text(localStorage.token);
        } else {
            $('#tokenDisplay').html('<span class="text-danger">Chưa có JWT Token! Vui lòng đăng nhập.</span>');
        }

        $.ajax({
            type: 'GET',
            url: '/users/me',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            beforeSend: function(xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                }
            },
            success: function(data) {
                $('#profile').text(data.fullName);
                $('#userEmail').text(data.email);
                $('#userId').text(data.id);

                if (data.images) {
                    $('#images').attr('src', data.images).removeClass('d-none');
                    $('#avatarPlaceholder').addClass('d-none');
                }
            },
            error: function(e) {
                var errorMsg = "Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.";
                if (e.responseJSON && e.responseJSON.description) {
                    errorMsg = e.responseJSON.description;
                }
                $('#feedback').removeClass('d-none').text(errorMsg);
                $('#profile').text('Chưa Xác Thực');
            }
        });
    }

    // Hàm Đăng Nhập (Login)
    $('#Login').click(function() {
        var email = $('#email').val().trim();
        var password = $('#password').val().trim();

        if (!email || !password) {
            showAlert('Vui lòng nhập đầy đủ Email và Mật khẩu!', 'warning');
            return;
        }

        var basicInfo = JSON.stringify({
            email: email,
            password: password
        });

        $.ajax({
            type: "POST",
            url: "/auth/login",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: basicInfo,
            success: function(data) {
                localStorage.token = data.token;
                showAlert('Đăng nhập thành công! Đang chuyển hướng...', 'success');
                setTimeout(function() {
                    window.location.href = "/user/profile";
                }, 700);
            },
            error: function(xhr) {
                var errDetail = "Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu!";
                if (xhr.responseJSON && xhr.responseJSON.description) {
                    errDetail = xhr.responseJSON.description;
                }
                showAlert(errDetail, 'danger');
            }
        });
    });

    // Hàm Đăng Ký (Register)
    $('#Register').click(function() {
        var fullName = $('#regFullName').val().trim();
        var email = $('#regEmail').val().trim();
        var password = $('#regPassword').val().trim();

        if (!fullName || !email || !password) {
            showAlert('Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu!', 'warning');
            return;
        }

        var regData = JSON.stringify({
            fullName: fullName,
            email: email,
            password: password
        });

        $.ajax({
            type: "POST",
            url: "/auth/signup",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: regData,
            success: function(data) {
                showAlert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.', 'success');
                $('#email').val(email);
                $('#password').val(password);
                // Switch to login tab
                $('#login-tab').tab('show');
            },
            error: function(xhr) {
                var errDetail = "Đăng ký thất bại. Email có thể đã tồn tại!";
                if (xhr.responseJSON && xhr.responseJSON.description) {
                    errDetail = xhr.responseJSON.description;
                }
                showAlert(errDetail, 'danger');
            }
        });
    });

    // Hàm Đăng xuất (Logout)
    $('#logout').click(function() {
        localStorage.clear();
        window.location.href = "/login";
    });
});
