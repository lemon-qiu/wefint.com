/**
 * 获取页面数据
 * */
window.onload = function(e) {
    let userId = getCookie('userName');
    if(userId){
        $.ajax({
            method:'get',
            url:getUrl(5)+'/intermediaryAgreement?userId='+ userId,
            headers: {'wefinttoken': getCookie('token')},
            error:function(datas) {
                alert('获取状态失败，请稍后。')
            },
            success:function(datas) {
                console.log(datas);
                let spans = $('span'),
                    spanLength = spans.length;
                let valueDate = new Date(datas.valueDate),//起息日
                    interestDay = new Date(datas.interestDay);//到息日
                var sumDay = Math.abs(parseInt((interestDay - valueDate)/1000/3600/24));
                //console.log(valueDate)
                console.log(valueDate.getFullYear(), valueDate.getMonth() + 1, valueDate.getDate());
                $('#valueDateYear').text(valueDate.getFullYear());
                $('#valueDateMonth').text(valueDate.getMonth() + 1);
                $('#valueDateDate').text(valueDate.getDate());
                $('#interestDayYear').text(interestDay.getFullYear());
                $('#interestDayMonth').text(interestDay.getMonth() + 1);
                $('#interestDayDate').text(interestDay.getDate());
                $('#sumDay').text(sumDay);
                for (let i = 0; i < spanLength; i++) {
                    $.each(datas, function(key, value) {
                        if ($($(spans)[i]).attr('id') === key) {
                            $('#'+key).text(value);
                            console.log(key,value);
                        }
                    })
                }
            }
         })
    }else {
        alert('获取状态失败，请稍后!')
    }

}