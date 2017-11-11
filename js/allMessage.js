function getMes() {
    var JsonData = {"userName": getCookie("userName"), "password": getCookie("password"),};
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/RoomSelectServlet",
        data: {"strSelectRoom": JSON.stringify(JsonData)},
        async: false,
        error: function (request) {
            alert("获取状态失败，请稍后")
        },
        success: function (data) {
            var objs = eval(data);
            for (var j = 0; j < objs.length; j++) {
                var aa = new Array();
                aa[0] = objs[j].roomType;
                aa[1] = objs[j].roomName;
                aa[2] = objs[j].roomNumber;
                aa[3] = objs[j].roomInitalPrice;
                aa[4] = objs[j].roomSpecialDatePrice;
                setData(aa)
            }
        }
    });
    return false
}
function setData(A) {
    setTable(1, A)
}
function setTable(F, A) {
    var C = document.getElementById("table");
    var D;
    var E;
    for (var B = 0; B < F; B++) {
        D = document.createElement("tr");
        document.getElementById("table").appendChild(D);
        for (var G = 0; G < A.length; G++) {
            E = document.createElement("td");
            E.innerText = A[G];
            D.appendChild(E)
        }
        D.appendChild(E)
    }
};