var SERVER_ADD_PORT = "http://47.94.108.64:3000";

function setCookie(B, C, D) {
    var A = new Date();
    A.setDate(A.getDate() + D);
    document.cookie = B + "=" + escape(C) + ((D == null) ? "" : ";expires=" + A.toGMTString())
}

function getCookie(A) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(A + "=");
        if (c_start != -1) {
            c_start = c_start + A.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length
            }
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

function delCookie(B) {
    var A = new Date();
    A.setTime(A.getTime() - 1);
    var C = getCookie(B);
    if (C != null) {
        document.cookie = B + "=" + C + ";expires=" + A.toGMTString()
    }
}

function loginCheckCookieLogin() {
    if (getCookie("userName") == "") {
        return false
    }
    var A = {"userName": getCookie("userName"), "password": getCookie("password"),};
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/UserLoginServlet",
        data: {"strUserLogin": JSON.stringify(A)},
        async: false,
        error: function(B) {
            delCookie("userName");
            delCookie("password");
            window.location.href = "./login.html"
        },
        success: function(B) {
            if (B == "405") {
                delCookie("userName");
                delCookie("password");
                window.location.href = "./login.html";
                return false
            }
            if (B == "200") {
                window.location.href = "./mainPannel.html";
                return false
            }
        }
    });
    return false
}

function pannelCheckCookieLogin() {
    if (getCookie("userName") == "") {
        window.location.href = "./login.html";
        return false
    }
    var A = {"userName": getCookie("userName"), "password": getCookie("password"),};
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/UserLoginServlet",
        data: {"strUserLogin": JSON.stringify(A)},
        async: false,
        error: function(B) {
            delCookie("userName");
            delCookie("password");
            window.location.href = "./login.html"
        },
        success: function(B) {
            if ("405" == B) {
                delCookie("userName");
                delCookie("password");
                window.location.href = "./login.html";
                return false
            }
            if (B == "200") {
                return false
            }
        }
    });
    return false
}

function logout() {
    delCookie("userName");
    delCookie("password");
    window.location.href = "./login.html"
}

function getUrl() {
    return "http://196.168.0.117:8080"
};