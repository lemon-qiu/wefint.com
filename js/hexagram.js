function  DeterminedApply() {
    let appliedAmount = $('#appliedAmount').val();
    let memberbasicTitle = $('#memberbasicTitle').is(':checked')
    let ViewServiceProtocol = $('#ViewServiceProtocol').is(':checked')
    if(appliedAmount&&memberbasicTitle&&ViewServiceProtocol){
        console.log(memberbasicTitle,ViewServiceProtocol)
    }else{
        console.log('请勾选以上协议')
    }

}

(function() {
    let userId = getCookie("userName");
    window.onload = function() {
        $('#user_name').val(GetQueryString('userName'));
        $('#id_card').val(GetQueryString('certNo'));
        $('#phone_number').val(GetQueryString('mobile'));
        $('#relativeMobile').val(GetQueryString('motelName'));
        $('#friendMobile').val(GetQueryString('friendMobile'));
        $('#monthIncome').val(GetQueryString('averageCommision'));
        $('#withdraw').hide();  //申请客栈贷隐藏
        $.post(url+"/getSixAwnStarData", {userId: userId}, function(data, err) {
            let identicalPlate = data.identicalPlate;  // 身份
            let rentPlate = data.rentPlate;             // 承租
            let salesPlate = data.salesPlate;           // 销售
            let scalePlate = data.scalePlate;              // 规模
            let creditHistoryPlate = data.creditHistoryPlate;   // 信用历史
            let relationshipPlate = data.relationshipPlate;     // 人脉
            readerChart(identicalPlate, rentPlate, salesPlate, scalePlate, creditHistoryPlate, relationshipPlate);
            $('#fintcredit').val(identicalPlate+rentPlate+salesPlate+scalePlate+creditHistoryPlate+relationshipPlate)
        });
    };
    window.onWithdraw = function() {
        $.post(url+"/getMerchantInfoByUserId", {userId: userId}, function(data, err) {
            if (data.approveStatus < 4) {
                $('#remarkInfo').html('<span>备注：</span> <span style="color:red"> 对不起，您所提交的信息还在审核中，请您耐心等待。</span>')
            } else {
                $('#withdraw').show();
                $('#remarkInfo').hide();
            }
        })

    };
    window.memberbasicTitle = function() {
        let appliedAmount = $('#appliedAmount').val();
        $('#module').css({'display': 'block'});
        $('.shadow').show();
        $('#moduleIframe').attr({'src': './applayForFinance.html?userId=' + userId + '&' + 'appliedAmount=' + appliedAmount})
    };

    window.ViewServiceProtocol = function() {
        $('#module').css({'display': 'block'});
        $('.shadow').show();
        $('#moduleIframe').attr({'src': './BrokerageContract.html?userId=' + userId + '&' + 'appliedAmount=' + appliedAmount})
    };



    // function postPage() {
    //     getData(0);
    //     var A = document.getElementById("upload0");
    //     A.addEventListener("click", function() {
    //         uploadFile(0)
    //     }, false);
    //     var C = document.getElementById("upload1");
    //     C.addEventListener("click", function() {
    //         uploadFile(1)
    //     }, false);
    //     var B = document.getElementById("upload2");
    //     var B = document.getElementById("upload2");
    //     B.addEventListener("click", function() {
    //         uploadFile(2)
    //     }, false);
    //     $.ajax({
    //         cache: true,
    //         type: "POST",
    //         url: SERVER_ADD_PORT + "/finance/checkPage02",
    //         data: {"userName": getCookie("userName"), "password": getCookie("password"),},
    //         async: false,
    //         error: function(D) {
    //             alert("获取状态失败，请稍后")
    //         },
    //         success: function(E) {
    //             var D = JSON.parse(E);
    //             if (D.code == "600") {
    //                 getData(1);
    //                 document.getElementById("Content-Main").innerHTML = "已经提交请耐心等候～～"
    //             }
    //         }
    //     })
    // }
    //
    // function uploadFile(A) {
    //     var B = new FormData();
    //     switch (A) {
    //         case 0:
    //             var C = document.getElementById("PERSONALCREDIT");
    //             if (C.files[0] == undefined) {
    //                 alert("请选择文件");
    //                 return false
    //             }
    //             B.append("file", C.files[0]);
    //             B.append("fileType", "1");
    //             B.append("fileClass", "PERSONALCREDIT");
    //             break;
    //         case 1:
    //             var C = document.getElementById("HOUSEPROPERTY");
    //             if (C.files[0] == undefined) {
    //                 alert("请选择文件");
    //                 return false
    //             }
    //             B.append("file", C.files[0]);
    //             B.append("fileType", "1");
    //             B.append("fileClass", "HOUSEPROPERTY");
    //             break;
    //         case 2:
    //             var C = document.getElementById("ENTERPRISELICENSING");
    //             if (C.files[0] == undefined) {
    //                 alert("请选择文件");
    //                 return false
    //             }
    //             B.append("file", C.files[0]);
    //             B.append("fileType", "1");
    //             B.append("fileClass", "ENTERPRISELICENSING");
    //             break;
    //         default:
    //             break
    //     }
    //     B.append("userName", getCookie("userName"));
    //     B.append("password", getCookie("password"));
    //     $.ajax({
    //         url: SERVER_ADD_PORT + "/fileUpLoad/fileUpLoad",
    //         type: "POST",
    //         data: B,
    //         cache: false,
    //         contentType: false,
    //         processData: false,
    //         success: function(E) {
    //             var D = JSON.parse(E);
    //             if ("200" == D.code) {
    //                 switch (A) {
    //                     case 0:
    //                         $("#result0").html("上传成功！");
    //                         $("#img0").attr("src", D.msg);
    //                         break;
    //                     case 1:
    //                         $("#result1").html("上传成功！");
    //                         $("#img1").attr("src", D.msg);
    //                         break;
    //                     case 2:
    //                         $("#result2").html("上传成功！");
    //                         $("#img2").attr("src", D.msg);
    //                         break;
    //                     default:
    //                         break
    //                 }
    //             } else {
    //                 switch (A) {
    //                     case 0:
    //                         $("#result0").html("上传成功！");
    //                         break;
    //                     case 1:
    //                         $("#result1").html("上传成功！");
    //                         break;
    //                     case 2:
    //                         $("#result2").html("上传成功！");
    //                         break;
    //                     default:
    //                         break
    //                 }
    //             }
    //             console.log("imgUploader upload success")
    //         },
    //         error: function() {
    //             $("#result").html("与服务器通信发生错误")
    //         }
    //     })
    // }
    //
    // function submitFinanceData(A) {
    //     if (false) {
    //         alert("图片需要先预览，以确定您上传的文件正确！")
    //     }
    //     $.ajax({
    //         cache: true,
    //         type: "POST",
    //         url: SERVER_ADD_PORT + "/finance/page02",
    //         data: {
    //             "userName": getCookie("userName"),
    //             "password": getCookie("password"),
    //             "email": A.email,
    //             "car": A.car,
    //             "companyCredit": A.companyCredit,
    //             "education": A.education,
    //             "profession": A.profession,
    //             "zhimaCredit": A.zhimaCredit,
    //             "note": A.note,
    //         },
    //         async: false,
    //         error: function(B) {
    //             alert("获取状态失败，请稍后")
    //         },
    //         success: function(C) {
    //             var B = JSON.parse(C);
    //             if (B.code == "200") {
    //                 getData(1);
    //                 document.getElementById("Content-Main").innerHTML = "已经提交请耐心等候～～"
    //             }
    //         }
    //     });
    //     return false
    // }
    //
    // function getData(A) {
    //     switch (A) {
    //         case 0:
    //             readerChart(1, 1, 1, 1, 1, 1);
    //             break;
    //         case 1:
    //             readerChart(30, 30, 30, 30, 30, 30);
    //             break;
    //         default:
    //             break
    //     }
    // }

    function readerChart(F, D, E, H, A, G) {
        var C = echarts.init(document.getElementById("main"));
        var B = {
            title: {text: ""},
            tooltip: {},
            legend: {data: [""]},
            radar: [{}, {
                indicator: [{text: "身份", max: 100}, {text: "承租", max: 100}, {text: "销量", max: 100}, {text: "规模", max: 100}, {
                    text: "信用历史",
                    max: 100
                }, {text: "人脉", max: 100}], center: ["45%", "40%"], radius: 120
            }],

            series: [{
                name: "信用评分",
                type: "radar",
                radarIndex: 1,
                data: [{
                    value: [F, D, E, H, A, G],
                    name: "客栈",
                    areaStyle: {
                        normal: {
                            opacity: 0.9,
                            color: new echarts.graphic.RadialGradient(1, 2, 1, [{color: "#1580c4", offset: 0}, {color: "#277eb5", offset: 1}])
                        }
                    }
                }]
            }]
        };
        C.setOption(B)
    }

    function GetQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = decodeURI(window.location.search).substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
})();