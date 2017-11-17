/**
 * @Created with fly.
 * @User: z1163764648.com
 * @Date: 2017/11/14
 * @Time: 18:47
 */

layui.use(['laydate', 'form', 'layedit', 'jquery'], function() {
    let laydate = layui.laydate
        , form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit;
});

function DeterminedApply() {
    let userId = getCookie("userName");
    let appliedAmount = $('#appliedAmount').val();
    let memberbasicTitle = $('#memberbasicTitle').is(':checked');
    let ViewServiceProtocol = $('#ViewServiceProtocol').is(':checked');
    let loanAgreement = $('#loanAgreement').is(':checked');
    if (appliedAmount && memberbasicTitle && ViewServiceProtocol && loanAgreement) {
        let appliedAmountMaxArr = '';
        let appliedAmountMax = $('#appliedAmountMax');
        let appliedAmountMaxVal = appliedAmountMax.val();
        let appliedAmount = $('#appliedAmount').val();
        appliedAmountMaxArr = appliedAmountMaxVal.split(',');
        let appliedAmountMaxNumber = appliedAmountMaxArr[0] + appliedAmountMaxArr[1];
        let appliedOut = parseInt(appliedAmountMaxNumber) - parseInt(appliedAmount);
        appliedAmountMax.val(appliedOut);
        let Data = {
            userId: userId,
            applyAmt: appliedAmount,
        };
        $.post(url + "/submitApplyAmt", Data, function(data, err) {
            appliedAmountMax.val(data.balance);
            alert('申请成功，请注意查收信息')
        });

    } else {
        alert('请勾选以上协议')
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
        $.post(url + "/getSixAwnStarData", {userId: userId}, function(data, err) {
            let identicalPlate = data.identicalPlate;  // 身份
            let rentPlate = data.rentPlate;             // 承租
            let salesPlate = data.salesPlate;           // 销售
            let scalePlate = data.scalePlate;              // 规模
            let creditHistoryPlate = data.creditHistoryPlate;   // 信用历史
            let relationshipPlate = data.relationshipPlate;     // 人脉
            readerChart(
                identicalPlate>100?100:identicalPlate,
                rentPlate>100?100:rentPlate,
                salesPlate>100?100:salesPlate,
                scalePlate>100?100:scalePlate,
                creditHistoryPlate>100?100:creditHistoryPlate,
                relationshipPlate>100?100:relationshipPlate);
            $('#fintcredit').val(identicalPlate + rentPlate + salesPlate + scalePlate + creditHistoryPlate + relationshipPlate)
        });
    };
    window.onWithdraw = function() {

        $.post(url + "/getMerchantInfoByUserId", {userId: userId}, function(data, err) {
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
        let appliedAmount = $('#appliedAmount').val();
        $('#module').css({'display': 'block'});
        $('.shadow').show();
        $('#moduleIframe').attr({'src': './BrokerageContract.html'})
    };

    window.loanAgreement = function() {
        let appliedAmount = $('#appliedAmount').val();
        $('#module').css({'display': 'block'});
        $('.shadow').show();
        $('#moduleIframe').attr({'src': './loanAgreement.html'})
    };


    window.clickUrl = function() {
        $('#clickUrl').click();
    };


    function readerChart(F, D, E, H, A, G) {
        let C = echarts.init(document.getElementById("main"));
        let B = {
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