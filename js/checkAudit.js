$(function() {
    /***
     * 第三方列表页面显示
     * layui Table
     */
    layui.use('table', function () {
        var table = layui.table;
        //客栈注册列表
        table.render({
            elem: '#audit-list'
            , id: 'id'
            , url: getUrl(5)+'/getMerchantInfoList?approveStatus=5'
            , cols: [[
                {field: 'userName', title: '姓名', width: 200, sort: true}
                , {field: 'certNo', title: '身份证号', width: 200, sort: true}
                , {field: 'mobile', title: '联系方式', width: 200, sort: true}
                , {field: 'motelName', title: '客栈名称', width: 300, sort: true}
                , {field: 'motelProviceName', title: '省份', width: 80, sort: true}
                , {field: 'motelCityName', title: '市级', width: 80, sort: true}
                , {field: 'motelAreaName', title: '区/县', width: 150, sort: true}
                , {field: 'createTime', title: '申请时间', width: 160, sort: true}
                , {fixed: 'right', title: '操作', width: 300, toolbar: '#barDemo'}
            ]]
            , height: 315
            , skin: 'row' //表格风格
            , even: true
            , page: true //是否显示分页
            , limits: [5, 10, 20]
            , limit: 5 //每页默认显示的数量
        });


        //监听工具条
        table.on('tool(auditTable)', function (obj) {
            var data = obj.data;
            if (obj.event == 'download') {
                getDownload(data);
            }else if(obj.event == 'detail'){
                getDetail(data);
            }
        });
    });
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
     * 下载文件
     * @param rows
     */
    function getDownload(rows) {
        $.ajax({
            url:getUrl(8)+ '/downloadZip/download',
            method:'post',
            headers: {'wefinttoken': getCookie('token')},
            data:{
                user:rows.userId
            },
            beforeSend:function() {
                $('.shadow').removeClass('hidden');
            },
            success:function(data) {
                if(data.code == '000000' ){
                    $('.shadow').removeClass('hidden');
                    setTimeout(function() {
                        var downUrl = 'http://image.wefint.com/'+ data.content;
                        var exportIframe = document.createElement('iframe');
                        exportIframe.src = downUrl;
                        exportIframe.style.display = "none";
                        document.body.appendChild(exportIframe);

                        setTimeout(function() {
                            $('.shadow').addClass('hidden');
                        },1000)
                    },1000);

                }else {
                    alert('下载失败，请刷新后重试。');
                }
            },
            error:function(result) {
                $('.shadow').addClass('hidden');
                alert('下载失败，请刷新后重试。')
            }
        });

    }

    /*function getDownload(rows) {
        var downUrl = getUrl(8)+"/downloadZipFile/" + rows.userId;
        var exportIframe = document.createElement('iframe');
        exportIframe.src = downUrl;
        exportIframe.style.display = "none";
        document.body.appendChild(exportIframe);
    }*/

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
                body.contents().find("#motelName").val(data.motelName);//客栈名字
                body.contents().find("#motelAddress").val(data.motelAddress);//客栈地址
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