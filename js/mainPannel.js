function isSubmit() {
    var aa = new Array();
    var JsonData = {"userName": getCookie("userName"), "password": getCookie("password"),};
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/FinancialFrontSelectServlet",
        data: {"strFinancialFrontSelect": JSON.stringify(JsonData)},
        async: false,
        error: function (request) {
            alert("获取状态失败，请稍后")
        },
        success: function (data) {
            var objs = eval(data);
            for (var j = 0; j < objs.length; j++) {
                aa[1] = objs[j].isSubmit
            }
            if (data == "405") {
                window.location.href = "finance.html"
            } else {
                window.location.href = "hexagram.html"
            }
        }
    });
    return false
};