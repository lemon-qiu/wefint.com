//function submitInfo1(data) {
alert(data + "get here");
var obj0 = JSON.parse(data);
alert("ok");
alert(obj0.loginPhoneNumber);
// var base = new Base64();
// var encodeStr = base.encode(obj0.loginAccountNumber);
// var encodeStr1 = base.encode(obj0.loginAccountPassword);
alert("data" + getCookie('loginHotelName'));
var user = {
    "loginHotelName": getCookie('loginHotelName'),
    "loginID": getCookie('loginID'),
    "loginPhoneNumber": obj0.loginPhoneNumber
        // "loginHotelName": obj0.loginHotelName
}

alert("d" + JSON.stringify(user));
$.ajax({
    cache: true,
    type: "POST",
    url: "http://admin.wefint.com:8080/Hotel/LoginServlet",
    data: {
        "register": JSON.stringify(user)
    },
    async: false,
    error: function(request) {
        alert("faild");
    },
    success: function(data) {
        // var obj = JSON.parse(data);
        alert(data);
        // var objs = eval(data);

        // for (var j = 0; j < objs.length; j++) {
        //     alert(objs[j].loginAccountNumber);
        //     alert(objs[j].loginID);
        //     alert(objs[j].loginHotelName);
        //     alert(objs[j].loginGrade);
        //     setCookie('loginAccountNumber', objs[j].loginAccountNumber, 'loginID', objs[j].loginID, 'loginHotelName', objs[j].loginHotelName, 'loginGrade', objs[j].loginGrade, 7)
        //     if (objs[j].loginID != null) {
        //         window.location.href = "./mainPannel.html";
        //     } else {
        //         alert("账号或密码错误");
        //     }
        // }
    }
});
return false;


}

// "loginAccountNumber": obj0.loginAccountNumber,
//         "loginAccountPassword": obj0.loginAccountPassword,
//         "loginHotelName": obj0.loginHotelName,
//         "loginPhoneNumber": obj0.loginPhoneNumber