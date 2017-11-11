function check() {
}
function postClinetOrder(D, B, C) {
    let data = {
        "userName": getCookie("userName"),
        "clientType": D.clientType,
        "cilentName": D.cilentName,
        "clientCellNumber": D.clientCellNumber,
        "idCardNumber": D.idCardNumber,
        "clientSource": D.clientSource,
        "startDay": getCookie("Date"),
        "stayDays": D.stayDays,
        "truePayment": D.truePayment,
        "paymentWays": D.priceFrom,
        "roomNumber": getCookie("roomNumber"),
        "roomId":D.roomId,
        "note": D.note

    };

/*    let data = {
        "userName": getCookie("userName"),
        "hasStayDate": dateToString(new Date()),
    };*/
    ajaxHttp("POST", getUrl(2) + "/roomStatus/addReservation", data, function(C) {
        alert("获取状态失败，请稍后")
    }, function(data) {
        console.log(data);
       /* if (E == "200") {
            alert("入住成功！");
            closethis()
        } else {
            alert("房间冲突，请重新选择！")
        }*/

    });

    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl(2) + "/roomStatus/addReservation",
        data: {"strEditSetup": JSON.stringify(A)},
        async: false,
        error: function (E) {
            alert("获取状态失败，请稍后")
        },
        success: function (E) {
            if (E == "200") {
                alert("入住成功！");
                closethis()
            } else {
                alert("房间冲突，请重新选择！")
            }
        }
    });
    return false
};