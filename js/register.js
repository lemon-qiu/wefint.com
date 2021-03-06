function memberRegister(F) {
    var E = JSON.parse(F);
    if (E.loginAccountPassword != E.loginAccountPassword2) {
        return "400"
    }
    var A = new Base64();
    var D = A.encode(E.loginAccountNumber);
    var C = A.encode(E.loginAccountPassword);
    var B = {
        "loginAccountNumber": D,
        "loginAccountPassword": C,
        "loginHotelName": E.loginHotelName,
        "loginLocation": E.loginLocation,
        "loginPhoneNumber": E.loginPhoneNumber
    };
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/Hotel/LoginServlet",
        data: {"register": JSON.stringify(B)},
        async: false,
        error: function (G) {
            alert("注册失败，请稍后再试")
        },
        success: function (G) {
            if (G == "800") {
                alert("用户名重复请更换！")
            }
            if (G == "200") {
                alert("注册成功请登陆");
                window.location.href = "./login.html"
            }
            return false
        }
    });
    return false
}

var code;

function createCode() {
    code = "";
    var E = 4;
    var A = document.getElementById("code");
    var C = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");
    for (var B = 0; B < E; B++) {
        var D = Math.floor(Math.random() * 36);
        code += C[D]
    }
    document.getElementById("code").value = code
}

function validate() {
    var A = document.getElementById("checkcode").value.toUpperCase();
    if (A.length <= 0) {
        return false
    } else {
        if (A != code) {
            alert("验证码错误!");
            createCode();
            document.getElementById("checkcode").value = "";
            return false
        }
    }
    return true
};