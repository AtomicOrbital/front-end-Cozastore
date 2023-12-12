// Khi nội dung file html đã được hiển thị trên browser thì sẽ kích hoạt
$(document).ready(function () {

    // Đăng ký sự kiện click cho thẻ tag được chỉ định bên HTML
    $("#btn-sign-in").click(function () {
        // .val() : Lấy giá trị của thẻ input được chỉ định
        var username = $("#user").val()
        var password = $("#pass").val()

        // Xuất giá trị ra trên tab console trên trình duyệt
        console.log("username : ", username, " password : ", password);

        //ajax : Dùng để call ngầm API mà không cần trình duyệt
        //axios, fetch
        //data : chỉ có khi tham số truyền ngầm
        $.ajax({
            url: "http://localhost:8080/user/signin",
            method: "post",
            data: {
                username: username,
                password: password
            }
        }).done(function (result) {
            if (result) {
                let token = result.data.token;
                localStorage.setItem("token", token);
            }
            console.log("server tra ve ", result)
        })
    })

    $('#btn-sign-up').click(function () {
        let usernameSignUp = $('#user-sign-up').val();
        let passwordSignUp = $('#pass-sign-up').val();
        let passwordConfirm = $('#pass-confirm').val();

        if (usernameSignUp.trim() === "") {
            alert("Username cannot be empty");
            return;
        }

        if (usernameSignUp.length < 4) {
            alert("Username must be 4 characters long");
        }

        if (passwordSignUp.trim() === "") {
            alert("Password cannot be empty");
            return;
        }
        let passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!passwordPattern.test(passwordSignUp)) {
            alert("Password must be at least 8 characters long, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character");
            return;
        }

        if (passwordSignUp !== passwordConfirm) {
            alert("Mat khau va xac nhan mat khau khong giong nhau");
            return;
        }

        console.log("Username SignUp:", usernameSignUp, "Password SignUp:", passwordSignUp);

        $.ajax({
            url: "http://localhost:8080/user/signup",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                username: usernameSignUp,
                password: passwordSignUp
            })
        }).done(function (result) {
            if (result && result.data) {
                alert(result.message || "Sign up sucessfully");
            } else {
                alert(result.message || "Sign up failed");
            }
        }).fail(function (textStatus) {
            alert("Co loi : " + textStatus);
        })
    })

})