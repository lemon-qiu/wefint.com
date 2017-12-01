layui.use(['laydate', 'form', 'layedit', 'jquery'], function() {
    var laydate = layui.laydate
        , form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit;
});
(function() {
    // 进入页面后首先 获取六芒星的方法
    var userId = getCookie("userName");
    window.onload = function() {
        localStorage.removeItem('IntermediaryAgreement');
        localStorage.removeItem('loanApplication');
        localStorage.removeItem('loanAgreement');
        localStorage.removeItem('contractNo');
        $('#user_name').val(GetQueryString('userName'));
        $('#id_card').val(GetQueryString('certNo'));
        $('#phone_number').val(GetQueryString('mobile'));
        $('#relativeMobile').val(GetQueryString('motelName'));
        $('#friendMobile').val(GetQueryString('friendMobile'));
        $('#monthIncome').val(GetQueryString('averageCommision'));
        $('#withdraw').hide();  //申请客栈贷隐藏
        var appliedAmountMax = $('#appliedAmountMax');

        /*****测试****/
        readerChart(100,52,46,23,45,2);
        /*$.post(url + "/getSixAwnStarData", {userId: userId}, function(data, err) {
            var identicalPlate = data.identicalPlate;  // 身份
            var rentPlate = data.rentPlate;             // 承租

            var salesPlate = data.salesPlate;           // 销售
            var scalePlate = data.scalePlate;              // 规模
            var creditHistoryPlate = data.creditHistoryPlate;   // 信用历史
            var relationshipPlate = data.relationshipPlate;     // 人脉
            readerChart(
                identicalPlate > 100 ? 100 : identicalPlate,
                rentPlate > 100 ? 100 : rentPlate,
                salesPlate > 100 ? 100 : salesPlate,
                scalePlate > 100 ? 100 : scalePlate,
                creditHistoryPlate > 100 ? 100 : creditHistoryPlate,
                relationshipPlate > 100 ? 100 : relationshipPlate);
            $('#fintcredit').val(identicalPlate + rentPlate + salesPlate + scalePlate + creditHistoryPlate + relationshipPlate)
        });*/
    };
    // 打开复选框 是 同时打开弹出层的方法
    window.memberbasicTitle = function() {
        var appliedAmount = $('#appliedAmount').val();
        $('#module').css({'display': 'block'});
        $('.shadow').show();
        $('#moduleIframe').attr({'src': './applayForFinance.html?userId=' + userId + '&' + 'appliedAmount=' + appliedAmount})
    };

    window.ViewServiceProtocol = function() {
        var appliedAmount = $('#appliedAmount').val();
        $('#module').css({'display': 'block'});
        $('.shadow').show();
        $('#moduleIframe').attr({'src': './BrokerageContract.html?appliedAmount=' + appliedAmount})
    };

    window.loanAgreement = function() {
        var appliedAmount = $('#appliedAmount').val();
        $('#module').css({'display': 'block'});
        $('.shadow').show();
        $('#moduleIframe').attr({'src': './loanAgreement.html?appliedAmount=' + appliedAmount})
    };

    window.clickUrl = function(idName) {
        var appliedAmount = $('#appliedAmount').val();
        if (appliedAmount === '' || appliedAmount === null || appliedAmount === undefined) {
            alert('请先填写申请金额!');
            $('#' + idName)[0].checked = false;
        } else {
            var appliedAmount = $('#appliedAmount').val();
            var balance = $('#balance');
            if (parseInt(appliedAmount) <= parseInt(balance.val())) {
                if (!(/(^[1-9]\d*$)/.test(appliedAmount))) {
                    alert('借款金额只能为正整数，不能为小数');
                    $('#' + idName)[0].checked = false;
                } else {
                    if (!(appliedAmount >= 10000 && appliedAmount % 5000 === 0)) {
                        alert('最低申请金额为10000，并且为5000得倍数');
                        $('#' + idName)[0].checked = false;
                    } else {
                        $('#' + idName)[0].checked = true;
                        $('.' + idName).click();
                    }
                }
            }else if(parseInt(balance.val()<=0)){
                alert('余额不足');
                $('#' + idName)[0].checked = false;
            }else {
                alert('输入的金额不能大于余额');
                $('#' + idName)[0].checked = false;
            }
        }
    };

    window.fillInfo = function() {
        var fi = layer.open({
            title:false,
            area: ['1208px', '666px'],
            type:2,
            content:'../html/usercenter2.0.html',
            success:function (layero,index) {

            }
        })
    }

    /**
     * 六芒星 显示的方法
     * @param F
     * @param D
     * @param E
     * @param H
     * @param A
     * @param G
     */
    function readerChart(F, D, E, H, A, G) {
        var C = echarts.init(document.getElementById("main"));
        var B = {
            title: {
                //text: '疯特信用'
            },
            legend: {
                top: 20,
                itemWidth: 12,
                itemHeight: 12,
                data: [],
                textStyle: {
                    color: '#000'
                }
            },
            radar: {
                radius: '60%',
                splitNumber: 8,
                name: {
                    textStyle: {
                        color: '#658ee9',
                        fontSize: 12
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                        opacity: 1,
                        type:"dashed",
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#fff',
                        opacity: 1
                    }
                },
                splitArea: {
                    areaStyle: {
                        opacity: 1,
                        shadowBlur: 16,
                        shadowColor: 'rgba(117, 117, 117, 0.35)',
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        color: [
                            new echarts.graphic.LinearGradient(0, 1, 0, 0,[{offset: 0, color: '#e5fffc'},{offset: 1, color: '#acd5ff'}], false)]
                    }
                },
                indicator: [{
                    //name: '身份',
                    max: 100
                }, {
                    //name: '承租',
                    max: 100
                }, {
                    //name: '销量',
                    max: 100
                }, {
                    //name: '规模',
                    max: 100
                }, {
                    //name: '信用历史',
                    max: 100
                }, {
                    //name: '人脉',
                    max: 100
                }]
            },
            series: [{
                name: '预算 vs 开销（Budget vs spending）',
                type: 'radar',
                symbolSize: 0,
                areaStyle: {
                    normal: {
                        shadowBlur: 16,
                        shadowColor: 'rgba(0, 56, 110, 0.53)',
                        shadowOffsetX: 0,
                        shadowOffsetY: 2,
                        opacity: 1
                    }
                },
                data: [{
                    value: [F, D, E, H, A, G],
                    //name: '疯特信用',
                }
                ]
            }],
            color: ['#658ee9'],
            backgroundColor: {
                type: 'radial',
                globalCoord: false // 缺省为 false
            }
        };
        C.setOption(B)
    }
    /**
     * 根据 传递得参数获取url地址得参数的方法
     * @param name  需要获取的url 得参数
     * @returns {null}
     * @constructor
     */
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if (r !== null) return unescape(r[2]);
        return null;
    }

})();

$(function() {
    //六芒星介绍
    var _li = $('#h6Star-info-list li')
    switch_menu(_li,'mouseenter');


    /**
     *  菜单切换
     * @param e_name 鼠标移入对象
     * @param type 鼠标动作
     */
    function switch_menu(e_name,type){
        if(type === 'mouseenter'){
            e_name.mouseenter(function(e){
                $(this).addClass('on').siblings().removeClass('on');
            });
        }else if(type === 'click'){
            e_name.click(function(e){
                $(this).addClass('on').siblings().removeClass('on');
            });
        }

    }

    /**
     * 进度条
     */
    $('.charts').each(function(i,item) {
        var _color;
        var per = parseInt($(item).attr('per'));
        switch (true){
            case per<=20 && per>0: _color='#43dbe9';break;
            case per<=40 && per>20: _color='#86ffcd';break;
            case per<=60 && per>40: _color='#c0f7ff';break;
            case per<=80 && per>60: _color='#86f6ff';break;
            case per<=100 && per>80: _color='#afffaf';break;
        }
        $(item).css('background-color',_color);
        //$(item).parentsUntil($('.barbox')).nextUntil($('.percentage')).text(per + '%');
        $(item).parent().parent().next().next().text(per + '%');
        $(item).animate({
            width:per + '%',
        },1000);
    })

})
/**
 * 图片压缩，默认同比例压缩
 * @param {Object} path
 *   pc端传入的路径可以为相对路径，但是在移动端上必须传入的路径是照相图片储存的绝对路径
 * @param {Object} obj
 *   obj 对象 有 width， height， quality(0-1)
 * @param {Object} callback
 *   回调函数有一个参数，base64的字符串数据
 */
function dealImage(path, obj, callback) {
    var img = new Image();
    img.src = path;
    img.onload = function() {
        var that = this;
        // 默认按比例压缩
        var w = that.width,
            h = that.height,
            scale = w / h;
        w = obj.width || w;
        h = obj.height || (w / scale);
        var quality = 0.7;  // 默认图片质量为0.7
        //生成canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        var base64 = canvas.toDataURL('image/jpeg', quality);
        // 回调函数返回base64的值
        callback(base64);
    }
}