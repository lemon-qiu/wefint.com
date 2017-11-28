/**
 * 获取页面数据
 * */
let IntermediaryAgreement = '';
window.onload = function(e) {
    function GetQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = decodeURI(e.path[0].location.search).substr(1).match(reg);
        if (r !== null) return unescape(r[2]);
    }
    let userId = getCookie('userName');
    let applyAmt = GetQueryString('appliedAmount');
    if(userId){
        $.ajax({
            method:'get',
            url:getUrl(5)+'/intermediaryAgreement?userId=' + userId + '&' + 'applyAmt=' + applyAmt,
            headers: {'wefinttoken': getCookie('token')},
            error:function(datas) {
                alert('获取状态失败，请稍后。')
            },
            success:function(result) {
                if(result.code==='000000'){
                    var datas = result.data;
                    let spans = $('span'),
                        spanLength = spans.length;
                    let valueDate = new Date(datas.valueDate),//起息日
                        interestDate = new Date(datas.interestDate);//到息日
                    var sumDay = Math.abs(parseInt((interestDate - valueDate)/1000/3600/24));
                    //console.log(valueDate)
                    console.log(valueDate.getFullYear(), valueDate.getMonth() + 1, valueDate.getDate());
                    $('#valueDateYear').text(valueDate.getFullYear());
                    $('#valueDateMonth').text(valueDate.getMonth() + 1);
                    $('#valueDateDate').text(valueDate.getDate());
                    $('#interestDayYear').text(interestDate.getFullYear());
                    $('#interestDayMonth').text(interestDate.getMonth() + 1);
                    $('#interestDayDate').text(interestDate.getDate());
                    $('#sumDay').text(sumDay);
                    for (let i = 0; i < spanLength; i++) {
                        $.each(datas, function(key, value) {
                            if ($($(spans)[i]).attr('id') === key) {
                                $('#'+key).text(value);
                                console.log(key,value);
                            }
                        })
                    }
                    html2canvas(document.body, {
                        allowTaint: true,
                        taintTest: false,
                        onrendered: function(canvas) {
                            canvas.id = "mycanvas";
                            IntermediaryAgreement = canvas.toDataURL();
                            Storage.IntermediaryAgreement = IntermediaryAgreement;
                        }
                    });
                }else if(result.code === 'E000003'){
                    alert('申请金额不能为空');
                }
            }
         })
    }else {
        alert('获取状态失败，请稍后!')
    }

}