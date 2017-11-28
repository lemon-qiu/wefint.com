$(function() {
    layui.use('table',function() {
        var table = layui.table;
    })
    /**
     * 支付提交
     * @param
     * */
    window.paymentBtn = function() {
        var aliPay = $('#aliPay:checked').val();
        var wechatPay = $('#wechatPay:checked').val();
        var amount = $('input[name=amount]').val();
        var orderNumber = sessionStorage.getItem("orderNumber");//业务订单号
        console.log(orderNumber);
        if(aliPay !== 'aliPay' &&  wechatPay !=='wechatPay'){
            alert('请选择支付方式');
        }else if (amount==='' || amount === '0'){
            alert('支付金额不能为空或者0');
        }else if(aliPay === 'aliPay'){/***支付宝支付***/
            var Data ={
                channel:3,
                type:1,
                orderNumber:orderNumber,
                name:'还款支付',
                amount:parseFloat(amount)*100,
                address:''
            };
            $.ajax({
                url:getUrl(6) + '/alipaySubmit/submit',
                method:'post',
                headers: {'wefinttoken': getCookie('token')},
                data:Data,
                success:function(result) {
                    if(result.code === '000000'){
                        var datas = result.content;
                        console.log(datas.serialNumber)
                        $('input[name=out_trade_no]').val(datas.serialNumber);//支付交易订单号
                        $('input[name=sign]').val(datas.sign);//签名
                        $('input[name=total_fee]').val(datas.amount);//金额
                        $('input[name=notify_url]').val(datas.background);//后台通知地址
                        $('input[name=return_url]').val(datas.front);//前台跳转地址
                        setTimeout(function() {
                            $('#aliPayForm').submit();// 跳转支付宝
                        },1000)
                    }else {
                        alert('状态错误，请重试。')
                    }
                },
                error:function(result) {
                    alert('状态错误，请刷新后重试。')
                }
            })
        }else if( wechatPay !=='wechatPay'){/***微信支付***/

        }
    }
})