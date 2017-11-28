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

/**
 *
 * @constructor  整个借款 流程方法
 */
function DeterminedApply() {
    let IntermediaryAgreement = Storage.IntermediaryAgreement;  // 居间协议
    let loanApplication = Storage.loanApplication;       // 融资申请数
    let loanAgreement = Storage.loanAgreement;
    let contractNo = Storage.contractNo;
    let userId = getCookie("userName");
    let appliedAmountMax = $('#appliedAmountMax');
    let appliedAmount = $('#appliedAmount').val();
    let balance = $('#balance');
    let memberbasicTitle = $('#memberbasicTitle').is(':checked');
    let ViewServiceProtocol = $('#ViewServiceProtocol').is(':checked');
    let loanAgreementbutton = $('#loanAgreement').is(':checked');
    let appliedAmountMaxArr = '';
    let appliedAmountMaxVal = appliedAmountMax.val();
    appliedAmountMaxArr = appliedAmountMaxVal.split(',');
    let appliedAmountMaxNumber = appliedAmountMaxArr[0] + appliedAmountMaxArr[1];
    if (appliedAmount === '' || appliedAmount === null || appliedAmount === undefined) {
        alert('输入的借款金额不能为空！')
    } else {
        if (parseInt(appliedAmount) <= parseInt(balance.val())) {
            if (memberbasicTitle && ViewServiceProtocol && loanAgreementbutton) {
                if (IntermediaryAgreement && loanApplication && loanAgreement) {
                    dealImage(IntermediaryAgreement, {width: 600, height: 900}, function(base) {
                        IntermediaryAgreement = base;
                    });
                    dealImage(loanApplication, {width: 600, height: 900}, function(base) {
                        loanApplication = base;
                    });
                    dealImage(loanAgreement, {width: 600, height: 900}, function(base) {
                        loanAgreement = base;
                    });
                    let Data = {
                        userId: userId,
                        applyAmt: appliedAmount,
                        IntermediaryAgreement: IntermediaryAgreement,
                        loanApplication: loanApplication,
                        loanAgreement: loanAgreement,
                        contractNo: contractNo,
                    };
                    console.log(Data);
                    $('#applyImmediately').addClass('layui-btn-disabled');
                    $.post(url + "/submitApplyAmt", Data, function(result, err) {
                        if(result.code === "000000"){
                            balance.val(result.data.balance);
                            alert('申请成功，请注意查收信息');
                            new loadRepayment();//重新加载借款列表
                            $('#memberbasicTitle')[0].checked = false;
                            $('#ViewServiceProtocol')[0].checked = false;
                            $('#loanAgreement')[0].checked = false;
                            $('#applyImmediately').removeClass('layui-btn-disabled');
                        }else if(result.code === "E000001"){
                            alert(result.msg);
                        }else{
                            alert('提交申请失败，请重新尝试')
                        }

                    });
                } else {
                    alert('合同申请上传未成功，请重新确认申请合同信息')
                }
            } else {
                alert('请勾选以上协议')
            }
        } else {
            alert('申请金额不能大于最高可申请金额！')
        }
    }
}

(function() {
    // 进入页面后首先 获取六芒星的方法
    let userId = getCookie("userName");
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
        let appliedAmountMax = $('#appliedAmountMax');
        $.post(url + "/getSixAwnStarData", {userId: userId}, function(data, err) {
            let identicalPlate = data.identicalPlate;  // 身份
            let rentPlate = data.rentPlate;             // 承租

            let salesPlate = data.salesPlate;           // 销售
            let scalePlate = data.scalePlate;              // 规模
            let creditHistoryPlate = data.creditHistoryPlate;   // 信用历史
            let relationshipPlate = data.relationshipPlate;     // 人脉
            readerChart(
                identicalPlate > 100 ? 100 : identicalPlate,
                rentPlate > 100 ? 100 : rentPlate,
                salesPlate > 100 ? 100 : salesPlate,
                scalePlate > 100 ? 100 : scalePlate,
                creditHistoryPlate > 100 ? 100 : creditHistoryPlate,
                relationshipPlate > 100 ? 100 : relationshipPlate);
            $('#fintcredit').val(identicalPlate + rentPlate + salesPlate + scalePlate + creditHistoryPlate + relationshipPlate)
        });

        new loadRepayment();//初始化加载还款列表
    };
    // 点击借款 时 请求数据的方法
    window.onWithdraw = function() {
        $.post(url + "/getMerchantInfoByUserId", {userId: userId}, function(data, err) {
            if (data.approveStatus < 4) {
                $('#remarkInfo').html('<span>备注：</span> <span style="color:red"> 对不起，您所提交的信息还在审核中，请您耐心等待。</span>')
            } else {
                let appliedAmountMax = $('#appliedAmountMax');
                let balance = $('#balance');
                appliedAmountMax.val(data.maxLimit);
                balance.val(data.balance);
                $('#withdraw').show();
                $('#remarkInfo').hide();
            }
        })

    };
    // 打开复选框 是 同时打开弹出层的方法
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
        $('#moduleIframe').attr({'src': './BrokerageContract.html?appliedAmount=' + appliedAmount})
    };

    window.loanAgreement = function() {
        let appliedAmount = $('#appliedAmount').val();
        $('#module').css({'display': 'block'});
        $('.shadow').show();
        $('#moduleIframe').attr({'src': './loanAgreement.html?appliedAmount=' + appliedAmount})
    };

    window.clickUrl = function(idName) {
        let appliedAmount = $('#appliedAmount').val();
        if (appliedAmount === '' || appliedAmount === null || appliedAmount === undefined) {
            alert('请先填写申请金额!');
            $('#' + idName)[0].checked = false;
        } else {
            let appliedAmount = $('#appliedAmount').val();
            let balance = $('#balance');
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
        let C = echarts.init(document.getElementById("main"));
        let B = {
            title: {
                text: '疯特信用'
            },
            legend: {
                top: 20,
                itemWidth: 12,
                itemHeight: 12,
                data: [],
                textStyle: {
                    color: '#fff'
                }
            },
            radar: {
                radius: '60%',
                splitNumber: 8,
                axisLine: {
                    lineStyle: {
                        color: '#000',
                        opacity: .2
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#000',
                        opacity: .2
                    }
                },
                splitArea: {
                    areaStyle: {
                        color: '#EEE',
                        opacity: 1,
                        shadowBlur: 45,
                        shadowColor: 'rgba(0,0,0,.5)',
                        shadowOffsetX: 0,
                        shadowOffsetY: 15,
                    }
                },
                indicator: [{
                    name: '身份',
                    max: 100
                }, {
                    name: '承租',
                    max: 100
                }, {
                    name: '销量',
                    max: 100
                }, {
                    name: '规模',
                    max: 100
                }, {
                    name: '信用历史',
                    max: 100
                }, {
                    name: '人脉',
                    max: 100
                }]
            },
            series: [{
                name: '预算 vs 开销（Budget vs spending）',
                type: 'radar',
                symbolSize: 0,
                areaStyle: {
                    normal: {
                        shadowBlur: 13,
                        shadowColor: 'rgba(0,0,0,.2)',
                        shadowOffsetX: 0,
                        shadowOffsetY: 10,
                        opacity: 1
                    }
                },
                data: [{
                    value: [F, D, E, H, A, G],
                    name: '疯特信用',
                }
                ]
            }],
            color: ['#3B89BA', '#b1eadb'],
            backgroundColor: {
                type: 'radial',
                x: 0.4,
                y: 0.4,
                r: 0.35,
                colorStops: [{
                    offset: 0,
                    color: '#fff' // 0% 处的颜色
                }, {
                    offset: .4,
                    color: '#fff' // 100% 处的颜色
                }, {
                    offset: 1,
                    color: '#fff' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        };
        C.setOption(B)
    }
    /*function readerChart(F, D, E, H, A, G) {
        let C = echarts.init(document.getElementById("main"));
        let B = {
            title: {
                text: '疯特信用'
            },
            legend: {
                top: 20,
                itemWidth: 12,
                itemHeight: 12,
                data: [],
                textStyle: {
                    color: '#fff'
                }
            },
            radar: {
                radius: '60%',
                splitNumber: 8,
                axisLine: {
                    lineStyle: {
                        color: '#000',
                        opacity: .2
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#000',
                        opacity: .2
                    }
                },
                splitArea: {
                    areaStyle: {
                        color: '#EEE',
                        opacity: 1,
                        shadowBlur: 45,
                        shadowColor: 'rgba(0,0,0,.5)',
                        shadowOffsetX: 0,
                        shadowOffsetY: 15,
                    }
                },
                indicator: [{
                    name: '身份',
                    max: 100
                }, {
                    name: '承租',
                    max: 100
                }, {
                    name: '销量',
                    max: 100
                }, {
                    name: '规模',
                    max: 100
                }, {
                    name: '信用历史',
                    max: 100
                }, {
                    name: '人脉',
                    max: 100
                }]
            },
            series: [{
                name: '预算 vs 开销（Budget vs spending）',
                type: 'radar',
                symbolSize: 0,
                areaStyle: {
                    normal: {
                        shadowBlur: 13,
                        shadowColor: 'rgba(0,0,0,.2)',
                        shadowOffsetX: 0,
                        shadowOffsetY: 10,
                        opacity: 1
                    }
                },
                data: [{
                    value: [F, D, E, H, A, G],
                    name: '疯特信用',
                }
                ]
            }],
            color: ['#3B89BA', '#b1eadb'],
            backgroundColor: {
                type: 'radial',
                x: 0.4,
                y: 0.4,
                r: 0.35,
                colorStops: [{
                    offset: 0,
                    color: '#fff' // 0% 处的颜色
                }, {
                    offset: .4,
                    color: '#fff' // 100% 处的颜色
                }, {
                    offset: 1,
                    color: '#fff' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        };
        C.setOption(B)
    }*/

    /**
     * 根据 传递得参数获取url地址得参数的方法
     * @param name  需要获取的url 得参数
     * @returns {null}
     * @constructor
     */
    function GetQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = decodeURI(window.location.search).substr(1).match(reg);
        if (r !== null) return unescape(r[2]);
        return null;
    }


})();

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
    let img = new Image();
    img.src = path;
    img.onload = function() {
        let that = this;
        // 默认按比例压缩
        let w = that.width,
            h = that.height,
            scale = w / h;
        w = obj.width || w;
        h = obj.height || (w / scale);
        let quality = 0.7;  // 默认图片质量为0.7
        //生成canvas
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        // 创建属性节点
        let anw = document.createAttribute("width");
        anw.nodeValue = w;
        let anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        let base64 = canvas.toDataURL('image/jpeg', quality);
        // 回调函数返回base64的值
        callback(base64);
    }
}

layui.use('table',function() {
    var table = layui.table;
    /**
     * 用户还款列表
     */
    var userId  = getCookie('userName');
    window.loadRepayment = function() {
    //window.loadRepayment = function() {
        table.render({
            elem: '#repayment-list'
            , id: 'id'
            ,url: getUrl(5) + '/getCollectionInfoList?userId='+ userId
            , cols: [[
                {field: 'contractNo', title: '合同号', width: 100, sort: true}
                , {field: 'valueDate', title: '起息日', width: 120, sort: true}
                , {field: 'interestDate', title: '到息日', width: 120, sort: true}
                , {field: 'paidAmt', title: '实收金额', width: 100, sort: true}
                , {field: 'repaymentPrincipal', title: '还款本金', width: 100, sort: true}
                , {field: 'informationFlowFee', title: '信息流量费', width: 120, sort: true}
                , {field: 'platformOperationFee', title: '平台操作费', width: 120, sort: true}
                , {field: 'creditCheckingFee', title: '征信审核费', width: 120, sort: true}
                , {field: 'repaymentInterest', title: '还款利息', width: 100, sort: true}
                , {field: 'total', title: '总计', width: 100, sort: true}
                , {field: 'repaymentDate', title: '还款日期', width: 120, sort: true}
                , {field: 'createTime', title: '申请时间', width: 160, sort: true}
                , {field: 'status', title: '状态', templet: '#repaymentStatus', width: 150}
            ]]
            , skin: 'row' //表格风格
            , even: true
            , page: true //是否显示分页
            , limits: [5, 10, 20]
            , limit: 5 //每页默认显示的数量
            , done: function(res, curr, count) {
                var datas = res.data;
                var len = datas.length;
                var valueDate,interestDate,repaymentDate;
                for(var i = 0 ;i<len;i++){
                    if(datas[i].valueDate != null && datas[i].valueDate != ''){
                        valueDate = new Date(datas[i].valueDate);
                        console.log(datas[i].valueDate)
                        $($(".layui-table td[data-field='valueDate']")[i]).children().text(valueDate.getFullYear() + '-'+ (valueDate.getMonth()+1) + '-' + valueDate.getDate());
                    }else {
                        valueDate = null;
                    }

                    if(datas[i].interestDate != null && datas[i].interestDate !=''){
                        interestDate = new Date(datas[i].interestDate);
                        $($(".layui-table td[data-field='interestDate']")[i]).children().text(interestDate.getFullYear() + '-'+ (interestDate.getMonth()+1) + '-' + interestDate.getDate());
                    }else {
                        interestDate = null;
                    }

                    if(datas[i].repaymentDate != null && datas[i].repaymentDate !=''){
                        repaymentDate = new Date(datas[i].repaymentDate);
                        $($(".layui-table td[data-field='repaymentDate']")[i]).children().text(repaymentDate.getFullYear() + '-'+ (repaymentDate.getMonth()+1) + '-' + repaymentDate.getDate());
                    }else {
                        repaymentDate = null;
                    }
                }
            }
        });
    }
});
/**
 * 跳转到支付页面
 * @param rows 列表
 */
window.repayment = function (rows) {
    sessionStorage.setItem("orderNumber", rows.contractNo);
    window.open('./repayment.html') ;
}