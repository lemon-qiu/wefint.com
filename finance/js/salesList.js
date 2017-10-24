$(function () {
    //婚姻状态
    marryStatus();

    layui.use('form', function () {
        var form = layui.form;

        /* form.on('radio(radios)', function(data){
             sub_check();
         });*/

        //审核通过
        form.on('submit(checkPass)', function (data) {
            checkPass(data.field);
            parent.document.location.reload();
        });
        function checkPass(data) {
            var msg = {
                approveStatus: 1,
                userId: data.userId
            };

            var jsontext = JSON.stringify(msg);
            $.ajax({
                url: 'http://192.168.0.126:20000/updateApproveStatus',
                method: 'post',
                contentType: 'application/json;charset=utf-8',
                data: jsontext,
                dataType:'json',
                success: function (data) {
                }
            })
        }


        //驳回
        form.on('submit(checkReject)', function (data) {
            layerAlert();
            //checkReject(data.field);
            //parent.document.location.reload();
            return false;
        });

        //弹出确认框
        function layerAlert(data) {
            layer.open({
                type: 1
                ,title: false //不显示标题栏
                ,closeBtn: false
                ,area: '300px;'
                ,shade: 0.8
                ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
                ,resize: false
                ,btn: ['确定', '取消']
                ,btnAlign: 'c'
                ,moveType: 1 //拖拽模式，0或者1
                ,content: '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">确定要驳回吗？</div>'
                ,success: function(layero){
                    var btn = layero.find('.layui-layer-btn');
                    btn.find('.layui-layer-btn0').addClass('rejeckSure');
                }
            });
        }

        $('.rejeckSure').on('click',function (data) {
            console.log(data);
        //function checkReject(data) {
            var msg = {
                approveStatus: 2,
                userId: data.userId
            };
            var jsontext = JSON.stringify(msg);
            $.ajax({
                url: 'http://192.168.0.126:20000/updateApproveStatus',
                method: 'post',
                contentType: 'application/json;charset=utf-8',
                data: jsontext,
                dataType:'json',
                error: function (request) {
                },
                success: function (data) {
                }
            })
        });

    });

    layui.use('table', function () {
        var table = layui.table;

        //客栈注册列表
        table.render({
            elem: '#hotel-list'
            , id: 'id'
            , url: 'http://192.168.0.126:20000/getMerchantInfoList?approveStatus=0'
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

    //婚姻状态
    function marryStatus() {
        var mStatus = $('#marryStatus').val();
        if (mStatus == '未婚' || mStatus == '离异') {
            $('.hidden').hide();
        } else {
            $('.hidden').show();
        }
    }

    /******************************************************************/
    //显示数据
    function showData(rows,index,btnHide) {
        var body = layer.getChildFrame('body', index); //巧妙的地方在这里哦
        body.contents().find("#userName").val(rows.userName);
        body.contents().find("#certNo").val(rows.certNo);
        body.contents().find("#mobile").val(rows.mobile);
        body.contents().find("#relativeMobile").val(rows.relativeMobile);
        body.contents().find("#friendMobile").val(rows.friendMobile);
        var mi = rows.monthIncome;
        body.contents().find("#monthIncome").val(mi);
        var ms = '';
        if (rows.marryStatus == '0') {
            ms = '已婚';
            body.contents().find("#spouseName").val(rows.spouseName);
            body.contents().find("#spouseMobile").val(rows.spouseMobile);
            body.contents().find("#spouseCertNo").val(rows.spouseCertNo);
            var smi = rows.spouseMonthIncome;
            body.contents().find("#spouseMonthIncome").val(smi);
        } else if (rows.marryStatus == '1') {
            ms = '未婚';
        } else if (rows.marryStatus == '2') {
            ms = '离异';
        }

        body.contents().find("#marryStatus").val(ms);

        body.contents().find("#motelName").val(rows.motelName);
        body.contents().find("#motelAddress").val(rows.motelAddress);
        body.contents().find("#motelProviceName").val(rows.motelProviceName);
        body.contents().find("#motelCityName").val(rows.motelCityName);
        body.contents().find("#motelAreaName").val(rows.motelAreaName);
        var ma = rows.motelAsstes;
        body.contents().find("#motelAsstes").val(ma);
        body.contents().find("#motelRoomQuantity").val(rows.motelRoomQuantity);
        body.contents().find("#motelCertNo").val(rows.motelCertNo);
        body.contents().find("#motelBusinessScale").val(rows.motelBusinessScale);
        body.contents().find("#landlordName").val(rows.landlordName);
        body.contents().find("#rentStartDate").val(rows.rentStartDate);
        body.contents().find("#rentEndDate").val(rows.rentEndDate);
        body.contents().find("#userId").val(rows.userId);
        body.contents().find("#certFront").attr('src', rows.certFront);
        body.contents().find("#certBack").attr('src', rows.certBack);
        var rpo = '';
        if (rows.rentPaymentOption == '0') {
            rpo = '等额本息';
        } else if (rows.rentPaymentOption == '1') {
            rpo = '等额本金';
        } else if (rows.rentPaymentOption == '2') {
            rpo = '先本后息';
        }
        body.contents().find("#rentPaymentOption").val(rpo);
        body.contents().find("#rentPerYear").val(rows.rentPerYear);
        body.contents().find("#deposit").val(rows.deposit);
        body.contents().find("#accountName").val(rows.accountName);
        body.contents().find("#openBank").val(rows.openBank);
        body.contents().find("#bankAccount").val(rows.bankAccount);

        body.contents().find("#motelCert").attr('src', rows.motelCert);
        body.contents().find("#motelPic").attr('src', rows.motelPic);
        body.contents().find("#marryCert").attr('src', rows.marryCert);
        body.contents().find("#rentContract").attr('src', rows.rentContract);
        body.contents().find("#cardFront").attr('src', rows.cardFront);
        body.contents().find("#cardBack").attr('src', rows.cardBack);
        body.contents().find("#rentStartDate").val(formatDate(rows.rentStartDate));
        body.contents().find("#rentEndDate").val(formatDate(rows.rentEndDate));

        var ed = '';
        if (rows.educationDegree == '0') {
            ed = '小学以下';
        } else if (rows.educationDegree == '1') {
            ed = '小学';
        } else if (rows.educationDegree == '2') {
            ed = '初中';
        } else if (rows.educationDegree == '3') {
            ed = '高中以及中专职高';
        } else if (rows.educationDegree == '4') {
            ed = '大专';
        } else if (rows.educationDegree == '5') {
            ed = '本科';
        } else if (rows.educationDegree == '6') {
            ed = '硕士';
        } else if (rows.educationDegree == '7') {
            ed = '博士';
        } else if (rows.educationDegree == '8') {
            ed = '博士以上学历';
        }
        body.contents().find("#educationDegree").val(ed);
        body.contents().find("#workExperiences").val(rows.workExperiences);
        body.contents().find("#otherJobs").val(rows.otherJobs);
        var ph = '';
        if (rows.personalHealth == '0') {
            ph = '健康';
        }
        if (rows.personalHealth == '1') {
            ph = '亚健康';
        }
        if (rows.personalHealth == '2') {
            ph = '非常不健康';
        }
        body.contents().find("#personalHealth").val(ph);
        body.contents().find("#preWorkspace").val(rows.preWorkspace);
        body.contents().find("#commisionPartner").val(rows.commisionPartner);
        body.contents().find("#averageCommision").val(rows.averageCommision);
        body.contents().find("#onlinePercentage").val(rows.onlinePercentage);
        body.contents().find("#offlinePercentage").val(rows.offlinePercentage);
        body.contents().find("#residenceYear").val(rows.residenceYear);
        //车辆信息
        body.contents().find("#carAddress").val(rows.carAddress);
        body.contents().find("#carCatelog").val(rows.carCatelog);
        body.contents().find("#platesStartDate").val(rows.platesStartDate);
        body.contents().find("#driverKm").val(rows.driverKm);
        body.contents().find("#carIfnotLoan").val(rows.carIfnotLoan);
        body.contents().find("#carloanAmt").val(rows.carloanAmt);
        body.contents().find("#carLoanStartDate").val(rows.carLoanStartDate);
        body.contents().find("#carLoanDuration").val(rows.carLoanDuration);
        body.contents().find("#carLoanPaymentOption").val(rows.carLoanPaymentOption);
        body.contents().find("#carPic").attr('src', rows.carPic);
        body.contents().find("#carCertPic").attr('src', rows.carCertPic);
        //房屋信息
        body.contents().find("#houseAddress").val(rows.houseAddress);
        body.contents().find("#houseSquare").val(rows.houseSquare);
        body.contents().find("#houseFloors").val(rows.houseFloors);
        body.contents().find("#houseDecoLevel").val(rows.houseDecoLevel);
        body.contents().find("#ifnotLoan").val(rows.ifnotLoan);
        body.contents().find("#loanAmt").val(rows.loanAmt);
        body.contents().find("#loanStartDate").val(rows.loanStartDate);
        body.contents().find("#loanDuration").val(rows.loanDuration);
        body.contents().find("#loanPaymentOption").val(rows.loanPaymentOption);
        body.contents().find("#housePic").attr('src', rows.housePic);
        body.contents().find("#houseCertPic").attr('src', rows.houseCertPic);
        //客栈经营情况
        setPics(rows.personalIncome,body.contents().find("#personalIncome"));
        setPics(rows.innIncome,body.contents().find("#innIncome"));
        setPics(rows.hydroelectric,body.contents().find("#hydroelectric"));
        setPics(rows.energy,body.contents().find("#energy"));
        //其他经营主体信息
        setPics(rows.waterPayment,body.contents().find("#waterPayment"));
        setPics(rows.energyPayment,body.contents().find("#energyPayment"));
        setPics(rows.otherPhoto,body.contents().find("#otherPhoto"));
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