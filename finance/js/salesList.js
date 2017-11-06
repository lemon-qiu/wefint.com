$(function () {
    layui.use('form', function () {
        var form = layui.form;

        /* form.on('radio(radios)', function(data){
             sub_check();
         });*/

        /****审核通过****/
        form.on('submit(checkPass)', function (data) {
            layerAlertPass();
            return false;
        });
        //弹出确认框
        function layerAlertPass() {
            layer.confirm('确定审核通过吗？', {
                title:'温馨提示',
                btn: ['确定', '取消']
            }, function(index, layero){
                $('#checkPass2').click();
                layer.close(index);
            }, function(){
            });
        }
        form.on('submit(checkPass2)', function (data) {
            checkPass(data.field);
        });

        function checkPass(data) {
            var msg = {
                approveStatus: 1,
                userId: data.userId
            };

            var jsontext = JSON.stringify(msg);
            $.ajax({
                url: url+'/updateApproveStatus',
                method: 'post',
                contentType: 'application/json;charset=utf-8',
                data: jsontext,
                dataType:'json',
                success: function () {
                    parent.document.location.reload();
                },
                error:function () {
                    parent.document.location.reload();
                }
            })
        }


        /**********驳回***************/
        form.on('submit(checkReject1)', function (data) {
            if($('#remark').val() == ''){
                layerRemark();
            }else {
                layerAlert();
            }
            return false;
        })
        form.on('submit(checkReject2)', function (data) {
            checkReject(data.field);
        });

        function layerRemark() {
            layer.msg('请输入备注错误信息。');
        }
        //弹出确认框
        function layerAlert() {
            layer.confirm('确定要驳回吗？', {
                title:'温馨提示',
                btn: ['确定', '取消']
            }, function(index, layero){
                $('#checkReject2').click();
                layer.close(index);
            }, function(){
            });
        }


        function checkReject(data) {
            var msg = {
                approveStatus: 2,
                userId: data.userId
            };
            var jsontext = JSON.stringify(msg);
            $.ajax({
                url: url+'/updateApproveStatus',
                method: 'post',
                contentType: 'application/json;charset=utf-8',
                data: jsontext,
                dataType:'json',
                error:function () {
                parent.document.location.reload();
                },
                success: function (data) {
                    parent.document.location.reload();
                }
            })
        };

    });

    layui.use('table', function () {
        var table = layui.table;

        //客栈注册列表
        table.render({
            elem: '#hotel-list'
            , id: 'id'
            , url: url+'/getMerchantInfoList?approveStatus=0'
            , cols: [[
                {field: 'id', title: '#', width: 80, sort: true}
                , {field: 'userName', title: '姓名', width: 200, sort: true}
                , {field: 'certNo', title: '身份证号', width: 200, sort: true}
                , {field: 'mobile', title: '联系方式', width: 200, sort: true}
                , {field: 'motelName', title: '客栈名称', width: 300, sort: true}
                , {field: 'motelProviceName', title: '省份', width: 80, sort: true}
                , {field: 'motelCityName', title: '市级', width: 80, sort: true}
                , {field: 'motelAreaName', title: '区/县', width: 150, sort: true}
                , {field: 'approveStatus', title: '状态', templet: '#status', width: 150}
                , {fixed: 'right', title: '操作', width: 200, toolbar: '#barDemo'}
            ]]
            , height: 315
            , skin: 'row' //表格风格
            , even: true
            , page: true //是否显示分页
            , limits: [5, 10, 20]
            , limit: 5 //每页默认显示的数量
        });


        //监听工具条
        table.on('tool(hotelTable)', function (obj) {
            var data = obj.data;
            if (obj.event == 'detail') {
                getDetail(data);
            } else if (obj.event == 'checkLevelOne') {
                getCheckLevelOne(data);
            } else if (obj.event == 'checkLevelTwo') {
                getCheckLevelTwo(data);
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
    /************************显示数据*****************************/
    function showData(rows,index,btnHide) {
        var body = layer.getChildFrame('body', index); //巧妙的地方在这里哦
        body.contents().find("#userId").val(rows.userId);
        //个人基本信息
        body.contents().find("#userName").val(rows.userName);//姓名
        body.contents().find("#certNo").val(rows.certNo);//身份证号码
        body.contents().find("#mobile").val(rows.mobile);//联系方式
        body.contents().find("#relativeMobile").val(rows.relativeMobile);//亲属电话号码
        body.contents().find("#friendMobile").val(rows.friendMobile);//朋友电话号码
        body.contents().find("#companyTelephone").val(rows.companyTelephone);//公司电话
        body.contents().find("#monthIncome").val(rows.monthIncome);//家庭月收入
        body.contents().find("#certFront").attr('src', rows.certFront);//上传身份证正面
        body.contents().find("#certBack").attr('src', rows.certBack);//上传身份证反面
        //婚姻状况
        var ms = '',marryStatusStr;
        if(rows.marryStatus === null || rows.marryStatus === ''){
            marryStatusStr = null;
        }else {
            marryStatusStr=rows.marryStatus.toString()
        }
        if (marryStatusStr == '0'|| marryStatusStr == '1') {
            if(marryStatusStr == '0'){
                ms = '已婚有子女';
            }else{
                ms = '已婚无子女';
            }
            body.contents().find("#spouseName").val(rows.spouseName);//配偶姓名
            body.contents().find("#spouseMobile").val(rows.spouseMobile);//配偶联系电话
            body.contents().find("#spouseCertNo").val(rows.spouseCertNo);//配偶身份证号
            body.contents().find("#spouseCertFront").attr('src', rows.spouseCertFront);//上传身份证正面
            body.contents().find("#spouseCertBack").attr('src', rows.spouseCertBack);//上传身份证反面
            body.contents().find("#marryCert").attr('src', rows.marryCert);//上传婚姻证
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
        body.contents().find("#motelName").val(rows.motelName);//客栈名字
        body.contents().find("#motelAddress").val(rows.motelAddress);//客栈地址
        var mp = '',mainPropertyStr;
        if(rows.mainProperty === null || rows.mainProperty === ''){
            mainPropertyStr = null;
        }else {
            mainPropertyStr=rows.mainProperty.toString()
        }
        switch (mainPropertyStr){
            case null:mp='';break;
            case '0' : mp = '国有及国家投资企业';break;
            case '1' : mp = '集体企业';break;
            case '2' : mp = '私营企业';break;
            case '3' : mp = '个体工商者';break;
        }
        body.contents().find("#mainProperty").val(mp);//经营主体
        body.contents().find("#motelProviceName").val(rows.motelProviceName);//省份
        body.contents().find("#motelCityName").val(rows.motelCityName);//城市
        body.contents().find("#motelAreaName").val(rows.motelAreaName);//区/县
        body.contents().find("#motelAssets").val(rows.motelAssets);//客栈投入
        body.contents().find("#motelRoomQuantity").val(rows.motelRoomQuantity);//客栈房间数
        body.contents().find("#occupieRate").val(rows.occupieRate);//入住率
        body.contents().find("#motelCertNo").val(rows.motelCertNo);//营业执照号
        body.contents().find("#motelBusinessScale").val(rows.motelBusinessScale);//营业范围
        body.contents().find("#motelCert").attr('src', rows.motelCert);//客栈营业执照照片
        body.contents().find("#motelPic").attr('src', rows.motelPic);//客栈照片
        //承租情况
        body.contents().find("#landlordName").val(rows.landlordName);//房东姓名
        body.contents().find("#rentStartDate").val(rows.rentStartDate);//房租起始日
        body.contents().find("#rentEndDate").val(rows.rentEndDate);//房租到期日
        body.contents().find("#leftRentYear").val(rows.leftRentYear);//剩余租期
        body.contents().find("#leftPaidRentalMonth").val(rows.leftPaidRentalMonth);//已支付房租剩余期限
        var rpo = '',rentPaymentOptionStr;
        if(rows.rentPaymentOption === null || rows.rentPaymentOption === ''){
            rentPaymentOptionStr = null;
        }else {
            rentPaymentOptionStr=rows.rentPaymentOption.toString()
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
        body.contents().find("#rentPerYear").val(rows.rentPerYear);//每年房租价格
        body.contents().find("#deposit").val(rows.deposit);//已支付押金
        var rf = '',resaleFeeFlagStr;
        if(rows.resaleFeeFlag === null || rows.resaleFeeFlag === ''){
            resaleFeeFlagStr = null;
        }else {
            resaleFeeFlagStr = rows.resaleFeeFlag.toString();
        }
        switch (resaleFeeFlagStr){
            case null:rf='';break;
            case '0' :rf = '按金额';break;
            case '1' :rf = '按比例';break;
        }
        body.contents().find("#resaleFeeFlag").val(rf);//转让费类型
        body.contents().find("#resaleFee").val(rows.resaleFee);//转让费金额
        body.contents().find("#rentContract").attr('src', rows.rentContract);//原始租赁合同照片
        //客栈经营情况
        body.contents().find("#motelMonthIncome").val(rows.motelMonthIncome);//客栈月收入
        body.contents().find("#roomMonthIncome").val(rows.roomMonthIncome);//客房月收入
        setPics(rows.personalIncome,body.contents().find("#personalIncome"));//个人月收入证明
        setPics(rows.innIncome,body.contents().find("#innIncome"));//OTA流水
        setPics(rows.hydroelectric,body.contents().find("#hydroelectric"));//近期水费单
        setPics(rows.energy,body.contents().find("#energy"));//近期电费单
        //收款银行账户信息
        body.contents().find("#accountName").val(rows.accountName);//户名
        body.contents().find("#openBank").val(rows.openBank);//开户行
        body.contents().find("#bankAccount").val(rows.bankAccount);//银行账户
        body.contents().find("#cardFront").attr('src', rows.cardFront);//银行卡正面照片
        body.contents().find("#cardBack").attr('src', rows.cardBack);//银行卡反面照片
        //个人资产情况
        //车辆信息
        body.contents().find("#carAddress").val(rows.carAddress);//车子所在地
        body.contents().find("#carCatelog").val(rows.carCatelog);//车型
        body.contents().find("#platesStartDate").val(rows.platesStartDate);//上牌时间
        body.contents().find("#driverKm").val(rows.driverKm);//驾驶里程
        var ci ='',carIfnotLoanStr;
        if(rows.carIfnotLoan === null || rows.carIfnotLoan === ''){
            carIfnotLoanStr = null;
        }else {
            carIfnotLoanStr=rows.carIfnotLoan.toString()
        }
        switch (carIfnotLoanStr){
            case null:ci='';break;
            case '0' :ci='是';break;
            case '1' :ci='否';break;
        }
        body.contents().find("#carIfnotLoan").val(ci);//是否贷款
        body.contents().find("#carloanAmt").val(rows.carloanAmt);//贷款金额
        body.contents().find("#carLoanStartDate").val(rows.carLoanStartDate);//贷款时间
        body.contents().find("#carLoanDuration").val(rows.carLoanDuration);//贷款期限
        var clp = '',carLoanPaymentOptionStr;
        if(rows.carLoanPaymentOption === null || rows.carLoanPaymentOption === ''){
            carLoanPaymentOptionStr = null;
        }else {
            carLoanPaymentOptionStr=rows.carLoanPaymentOption.toString()
        }
        switch (carLoanPaymentOptionStr){
            case null:clp='';break;
            case '0' :clp='等额本息';break;
            case '1' :clp='等额本金';break;
            case '2' :clp='先息后本';break;
        }
        body.contents().find("#carLoanPaymentOption").val(clp);//贷款还款方式
        body.contents().find("#carPic").attr('src', rows.carPic);//车子照片
        body.contents().find("#carCertPic").attr('src', rows.carCertPic);//行车证照片
        //房屋信息
        body.contents().find("#houseAddress").val(rows.houseAddress);//房子所在地
        body.contents().find("#houseSquare").val(rows.houseSquare);//房子面积
        body.contents().find("#houseFloors").val(rows.houseFloors);//楼层
        var hd = '',houseDecoLevelStr ;
        if(rows.houseDecoLevel === null || rows.houseDecoLevel === ''){
            houseDecoLevelStr = null;
        }else {
            houseDecoLevelStr=rows.houseDecoLevel.toString()
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
        if(rows.ifnotLoan === null || rows.ifnotLoan === ''){
            ifnotLoanStr = null;
        }else {
            ifnotLoanStr=rows.ifnotLoan.toString()
        }
        switch (ifnotLoanStr){
            case null:il='';break;
            case '0': il='是';break;
            case '1': il='否';break;
        }
        body.contents().find("#ifnotLoan").val(il);//是否贷款
        body.contents().find("#loanAmt").val(rows.loanAmt);//贷款金额
        body.contents().find("#loanStartDate").val(rows.loanStartDate);//贷款时间
        body.contents().find("#loanDuration").val(rows.loanDuration);//贷款期限
        body.contents().find("#loanPaymentOption").val(rows.loanPaymentOption);//贷款还款方式
        body.contents().find("#housePic").attr('src', rows.housePic);//房子照片
        body.contents().find("#houseCertPic").attr('src', rows.houseCertPic);//房产证照片
        //其他个人补充信息
        var ed = '',educationDegreeStr;
        if(rows.educationDegree === null || rows.educationDegree === ''){
            educationDegreeStr = null;
        }else {
            educationDegreeStr=rows.educationDegree.toString()
        }
        switch (educationDegreeStr){
            case null:ed='';break;
            case '0' :ed = '硕士以上';break;
            case '1' :ed = '大专至本科';break;
            case '2' :ed = '高中及高职';break;
            case '3' :ed = '初中及以下';break;
        }
        body.contents().find("#educationDegree").val(ed);//学历
        body.contents().find("#workExperiences").val(rows.workExperiences);//工作年限
        body.contents().find("#otherJobs").val(rows.otherJobs);//经营主体外其他任职
        var ph = '',personalHealthStr;
        if(rows.personalHealth === null || rows.personalHealth === ''){
            personalHealthStr = null;
        }else {
            personalHealthStr=rows.personalHealth.toString()
        }
        switch (personalHealthStr){
            case null:ph='';break;
            case '0':ph = '良好';break;
            case '1':ph = '一般';break;
            case '2':ph = '差';break;
        }
        body.contents().find("#personalHealth").val(ph);//个人健康程度
        var pw = '',preWorkspaceStr;
        if(rows.preWorkspace === null || rows.preWorkspace === ''){
            preWorkspaceStr = null;
        }else {
            preWorkspaceStr=rows.preWorkspace.toString()
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
        setInputs(rows.tourismCooperation,body.contents().find("#tourismCooperation"));//客源合作方
        setInputs(rows.customerCooperation,body.contents().find("#customerCooperation"));//客户合作方
        body.contents().find("#bondsman").val(rows.bondsman);//担保人
        body.contents().find("#monthIncomeType").val(rows.mit);//其他收入类型
        body.contents().find("#averageCommision").val(rows.averageCommision);//其他月收入
        setPics(rows.waterPayment,body.contents().find("#waterPayment"));//多张水费单
        setPics(rows.energyPayment,body.contents().find("#energyPayment"));//多张电费单
        setPics(rows.otherPhoto,body.contents().find("#otherPhoto"));//其他证件照
        body.contents().find("#onlinePercentage").val(rows.onlinePercentage);//客栈客源线上占比
        body.contents().find("#offlinePercentage").val(rows.offlinePercentage);//客栈客源线下占比
        body.contents().find("#residenceYear").val(rows.residenceYear);//当地居住年限

        //按钮隐藏
        if(btnHide==0){
            body.contents().find(".btnControl").hide();
            body.contents().find(".remark").hide();
        }
    }
    
    //一级检查
    function getCheckLevelOne(rows) {
        var dd = layer.open({
            title: false,
            type: 2,
            content: '../html/salesView.html',
            success: function (layero, index) {
                showData(rows,index,1);
            }
        });
        layer.full(dd);
    }
    //查看
    function getDetail(rows) {
        var dd = layer.open({
            title: false,
            type: 2,
            content: '../html/salesView.html',
            success: function (layero, index) {
                showData(rows,index,0);
            }
        });
        layer.full(dd);
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