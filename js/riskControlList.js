$(function () {
    /***
     * layui Form
     */
    layui.use('form', function () {
        var form = layui.form;

        /* form.on('radio(radios)', function(data){
             sub_check();
         });*/

        //审核通过
        form.on('submit(checkPass)', function (data) {
            /*if(requiredInfo()==false){
                layer.msg('后三项不能为空。');
            }else {
                layerAlertPass();
            }*/
            //弹出确认框
            layer.confirm('确定审核通过吗？', {
                title:'温馨提示',
                btn: ['确定', '取消']
            }, function(index, layero){
                checkPass(data.field);
            })
            return false;
        });

        //弹出必填提示
        function requiredInfo() {
            var radios = $('input:radio:checked').length;
            var publicRecordsInfo = $('#publicRecordsInfo input:checkbox:checked').length;
            var lawsuitTimes = $('#lawsuitTimes').val();
            var overdueTimes = $('#overdueTimes').val();
            if(radios<7 || publicRecordsInfo<1 || lawsuitTimes=="" || overdueTimes==""){
                return false;
            }else {
                return true;
            }
        }

        function checkPass(data) {
            var msg = {
                approveStatus: 4,
                userId: data.userId,
                // isOverdue:getRadioVal('isOverdue'),//是否逾期
                // isLoan:getRadioVal('isLoan'),//是否借款
                // overdueTimes:$('#overdueTimes').val(),//逾期次数
                // isRepayment:getRadioVal('isRepayment'),//是否已还
                // isFinanceBlacklist:getRadioVal('isFinanceBlacklist'),//是否金融机构黑名单
                // isLawsuit:getRadioVal('isLawsuit'),//是否有诉讼
                // lawsuitTimes:$('#lawsuitTimes').val(),//诉讼次数
                // isDeal:getRadioVal('isDeal'),//诉讼是否已处理
                // isCourtBlacklist:getRadioVal('isCourtBlacklist'),//是否法院黑名单
                // loanRepaymentSituation:getSelectVal('loanRepaymentSituation'),//借款还款情况
                // taxEvasion:getPublicRecordsInfo('taxEvasion'),//偷税漏税情况
                // criminal:getPublicRecordsInfo('criminal'),//犯罪情况
                // punishment:getPublicRecordsInfo('punishment'),//治安处罚情况
                // otherLawsuit:getPublicRecordsInfo('otherLawsuit'),//其他不良诉讼
            };

            var jsontext = JSON.stringify(msg);
            $.ajax({
                url: getUrl(5)+'/updateApproveStatus',
                method: 'post',
                headers: {'wefinttoken': getCookie('token')},
                contentType: 'application/json;charset=utf-8',
                data: jsontext,
                dataType:'json',
                success: function (data) {
                    layer.msg('审核通过。',{time: 1000},function() {
                        parent.document.location.reload();
                    })
                },
                error:function (data) {
                    alert('审核失败，请重新审核')
                }
            })
        }
        function getRadioVal(name) {
            return $(`input[name=${name}]:checked`).val();
        }
        function getSelectVal(id) {
            return $(`#${id} option:selected`).val();
        }
        function getPublicRecordsInfo(id) {
            if($('#'+id).attr('checked')){
                $('#'+id).val(1);
            }else {
                $('#'+id).val(0);
            }
            return $('#'+id).val();
        }
        //驳回
        form.on('submit(checkReject1)', function (data) {
            if($('#remark').val() == ''){
                layer.msg('请输入备注错误信息。');
            }else {
                //弹出确认框
                layer.confirm('确定要驳回吗？', {
                    title:'温馨提示',
                    btn: ['确定', '取消']
                }, function(index, layero){
                    checkReject(data.field);
                });
            }
            return false;
        })

        function checkReject(data) {
            var msg = {
                approveStatus: 3,
                userId: data.userId
            };
            var jsontext = JSON.stringify(msg);
            $.ajax({
                url:getUrl(5)+'/updateApproveStatus',
                method: 'post',
                contentType: 'application/json;charset=utf-8',
                data: jsontext,
                dataType:'json',
                error:function (data) {
                    alert('驳回失败，请重试。');
                },
                success: function (data) {
                    layer.msg('驳回通过。',{time: 1000},function() {
                        parent.document.location.reload();
                    })
                }
            })
        };


        /***************已放款***************/

        /**
         * 提交后验证是否上传完图片，
         * 上传完成 提交后台修改状态
         * sendToInvestor
         */
        form.on('submit(sendToInvestor)', function (data) {
           // console.log(imgArrays);
            var imgs = $('.imgs-list');
            var len = imgs.length;
            var typeStatus,empLen=0;
            for(var i = 0;i<len;i++){//判断是否上传完每个上传项
                if($(imgs[i]).is(':empty')=== false){
                    empLen+=1;
                }else {
                    empLen+=0;
                }
            }
            if(empLen === len){
                typeStatus =  5;
                sendToInvestor(data.field,typeStatus);
            }else {
                layer.msg('请上传完图片');
                return false;
            }
            return false;
        });

        /**
         *  上传完图片，提交修改状态
         * @param data 表单数据
         * @param typeStatus 状态
         */
        function sendToInvestor(data,typeStatus) {
            var msg = {
                userId: data.userId,
                approveStatus:typeStatus,
            }
            var jsontext = JSON.stringify(msg);
            $.ajax({
                url:getUrl(5)+'/updateApproveStatus',
                method: 'post',
                contentType: 'application/json;charset=utf-8',
                data: jsontext,
                dataType:'json',
                error: function (request) {
                    alert('上传失败，请重试')
                },
                success: function (data) {
                    layer.msg('上传成功。',{time: 1000},function() {
                        parent.document.location.reload();
                    })
                }
            })
        }

        /**
         * 获得img src
         * @param Ul的id
         */
        function getImgs(id) {
            var imgs = [],i=0,
                len = $('#'+ id +' li').length;
            for(i = 1;i < len+1 ;i++ ){
                imgs.push( $('#'+ id +' li:nth-child('+ i +') img')[0].src);
            }
            console.log(imgs);
        }
    });
    /***
     * 二级审核列表页面显示
     * layui Table
     */
    layui.use('table', function () {
        var table = layui.table;
        //信息列表
        table.render({
            elem: '#hotel-list'
            , id: 'id'
            , url: getUrl(5)+'/getRiskControlList'
            , cols: [[
                {field: 'userName', title: '姓名', width: 200, sort: true}
                , {field: 'certNo', title: '身份证号', width: 200, sort: true}
                , {field: 'mobile', title: '联系方式', width: 200, sort: true}
                , {field: 'motelName', title: '客栈名称', width: 300, sort: true}
                , {field: 'motelProviceName', title: '省份', width: 80, sort: true}
                , {field: 'motelCityName', title: '市级', width: 80, sort: true}
                , {field: 'motelAreaName', title: '区/县', width: 150, sort: true}
                , {field: 'createTime', title: '申请时间', width: 160, sort: true}
                , {field: 'approveStatus', title: '状态', templet: '#status', width: 150}
                , {fixed: 'right', title: '操作', width: 300, toolbar: '#barDemo'}
            ]]
            , height: 315
            , skin: 'row' //表格风格
            , even: true
            , page: true //是否显示分页
            , limits: [5, 10, 20]
            , limit: 5 //每页默认显示的数量
        });

        //信息列表监听工具条
        table.on('tool(hotelTable)', function (obj) {
            var data = obj.data;
            if (obj.event == 'detail') {
                getDetail(data);
            } else if (obj.event == 'checkLevelOne') {
                getCheckLevelOne(data);
            } else if (obj.event == 'checkLevelTwo') {
                getCheckLevelTwo(data);
            } else if(obj.event=='loan'){
                console.log('1=====',data.userId);
                reloadLoanList(data);
            }
        });

        /**
         * 展开当前放款列
         * @param rows 表单数据
         */
        function reloadLoanList(rows) {
            var userId = rows.userId;
            console.log('2=====',userId);
            $('#loan-name').text(rows.userName);//贷款人
            table.render({
                elem: '#loan-list'
                , id: 'loanid'
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
                    , {field: 'status', title: '状态', templet: '#loanStatus', width: 150}
                    , {fixed: 'right', title: '操作', width: 300, toolbar: '#loanBar'}
                ]]
                , height: 'auto'
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



        //放款列表监听工具条
        table.on('tool(loanTable)', function (obj) {
            var rows = obj.data;//列内容
            if(obj.event=='hasBeenLend'){/*********已放款数据回显************/
                var dd = layer.open({
                    title:false,
                    area: ['90%', '90%'],
                    type:2,
                    content:'../html/hasBeenLendView.html',
                    success:function (layero,index) {
                        var body = layer.getChildFrame('body', index); //巧妙的地方在这里哦
                        body.contents().find("#userId").val(rows.userId);
                        /**************已放款 获取OSS账户数据( 图片上传 )**************/
                        $.ajax({
                            url: getUrl(6)+"/upload/getObjectAccess",
                            method: 'get',
                            contentType: 'application/json;charset=utf-8',
                            headers: {'wefinttoken': getCookie('token')},
                            dataType: 'json',
                            error: function(request) {
                                alert("获取状态失败，请稍后刷新页面");
                            },
                            success: function(data) {//获取数据
                                let objs = eval(data.content);
                                console.log(objs);
                                body.contents().find('#policy').val(objs.policy);
                                body.contents().find('#callback').val(objs.callback);
                                body.contents().find('#signature').val(objs.signature);
                            }
                        });

                    },
                    error:function() {
                        alert('获取状态失败，请重试。')
                    }
                });
            }else if(obj.event=='repayment'){ /**************还款***************/
                var cf = layer.confirm('确定已经还款了吗？',{
                    title:'温馨提示',
                    btn:['确定','取消']
                },function(index,layero){
                    let Data = {
                        contractNo:rows.contractNo
                    }
                    $.ajax({
                        url:getUrl(5)+'/updateReturnStatus',
                        method:'post',
                        contentType: 'application/json;charset=utf-8',
                        headers: {'wefinttoken': getCookie('token')},
                        data:JSON.stringify(Data),//合同号
                        error:function(result) {
                            alert('操作失败,请刷新后重试');
                        },
                        success:function(result) {
                            if(result.code === '000000'){
                                reloadLoanList(rows);//重新加载放款列表
                            }else if(result.code === 'E000004') {
                                alert('还款失败,请重试');
                            }else{
                                alert('操作失败,请重试');
                            }
                        }
                    });
                    layer.close(cf);
                })
            }
        });
    });


    /********判断是否有错误radio*********/
    function sub_check() {
        var radios = $('input:radio:checked');
        $.each(radios, function (i) {
            if ($(radios[i]).val() == 'false') {
                $('.no-pass').removeClass('layui-btn-disabled');
                $('.pass').addClass('layui-btn-disabled');
            } else {
                $('.pass').removeClass('layui-btn-disabled');
                $('.no-pass').addClass('layui-btn-disabled');
            }
        })

    }

    /************图片查看*************/
    $('.pics').on('click', function () {
        var i = $('.pics').index(this);
        var viewer = new Viewer($('.pics')[i], {
            url: 'data-original'
        });
    })

    /******************************************************************/
    //显示数据
    function showData(rows,index,btnHide) {
        var body = layer.getChildFrame('body', index); //巧妙的地方在这里哦
        body.contents().find("#userId").val(rows.userId);
        $.ajax({
            url:getUrl(4)+'/getMerchantInfoByUserId?userId='+ rows.userId,
            method: 'post',
            contentType: 'application/json;charset=utf-8',
            error: function (request) {
                alert('获取数据失败，请重试。');
            },
            success: function (data) {
                //个人基本信息
                body.contents().find("#userName").val(data.userName);//姓名
                body.contents().find("#certNo").val(data.certNo);//身份证号码
                body.contents().find("#mobile").val(data.mobile);//联系方式
                body.contents().find("#relativeMobile").val(data.relativeMobile);//亲属电话号码
                body.contents().find("#friendMobile").val(data.friendMobile);//朋友电话号码
                body.contents().find("#companyTelephone").val(data.companyTelephone);//公司电话
                body.contents().find("#monthIncome").val(data.monthIncome);//家庭月收入
                body.contents().find("#certFront").attr('src', data.certFront);//上传身份证正面
                body.contents().find("#certBack").attr('src', data.certBack);//上传身份证反面
                body.contents().find("#householdRegister").attr('src', data.householdRegister);//上传户口本
                //婚姻状况
                var ms = '',marryStatusStr;
                if(data.marryStatus === null || data.marryStatus === ''){
                    marryStatusStr = null;
                }else {
                    marryStatusStr=data.marryStatus.toString()
                }
                if (marryStatusStr == '0'|| marryStatusStr == '1') {
                    if(marryStatusStr == '0'){
                        ms = '已婚有子女';
                    }else{
                        ms = '已婚无子女';
                    }
                    body.contents().find("#spouseName").val(data.spouseName);//配偶姓名
                    body.contents().find("#spouseMobile").val(data.spouseMobile);//配偶联系电话
                    body.contents().find("#spouseCertNo").val(data.spouseCertNo);//配偶身份证号
                    body.contents().find("#spouseCertFront").attr('src', data.spouseCertFront);//上传身份证正面
                    body.contents().find("#spouseCertBack").attr('src', data.spouseCertBack);//上传身份证反面
                    body.contents().find("#marryCert").attr('src', data.marryCert);//上传婚姻证
                } else if (marryStatusStr == '2') {
                    ms = '离异有子女';
                    body.contents().find('.hidden').hide();
                } else if (marryStatusStr == '3') {
                    ms = '离异无子女';
                    body.contents().find('.hidden').hide();
                }else if (marryStatusStr == '4') {
                    ms = '未婚';
                    body.contents().find('.hidden').hide();
                }else if (marryStatusStr == null) {
                    ms = '';
                    body.contents().find('.hidden').hide();
                }
                body.contents().find("#marryStatus").val(ms);//状况
                //客栈情况
                var ht = '',hotelType;
                if(data.hotelType === null || data.hotelType === ''){
                    hotelType = null;
                }else {
                    hotelType=data.hotelType.toString()
                }
                switch (hotelType){
                    case null:ht='';break;
                    case '0' : ht = '客栈';break;
                    case '1' : ht = '酒店';break;
                }
                body.contents().find("#hotelType").val(ht);//客栈类型
                body.contents().find("#motelName").val(data.motelName);//客栈名字
                body.contents().find("#motelAddress").val(data.motelAddress);//客栈地址

                /* function getSelect(param,arrys) {
                     var mp = '',
                         tmp;
                     if(param === null || param === ''){
                         tmp = null;
                     }else {
                         tmp=parseInt(param);
                     }
                     for(var i =0;i<arrys.length;i++){
                         if(tmp === i){
                             tmp = arrys[i];
                         }else {
                             tmp = null;
                         }
                     }
                 }
                 getSelect(rows.mainProperty,['国有及国家投资企业','集体企业','私营企业','个体工商者'])*/
                var mp = '',mainPropertyStr;
                if(data.mainProperty === null || data.mainProperty === ''){
                    mainPropertyStr = null;
                }else {
                    mainPropertyStr=data.mainProperty.toString()
                }
                switch (mainPropertyStr){
                    case null:mp='';break;
                    case '0' : mp = '国有及国家投资企业';break;
                    case '1' : mp = '集体企业';break;
                    case '2' : mp = '私营企业';break;
                    case '3' : mp = '个体工商者';break;
                }
                body.contents().find("#mainProperty").val(mp);//经营主体

                body.contents().find("#motelProviceName").val(data.motelProviceName);//省份
                body.contents().find("#motelCityName").val(data.motelCityName);//城市
                body.contents().find("#motelAreaName").val(data.motelAreaName);//区/县
                body.contents().find("#motelAssets").val(data.motelAssets);//客栈投入
                body.contents().find("#motelRoomQuantity").val(data.motelRoomQuantity);//客栈房间数
                body.contents().find("#occupieRate").val(data.occupieRate);//入住率
                body.contents().find("#motelCertNo").val(data.motelCertNo);//营业执照号
                body.contents().find("#motelBusinessScale").val(data.motelBusinessScale);//营业范围
                body.contents().find("#motelCert").attr('src', data.motelCert);//客栈营业执照照片
                body.contents().find("#motelPic").attr('src', data.motelPic);//客栈照片
                //承租情况
                body.contents().find("#landlordName").val(data.landlordName);//房东姓名
                body.contents().find("#rentStartDate").val(data.rentStartDate);//房租起始日
                body.contents().find("#rentEndDate").val(data.rentEndDate);//房租到期日
                body.contents().find("#leftRentYear").val(data.leftRentYear);//剩余租期
                body.contents().find("#leftPaidRentalMonth").val(data.leftPaidRentalMonth);//已支付房租剩余期限
                var rpo = '',rentPaymentOptionStr;
                if(data.rentPaymentOption === null || data.rentPaymentOption === ''){
                    rentPaymentOptionStr = null;
                }else {
                    rentPaymentOptionStr=data.rentPaymentOption.toString()
                }
                switch (rentPaymentOptionStr){
                    case null:rpo='';break;
                    case '0' : rpo = '一年一付';break;
                    case '1' :  rpo = '两年一付';break;
                    case '2' :  rpo = '三年一付';break;
                    case '3' :  rpo = '四年一付';break;
                    case '4' :  rpo = '四年以上';break;
                }
                body.contents().find("#rentPaymentOption").val(rpo);//房租交付方式
                body.contents().find("#rentPerYear").val(data.rentPerYear);//每年房租价格
                body.contents().find("#deposit").val(data.deposit);//已支付押金
                var rf = '',resaleFeeFlagStr;
                if(data.resaleFeeFlag === null || data.resaleFeeFlag === ''){
                    resaleFeeFlagStr = null;
                }else {
                    resaleFeeFlagStr = data.resaleFeeFlag.toString();
                }
                switch (resaleFeeFlagStr){
                    case null:rf='';break;
                    case '0' :rf = '按金额';break;
                    case '1' :rf = '按比例';break;
                }
                body.contents().find("#resaleFeeFlag").val(rf);//转让费类型
                body.contents().find("#resaleFee").val(data.resaleFee);//转让费金额
                body.contents().find("#rentContract").attr('src', data.rentContract);//原始租赁合同照片
                //客栈经营情况
                body.contents().find("#motelMonthIncome").val(data.motelMonthIncome);//客栈月收入
                body.contents().find("#roomMonthIncome").val(data.roomMonthIncome);//客房月收入
                setPics(data.personalIncome,body.contents().find("#personalIncome"));//个人月收入证明
                setPics(data.innIncome,body.contents().find("#innIncome"));//OTA流水
                setPics(data.hydroelectric,body.contents().find("#hydroelectric"));//近期水费单
                setPics(data.energy,body.contents().find("#energy"));//近期电费单
                //收款银行账户信息
                body.contents().find("#accountName").val(data.accountName);//户名
                body.contents().find("#openBank").val(data.openBank);//开户行
                body.contents().find("#bankAccount").val(data.bankAccount);//银行账户
                body.contents().find("#cardFront").attr('src', data.cardFront);//银行卡正面照片
                body.contents().find("#cardBack").attr('src', data.cardBack);//银行卡反面照片
                //个人资产情况
                //车辆信息
                body.contents().find("#carAddress").val(data.carAddress);//车子所在地
                body.contents().find("#carCatelog").val(data.carCatelog);//车型
                body.contents().find("#platesStartDate").val(data.platesStartDate);//上牌时间
                body.contents().find("#driverKm").val(data.driverKm);//驾驶里程
                var ci ='',carIfnotLoanStr;
                if(data.carIfnotLoan === null || data.carIfnotLoan === ''){
                    carIfnotLoanStr = null;
                }else {
                    carIfnotLoanStr=data.carIfnotLoan.toString()
                }
                switch (carIfnotLoanStr){
                    case null:ci='';break;
                    case '0' :ci='是';break;
                    case '1' :ci='否';break;
                }
                body.contents().find("#carIfnotLoan").val(ci);//是否贷款
                body.contents().find("#carloanAmt").val(data.carloanAmt);//贷款金额
                body.contents().find("#carLoanStartDate").val(data.carLoanStartDate);//贷款时间
                body.contents().find("#carLoanDuration").val(data.carLoanDuration);//贷款期限
                var clp = '',carLoanPaymentOptionStr;
                if(data.carLoanPaymentOption === null || data.carLoanPaymentOption === ''){
                    carLoanPaymentOptionStr = null;
                }else {
                    carLoanPaymentOptionStr=data.carLoanPaymentOption.toString()
                }
                switch (carLoanPaymentOptionStr){
                    case null:clp='';break;
                    case '0' :clp='等额本息';break;
                    case '1' :clp='等额本金';break;
                    case '2' :clp='先息后本';break;
                }
                body.contents().find("#carLoanPaymentOption").val(clp);//贷款还款方式
                body.contents().find("#carPic").attr('src', data.carPic);//车子照片
                body.contents().find("#carCertPic").attr('src', data.carCertPic);//行车证照片
                //房屋信息
                body.contents().find("#houseAddress").val(data.houseAddress);//房子所在地
                body.contents().find("#houseSquare").val(data.houseSquare);//房子面积
                body.contents().find("#houseFloors").val(data.houseFloors);//楼层
                var hd = '',houseDecoLevelStr ;
                if(data.houseDecoLevel === null || data.houseDecoLevel === ''){
                    houseDecoLevelStr = null;
                }else {
                    houseDecoLevelStr=data.houseDecoLevel.toString()
                }
                switch (houseDecoLevelStr){
                    case null:hd='';break;
                    case '0': hd='低端';break;
                    case '1': hd='中低端';break;
                    case '2': hd='中端';break;
                    case '3': hd='中高端';break;
                    case '4': hd='高端';break;
                }
                body.contents().find("#houseDecoLevel").val(hd);//装修程度
                /*var hd = '',houseDecoLevelStr ;
                function getselect(dataName , idName,obj) {
                    if(dataName === null || dataName === ''){
                        idName = null;
                    }else {
                        idName=dataName.toString()
                    }
                    for(let i=0;i<obj.length;i++){
                        if(idName === null){
                            hd = '';
                        }else{
                            switch (idName){
                                case i: hd=obj[i];break;
                            }
                        }
                    }
                }
                getselect(rows.houseDecoLevel,houseDecoLevelStr)*/
                if(data.houseDecoLevel === null || data.houseDecoLevel === ''){
                    houseDecoLevelStr = null;
                }else {
                    houseDecoLevelStr=data.houseDecoLevel.toString()
                }
                switch (houseDecoLevelStr){
                    case null:hd='';break;
                    case '0': hd='低端';break;
                    case '1': hd='中低端';break;
                    case '2': hd='中端';break;
                    case '3': hd='中高端';break;
                    case '4': hd='高端';break;
                }
                body.contents().find("#houseDecoLevel").val(hd);//装修程度
                var il = '',ifnotLoanStr;
                if(data.ifnotLoan === null || data.ifnotLoan === ''){
                    ifnotLoanStr = null;
                }else {
                    ifnotLoanStr=data.ifnotLoan.toString()
                }
                switch (ifnotLoanStr){
                    case null:il='';break;
                    case '0': il='是';break;
                    case '1': il='否';break;
                }
                body.contents().find("#ifnotLoan").val(il);//是否贷款
                body.contents().find("#loanAmt").val(data.loanAmt);//贷款金额
                body.contents().find("#loanStartDate").val(data.loanStartDate);//贷款时间
                body.contents().find("#loanDuration").val(data.loanDuration);//贷款期限
                body.contents().find("#loanPaymentOption").val(data.loanPaymentOption);//贷款还款方式
                body.contents().find("#housePic").attr('src', data.housePic);//房子照片
                body.contents().find("#houseCertPic").attr('src', data.houseCertPic);//房产证照片
                //其他个人补充信息
                var ed = '',educationDegreeStr;
                if(data.educationDegree === null || data.educationDegree === ''){
                    educationDegreeStr = null;
                }else {
                    educationDegreeStr=data.educationDegree.toString()
                }
                switch (educationDegreeStr){
                    case null:ed='';break;
                    case '0' :ed = '硕士以上';break;
                    case '1' :ed = '大专至本科';break;
                    case '2' :ed = '高中及高职';break;
                    case '3' :ed = '初中及以下';break;
                }
                body.contents().find("#educationDegree").val(ed);//学历
                body.contents().find("#workExperiences").val(data.workExperiences);//工作年限
                body.contents().find("#otherJobs").val(data.otherJobs);//经营主体外其他任职
                var ph = '',personalHealthStr;
                if(data.personalHealth === null || data.personalHealth === ''){
                    personalHealthStr = null;
                }else {
                    personalHealthStr=data.personalHealth.toString()
                }
                switch (personalHealthStr){
                    case null:ph='';break;
                    case '0':ph = '良好';break;
                    case '1':ph = '一般';break;
                    case '2':ph = '差';break;
                }
                body.contents().find("#personalHealth").val(ph);//个人健康程度
                var pw = '',preWorkspaceStr;
                if(data.preWorkspace === null || data.preWorkspace === ''){
                    preWorkspaceStr = null;
                }else {
                    preWorkspaceStr=data.preWorkspace.toString()
                }
                switch (preWorkspaceStr){
                    case null:pw='';break;
                    case '0' :pw = '政府任职';break;
                    case '1' :pw = '国企任职';break;
                    case '2' :pw = '事业单位任职';break;
                    case '3' :pw = '私企任职';break;
                }
                body.contents().find("#preWorkspace").val(pw);//上一单位性质及职务
                //其他经营主体信息
                setInputs(data.tourismCooperation,body.contents().find("#tourismCooperation"));//客源合作方
                setInputs(data.customerCooperation,body.contents().find("#customerCooperation"));//客户合作方
                body.contents().find("#bondsman").val(data.bondsman);//担保人
                var mit = '',monthIncomeType;
                if(data.educationDegree === null || data.educationDegree === ''){
                    monthIncomeType = null;
                }else {
                    monthIncomeType=data.educationDegree.toString()
                }
                switch (monthIncomeType){
                    case null:mit='';break;
                    case '0' :mit = '二肖';break;
                    case '1' :mit = '其他';break;
                }
                body.contents().find("#monthIncomeType").val(mit);//其他收入类型
                body.contents().find("#averageCommision").val(data.averageCommision);//其他月收入
                body.contents().find("#perMonthWaterFee").val(data.perMonthWaterFee);//每月水费
                body.contents().find("#perMonthSheetsFee").val(data.perMonthSheetsFee);//每月布草花费
                setPics(data.waterPayment,body.contents().find("#waterPayment"));//多张水费单
                setPics(data.energyPayment,body.contents().find("#energyPayment"));//多张电费单
                setPics(data.otherPhoto,body.contents().find("#otherPhoto"));//其他证件照
                body.contents().find("#onlinePercentage").val(data.onlinePercentage);//客栈客源线上占比
                body.contents().find("#offlinePercentage").val(data.offlinePercentage);//客栈客源线下占比
                body.contents().find("#residenceYear").val(data.residenceYear);//当地居住年限

                //按钮隐藏
                if(btnHide==0){
                    body.contents().find(".btnControl").hide();
                    body.contents().find(".remark").hide();
                }
            }
        });
    }

    //二级检查
    function getCheckLevelTwo(rows) {
        var dd = layer.open({
            title: false,
            area: ['90%', '90%'],
            type: 2,
            content: '../html/riskControlView.html',
            success: function (layero, index) {
                showData(rows,index,1);
            }
        });
    }
    //查看
    function getDetail(rows) {
        var dd = layer.open({
            title: false,
            area: ['90%', '90%'],
            type: 2,
            content: '../html/riskControlView.html',
            success: function (layero, index) {
                showData(rows,index,0);
            }
        });
    }

    /**
     * 已放款风控二级审核通过后提交第三方
     * 模拟图片上传
     * @param ojb
     */
    var type;
    window.updatePhoto= function(obj,imgType) {
        let data = obj;
        type = imgType;
        console.log('type1==='+ type);
        if($(obj).next().is(':empty')===true){
            var signature = $('#signature').val(),
                callback = $('#callback').val(),
                policy = $('#policy').val(),
                key = $('#key').val();

            $('#selectfiles').click();
            var fileBtn = $('#selectfiles').next().children();
            fileBtn.change(function() {
                //点击上传
                $('#postfiles').attr({'onclick':uploadImgs(data)})
                $('#postfiles').click();
            })
        }else {
            alert('只能上传一张');
        }


    }

    /**
     * 保存图片到后台
     * @param datas 传递的参数
     */
    window.savePhotos = function(datas){

        var imgUrl,
            userId=$('#userId').val();
        imgUrl = datas.name;
        var data = {
            userId:userId,
            url : imgUrl,
            type:type,
        };
        console.log('type==='+ type);
        console.log(data);
        var jsontext = JSON.stringify(data);
        $.ajax({
            url: getUrl(4) + '/addPmsPic',
            method: 'post',
            data:jsontext,
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            error: function(request) {
                alert("获取状态失败，请稍后重试。");
            },
            success: function(data) {//获取数据
                console.log(data);
            }
        })
    }


    //得到图片组
    function setPics(pics,domId) {
        $.each(pics,function (i,url) {
            domId.append(`<li><img data-original="" src="${url}" alt=""></li>`);
        });
    }
    //得到input组
    function setInputs(namesStr,domInput) {
        var namesArray;
        if(namesStr==null){
            namesArray = [];
        }else {
            namesArray = namesStr.split(';');
            namesArray -= 1;
            $.each(namesArray,function (i,name) {
                domInput.append(`<div class="layui-col-md8"><input type="text"  autocomplete="off" class="layui-input" value="${name}" disabled></div>`);
            });
        }
        $.each(namesArray,function (i,name) {
            domInput.append(`<div class="layui-col-md8"><input type="text"  autocomplete="off" class="layui-input" value="${name}" disabled></div>`);
        });
    }
    //日期转换
    function formatDate(value) {
        var date = new Date(value);
        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 1);
        var day = date.getDate().toString();
        var hour = date.getHours().toString();
        var minutes = date.getMinutes().toString();
        var seconds = date.getSeconds().toString();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        if (hour < 10) {
            hour = "0" + hour;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return year + "-" + month + "-" + day;
    }

})