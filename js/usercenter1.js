(function() {
    layui.use(['laydate', 'form', 'layedit', 'jquery'], function() {
        let laydate = layui.laydate
            , form = layui.form
            , layer = layui.layer
            , layedit = layui.layedit;


        //常规用法
        laydate.render({
            elem: '#rentStartDate'
        });
        laydate.render({
            elem: '#rentEndDate'
        });
        laydate.render({
            elem: '#platesStartDate'
        });
        form.on('select(marryStatus)', function(d) {
            if (d.value > 1) {
                $('.marryed').nextAll().hide();
                $($('.marryed')[1]).hide();
            } else {
                $('.marryed').nextAll().show();
                $($('.marryed')[1]).show();
            }
        });
        form.on('select(carIfnotLoan)', function(d) {
            if (d.value > 0) {
                $('.loan').hide();
            } else {
                $('.loan').show();
            }
        });
        form.on('select(ifnotLoan)', function(d) {
            if (d.value > 0) {
                $('.houseloan').hide();
            } else {
                $('.houseloan').show();
            }
        });
        // 页面加载时处理的方法  检查审核状态 根据状态处理
        window.onload = function() {
            $('#cuowu').hide();
            let userId = getCookie("userName");
            $.post(url + "/getMerchantInfoByUserId", {userId: userId},
                function(data, err) {
                    let searchUrl = encodeURI("./hexagram.html?userName=" + data.userName + '&' + 'certNo=' + data.certNo + '&' + 'mobile=' + data.mobile + '&' + 'motelName=' + data.motelName + '&' + 'friendMobile=' + data.friendMobile + '&' + 'averageCommision=' + data.monthIncome + '&' + 'userId=' + userId);
                    // 获取全局的按钮
                    // let HTMLALLBUTTON = $('button');    // 获取全局所有的按钮
                    // let HTMLALLINPUT = $('input');      // 获取全局所有的输入框
                    // // 获取审核的状态
                    // const GETENDTIRELYAPPROVESTAATUS = 4;           // 完全审核通过
                    // const GETPUTINAPPROVESTATUSONE = 0;             // 一级审核
                    // const GETPUTINAPPROVESTATUSTWO = 1;             // 二级审核
                    // const GETPUTINAPPROVESTATUSTHREE = 2;            // 一级驳回
                    // const GETPUTINAPPROVESTATUSFOUR = 3;             // 二级驳回
                    // if (data.approveStatus === GETENDTIRELYAPPROVESTAATUS) {
                    //     window.location.href = searchUrl;
                    //     for (let i = 0; i < HTMLALLINPUT.length; i++) {
                    //         $($('input')[i]).attr({'disabled': "disabled"})
                    //     }
                    //     for (let i = 0; i < HTMLALLBUTTON.length; i++) {
                    //         $($('button')[i]).attr({'disabled': "disabled"})
                    //     }
                    // } else if (data.approveStatus === GETPUTINAPPROVESTATUSONE || data.approveStatus === GETPUTINAPPROVESTATUSTWO) {
                    //     window.location.href = searchUrl;
                    //     for (let i = 0; i < HTMLALLINPUT.length; i++) {
                    //         $($('input')[i]).attr({'disabled': "disabled"})
                    //     }
                    //     for (let i = 0; i < HTMLALLBUTTON.length; i++) {
                    //         $($('button')[i]).attr({'disabled': "disabled"})
                    //     }
                    // } else if (data.approveStatus === GETPUTINAPPROVESTATUSTHREE || data.approveStatus === GETPUTINAPPROVESTATUSFOUR) {
                    //     // 切换为修改数据的状态
                    //     window.location.href = './usercenter.html';
                    //     $('#cuowu').show();
                    //     $('#updatabtn').text('确认修改');
                    // }
                    let strcustomer = data.customerCooperation;
                    let strtourism = data.tourismCooperation;
                    if (strcustomer) {   // 客户合作方
                        let arrcustomer = strcustomer.split(';');
                        let customerSpring = '';
                        for (let i = 0; i < arrcustomer.length - 1; i++) {
                            customerSpring += '<div class="layui-col-md"> <input type="text"class="layui-input" value="' + arrcustomer[i] + '"></div>'
                            $('#customerCooperation').html(customerSpring)
                        }
                    }
                    if (strtourism) {   // 客源合作方
                        let arrtourism = strtourism.split(';');
                        let tourismSpring = '';
                        for (let i = 0; i < arrtourism.length - 1; i++) {
                            tourismSpring += '<div class="layui-col-md"> <input type="text"class="layui-input" value="' + arrtourism[i] + '"></div>'
                            $('#tourismCooperation').html(tourismSpring)
                        }
                    }
                    $('#userName').val(data.userName);   //用户名
                    $('#id_card').val(data.certNo);   // 身份证号码
                    $('#phone_number').val(data.mobile); // 电话号码
                    $('#relativeMobile').val(data.relativeMobile); // 亲属电话号码
                    $('#friendMobile').val(data.friendMobile);     // 朋友电话号码
                    $('#companyTelephone').val(data.companyTelephone); // 公司电话·号码
                    data.certFront == null ? $('#certFront').attr({'display': 'none'}) : $('#certFront').attr({'src': data.certFront}); //省份证正面
                    data.certBack == null ? $('#certBack').attr({'display': 'none'}) : $('#certBack').attr({'src': data.certBack}); //省份证反面
                    data.referencePictures == null ? $('#referencePictures').attr({'display': 'none'}) : $('#referencePictures').attr({'src': data.referencePictures}); // 个人征信照片
                    $('#monthIncome').val(data.monthIncome); // 月收入金额
                    $("select#marryStatus").next().find("dd[lay-value=" + data.marryStatus + "]").click(); // 婚姻状况
                    data.marryCert == null ? $('#marryCert').attr({'display': 'none'}) : $('#marryCert').attr({'src': data.marryCert}); // 婚姻证明
            //        data.approveStatus = '0', // 审核状;
                        $('#spouseName').val(data.spouseName); // 配偶姓名
                    $('#spouseMobile').val(data.spouseMobile); // 配偶电话
                    $('#spouseCertNo').val(data.spouseCertNo);  // 配偶身份证号码
                    data.spouseCertFront == null ? $('#spouseCertFront').attr({'display': 'none'}) : $('#spouseCertFront').attr({'src': data.spouseCertFront}); // 配偶身份证正面
                    data.spouseCertBack == null ? $('#spouseCertBack').attr({'display': 'none'}) : $('#spouseCertBack').attr({'src': data.spouseCertBack});//配偶身份证反面
                    $("select#mainProperty").next().find("dd[lay-value=" + data.mainProperty + "]").click();// 主体性质
                    $('#motelName').val(data.motelName); // 客栈名称
                    $('#motelAssets').val(data.motelAssets); // 客栈详细地址
                    $('#motelRoomQuantity').val(data.motelRoomQuantity); // 客栈的房间数
                    $('#motelCertNo').val(data.motelCertNo);            // 营业执照号码
                    data.motelCert == null ? $('#motelCert').attr({'display': 'none'}) : $('#motelCert').attr({'src': data.motelCert}); // 营业执照照片
                    $('#motelBusinessScale').val(data.motelBusinessScale); //  客栈经营范围
                    data.motelPic == null ? $('#motelPic').attr({'display': 'none'}) : $('#motelPic').attr({'src': data.motelPic}); // 客栈照片
                    $('#motelProvice').val(data.motelProvice); // 客栈所在省;
                    $('#motelCity').val(data.motelCity); // 客栈所在市;
                    $('#motelArea').val(data.motelArea);// 客栈所在区;
                    $('#motelAddress').val(data.motelAddress); // 客栈详细地址
                    $('#leftRentYear').val(data.leftRentYear);  // 剩余租期
                    $("select#resaleFeeFlag").next().find("dd[lay-value=" + data.resaleFeeFlag + "]").click(); //转让费类型
                    $("select#monthIncomeType").next().find("dd[lay-value=" + data.monthIncomeType + "]").click(); // 其他收入类型
                    $('#resaleFee').val(data.resaleFee);  // 装让费金额
                    $('#occupieRate').val(data.occupieRate); // 入住率
                    $('#motelMonthIncome').val(data.motelMonthIncome);  // 客栈月收入
                    $('#roomMonthIncome').val(data.roomMonthIncome);   // 客房月收入
                    $('#landlordName').val(data.landlordName);          // 房东姓名
                    $('#rentStartDate').val(fmtDate(data.rentStartDate));        // 房租起始日
                    $('#rentEndDate').val(fmtDate(data.rentEndDate));            // 剩余租期
                    $('#leftPaidRentalMonth').val(data.leftPaidRentalMonth); // 已支付房租剩余期限
                    $("select#rentPaymentOption").next().find("dd[lay-value=" + data.rentPaymentOption + "]").click(); // 房租交付方式
                    $('#rentPerYear').val(data.rentPerYear);
                        $('#deposit').val(data.deposit);
                    data.rentContract == null ? $('#rentContract').attr({'display': 'none'}) : $('#rentContract').attr({'src': data.rentContract})
                    $('#accountName').val(data.accountName);        // 户名
                    $('#openBank').val(data.openBank);              // 开户行
                    $('#bankAccount').val(data.bankAccount);
                    data.cardFront == null ? $('#cardFront').attr({'display': 'none'}) : $('#cardFront').attr({'src': data.cardFront});
                    data.cardFront == null ? $('#cardBack').attr({'display': 'none'}) : $('#cardBack').attr({'src': data.cardBack});
                    $("select#educationDegree").next().find("dd[lay-value=" + data.educationDegree + "]").click(); //学历情况
                    $('#workExperiences').val(data.workExperiences);
                    $('#otherJobs').val(data.otherJobs);
                    $("select#personalHealth").next().find("dd[lay-value=" + data.personalHealth + "]").click(); // 个人健康程度
                    $("select#preWorkspace").next().find("dd[lay-value=" + data.preWorkspace + "]").click();  // 上一单位性质及职务
                    $('#bondsman').val(data.bondsman);  // 担保人
                    $('#averageCommision').val(data.averageCommision); // 平均月收入
                    $('#onlinePercentage').val(data.onlinePercentage);  // 客栈客源线上占比
                    $('#offlinePercentage').val(data.offlinePercentage);    // 客栈客源线下占比
                    $('#residenceYear').val(data.residenceYear);            // 当地居住年限
                    $('#houseAddress').val(data.houseAddress);              // 房子所在地
                    $('#houseSquare').val(data.houseSquare);                // 房子面积
                    $('#houseFloors').val(data.houseFloors);                // 房子楼层
                    $("select#houseDecoLevel").next().find("dd[lay-value=" + data.houseDecoLevel + "]").click(); // 装修程度
                    $("select#ifnotLoan").next().find("dd[lay-value=" + data.ifnotLoan + "]").click();   // 房子是否贷款
                    $('#loanAmt').val(data.loanAmt);                        // 贷款金额
                    $('#loanStartDate').val(data.loanStartDate);               // 贷款时间
                    $('#loanDuration').val(data.loanDuration);                  // 贷款期限 （月）
                    $('#loanPaymentOption').val(data.loanPaymentOption);           // 贷款还款方式
                    data.housePic == null ? $('#housePic').attr({'display': 'none'}) : $('#housePic').attr({'src': data.housePic}); // 房屋证明
                    data.houseCertPic == null ? $('#houseCertPic').attr({'display': 'none'}) : $('#houseCertPic').attr({'src': data.houseCertPic}); // 房产证明
                    $('#carAddress').val(data.carAddress);                      // 车子所在地
                    $('#carCatelog').val(data.carCatelog);                      // 车子型号
                    $('#platesStartDate').val(fmtDate(data.platesStartDate));            // 上牌时间
                    $('#driverKm').val(data.driverKm);                          // 驾驶里程
                    if(data.carIfnotLoan === ''){
                        data.carIfnotLoan == null;
                    }else{
                        $("select#carIfnotLoan").next().find("dd[lay-value=" + data.carIfnotLoan + "]").click();    // 车子是否贷款
                    }
                    $('#carloanAmt').val(data.carloanAmt);          // 贷款金额
                    $('#carLoanStartDate').val(data.carLoanStartDate);      // 贷款时间
                    $('#carLoanDuration').val(data.carLoanDuration);       // 还款方式
                    $('#carLoanPaymentOption').val(data.carLoanPaymentOption); // 还款方式
                    data.carPic == null ? $('#carPic').attr({'display': 'none'}) : $('#carPic').attr({'src': data.carPic}); // 车子照片
                    data.carCertPic == null ? $('#carCertPic').attr({'display': 'none'}) : $('#carCertPic').attr({'src': data.carCertPic});  // 驾驶证照片
                    console.log('=======')
                    if (data.personalIncome) {
                        for (let i = 0; i < data.personalIncome.length; i++) {
                            if (data.personalIncome.length > 0) {
                                $($('.weixinPhoto')[0]).hide();
                                $('#weixinPhoto')[0].innerHTML += '<div class="layui-upload-list"><img class="layui-upload-img" src="' + data.personalIncome[i] +'"> </div>'
                            }
                        }
                    }
                    if (data.innIncome) {
                        for (let i = 0; i < data.innIncome.length; i++) {
                            if (data.innIncome.length > 0) {
                                $($('.incomePhoto')[0]).hide();
                                $('#incomePhoto')[0].innerHTML += '<div class="layui-upload-list"><img class="layui-upload-img" src="' + data.innIncome[i] + '"></div>'
                            }
                        }
                    }
                    if (data.hydroelectric) {
                        for (let i = 0; i < data.hydroelectric.length; i++) {
                            $($('.payPhoto')[0]).hide();
                            $('#payPhoto')[0].innerHTML += '<div class="layui-upload-list"> <img class="layui-upload-img" src="' + data.hydroelectric[i] + '"></div>'
                        }
                    }
                    if (data.energy) {
                        for (let i = 0; i < data.energy.length; i++) {
                            $($('.energyphoto')[0]).hide();
                            $('#energyphoto')[0].innerHTML += ' <div class="layui-upload-list"><img class="layui-upload-img" src="' + data.energy[i] + '"></div>'
                        }
                    }
                    if (data.waterPayment) {
                        for (let i = 0; i < data.waterPayment.length; i++) {
                            $($('.payFeesPhoto')[0]).hide();
                            $('#payFeesPhoto')[0].innerHTML += ' <div class="layui-upload-list"><img class="layui-upload-img" src="' + data.waterPayment[i] + '"></div>'
                        }
                    }
                    if (data.energyPayment) {
                        for (let i = 0; i < data.energyPayment.length; i++) {
                            $($('.ChargePhoto')[0]).hide();
                            $('#ChargePhoto')[0].innerHTML += ' <div class="layui-upload-list"><img class="layui-upload-img" src="' + data.energyPayment[i] + '"></div>'
                        }
                    }
                    if (data.otherPhoto) {
                        for (let i = 0; i < data.otherPhoto.length; i++) {
                            $($('.sanitationPhoto')[0]).hide();
                            $('#sanitationPhoto')[0].innerHTML += ' <div class="layui-upload-list"><img class="layui-upload-img" src="' + data.otherPhoto[i] + '"></div>'
                        }
                    }

                }, "json");
            disabledhtml();  // 禁止必填项！！！
            // 请求 市级联动 方法
            $.post(url + "/getAreaInfoList?parentId=1", function(data, err) {
                let motelProviceOption = '';
                for (let i = 0; i < data.length; i++) {
                    motelProviceOption += '  <option value="' + data[i].id + '">' + data[i].areaName + '</option>'
                    $('#motelProvice').html('<option value="">请选择省</option>' + motelProviceOption);
                    form.render('select'); //这个很重要
                }
            }, "json");
        };

        form.on('select(motelProvice)', function(d) {
            $.post(url + "/getAreaInfoList?parentId=" + d.value, function(data, err) {
                let motelCityOption = '';
                for (let i = 0; i < data.length; i++) {
                    motelCityOption += '  <option value="' + data[i].id + '">' + data[i].areaName + '</option>'
                    $('#motelCity').html('<option value="">请选择市</option>' + motelCityOption);
                    form.render('select'); //这个很重要
                }
            }, "json");
        });

        form.on('select(motelCity)', function(d) {
            $.post(url + "/getAreaInfoList?parentId=" + d.value, function(data, err) {
                let motelAreaOption = '';
                for (let i = 0; i < data.length; i++) {
                    motelAreaOption += '  <option value="' + data[i].id + '">' + data[i].areaName + '</option>'
                    $('#motelArea').html('<option value="">请选择区</option>' + motelAreaOption);
                    form.render('select'); //这个很重要
                }
            }, "json");
        })

    });
    window.addCustomer = function() {
        $('#customerCooperation')[0].innerHTML += '<div class="layui-col-md"><input type="text" name="" required lay-verify="required" class="layui-input" placeholder="请输入客户合作方"><i class="layui-icon" style="font-size: 30px; color: red;" onclick="deleteFather(this)">&#x1006;</i></div>'
    };
    window.addTourism = function() {
        $('#tourismCooperation')[0].innerHTML += '<div class="layui-col-md"><input type="text" name="" required lay-verify="required" class="layui-input" placeholder="请输入客源合作方"><i class="layui-icon" style="font-size: 30px; color: red;" onclick="deleteFather(this)">&#x1006;</i></div>'
    };
    window.updatafile = function() {
        let strcustomer = '';
        let strtourism = '';
        let customerCooperation = $('#customerCooperation div');
        let tourismCooperation = $('#tourismCooperation div');
        for (let i = 0; i < customerCooperation.length; i++) {
            strcustomer += $(customerCooperation[i]).children('input').val() + ';'
        }
        for (let i = 0; i < tourismCooperation.length; i++) {
            strtourism += $(tourismCooperation[i]).children('input').val() + ';'
        }
        const private = {
            userId: getCookie("userName"),
            userName: $('#userName').val(),
            certNo: $('#id_card').val(),
            mobile: $('#phone_number').val(),
            relativeMobile: $('#relativeMobile').val(),
            friendMobile: $('#friendMobile').val(),
            companyTelephone: $('#companyTelephone').val(),
            certFront: $('#certFront').attr('src'),
            certBack: $('#certBack').attr('src'),
            monthIncome: $('#monthIncome').val(),
            marryStatus: $('#marryStatus').val(),
            marryCert: $('#marryCert').attr('src'),
            approveStatus: '0', // 审核状态
            spouseName: $('#spouseName').val(),
            spouseMobile: $('#spouseMobile').val(),
            spouseCertNo: $('#spouseCertNo').val(),
            referencePictures: $('#referencePictures').attr('src'),
            spouseCertFront: $('#spouseCertBack').attr('src'), // 配偶身份证正面
            spouseCertBack: $('#spouseCertBack').attr('src'), //配偶身份证反面
            motelName: $('#motelName').val(),
            motelAssets: $('#motelAssets').val(),
            motelRoomQuantity: $('#motelRoomQuantity').val(),
            motelCertNo: $('#motelCertNo').val(),
            motelCert: $('#motelCert').attr('src'),
            motelBusinessScale: $('#motelBusinessScale').val(),
            motelPic: $('#motelPic').attr('src'),
            motelProvice: $('#motelProvice').val(), // 客栈所在省份
            motelCity: $('#motelCity').val(), // 客栈所在市
            motelArea: $('#motelArea').val(), // 客栈所在区
            motelAddress: $('#motelAddress').val(), // 客栈详细地址
            leftPaidRentalMonth: $('#leftPaidRentalMonth').val(), // 已支付房租剩余期限
            leftRentYear: $('#leftRentYear').val(),
            loanDuration: $('#loanDuration').val(),
            loanPaymentOption: $('#loanPaymentOption').val(),
            monthIncomeType: $('#monthIncomeType').val(),
            resaleFeeFlag: $('#resaleFeeFlag').val(),
            occupieRate: $('#occupieRate').val(),
            motelMonthIncome: $('#motelMonthIncome').val(),
            roomMonthIncome: $('#roomMonthIncome').val(),
            landlordName: $('#landlordName').val(),
            mainProperty: $('#mainProperty').val(),
            rentStartDate: $('#rentStartDate').val(),
            resaleFee: $('#resaleFee').val(),
            rentEndDate: $('#rentEndDate').val(),
            rentPaymentOption: $('#rentPaymentOption').val(),
            rentPerYear: $('#rentPerYear').val(),
            reMark: '', // 审核备注
            deposit: $('#deposit').val(),
            rentContract: $('#rentContract').attr('src'),

            accountName: $('#accountName').val(),
            openBank: $('#openBank').val(),
            bankAccount: $('#bankAccount').val(),
            cardFront: $('#cardFront').attr('src'),
            cardBack: $('#cardBack').attr('src'),

            educationDegree: $('#educationDegree').val(),
            workExperiences: $('#workExperiences').val(),
            otherJobs: $('#otherJobs').val(),
            personalHealth: $('#personalHealth').val(),
            preWorkspace: $('#preWorkspace').val(),


            customerCooperation: strcustomer,
            tourismCooperation: strtourism,
            bondsman: $('#bondsman').val(),
            averageCommision: $('#averageCommision').val(),
            onlinePercentage: $('#onlinePercentage').val(),
            offlinePercentage: $('#offlinePercentage').val(),
            residenceYear: $('#residenceYear').val(),

            houseAddress: $('#houseAddress').val(),
            houseSquare: $('#houseSquare').val(),
            houseFloors: $('#houseFloors').val(),
            houseDecoLevel: $('#houseDecoLevel').val(),
            ifnotLoan: $('#ifnotLoan').val(),
            loanAmt: $('#loanAmt').val(),
            loanStartDate: $('#loanStartDate').val(),
            housePic: $('#housePic').attr('src'),
            houseCertPic: $('#houseCertPic').attr('src'),

            carAddress: $('#carAddress').val(),
            carCatelog: $('#carCatelog').val(),
            platesStartDate: $('#platesStartDate').val(),
            driverKm: $('#driverKm').val(),
            carIfnotLoan: $('#carIfnotLoan').val(),
            carloanAmt: $('#carloanAmt').val(),
            carLoanStartDate: $('#carLoanStartDate').val(),
            carLoanDuration: $('#carLoanDuration').val(),
            carLoanPaymentOption: $('#carLoanPaymentOption').val(),
            carPic: $('#carPic').attr('src'), // 车子照片
            carCertPic: $('#carCertPic').attr('src'),// 行车证照片
            //  以下 是多张照片上传时的数组字段
            personalIncome: [],
            innIncome: [],
            hydroelectric: [],
            energy: [],
            waterPayment: [],
            energyPayment: [],
            otherPhoto: []
        };
        getImgArr('weixinPhoto', function(imgSrc) {
            if (imgSrc) {
                private.personalIncome.push(imgSrc)
            }
        });
        getImgArr('incomPhoto', function(imgSrc) {
            if (imgSrc) {
                private.innIncome.push(imgSrc)
            }
        });
        getImgArr('payPhoto', function(imgSrc) {
            if (imgSrc) {
                private.hydroelectric.push(imgSrc)
            }
        });
        getImgArr('energyphoto', function(imgSrc) {
            if (imgSrc) {
                private.energy.push(imgSrc)
            }
        });
        getImgArr('payFeesPhoto', function(imgSrc) {
            if (imgSrc) {
                private.waterPayment.push(imgSrc)
            }
        });
        getImgArr('ChargePhoto', function(imgSrc) {
            if (imgSrc) {
                private.energyPayment.push(imgSrc)
            }
        });
        getImgArr('sanitationPhoto', function(imgSrc) {
            if (imgSrc) {
                private.otherPhoto.push(imgSrc)
            }
        });
        let searchUrl = encodeURI("./hexagram.html?userName=" + private.userName + '&' + 'certNo=' + private.certNo + '&' + 'mobile=' + private.mobile + '&' + 'motelName=' + private.motelName + '&' + 'friendMobile=' + private.friendMobile + '&' + 'averageCommision=' + private.monthIncome + '&' + 'userId=' + private.userId);
        if ($('#updatabtn').text() === '立即提交') {
            $.ajax({
                url: url + '/addMerchantInfo',
                type: 'post', // IE必须加上post
                dataType: 'json',
                timeout: 1000 * 60,
                async: false,// 同步执行
                data: JSON.stringify(private),
                contentType: 'application/json;charset=UTF-8',
                success: function(result) {
                    if (result === true) {
                        window.location.href = searchUrl;
                    } else {
                        console.log(result);
                    }
                },
                error: function(request, status, e) {
                }
            });
        } else if ($('#updatabtn').text() === '确认修改') {
            $.ajax({
                url: url + '/updateMerchantInfo',
                type: 'post', // IE必须加上post
                dataType: 'json',
                timeout: 1000 * 60,
                async: false,// 同步执行
                data: JSON.stringify(private),
                contentType: 'application/json;charset=UTF-8',
                success: function(result) {
                    if (result === true) {
                        window.location.href = searchUrl;
                    } else {
                        console.log(result);
                    }
                },
                error: function(request, status, e) {
                    alert(status + '输入有误，请检查输入');
                }
            });
        } else {
            console.log($('#updatabtn').text())
        }
    };

    /**
     * 选择图片方法
     * @param {object} obj  点击上传的按钮
     * @param {string} imgID  需要显示的容器
     */
    window.choosephoto = function(obj, imgID, judge) {
        $(obj).next().click();
        $(obj).next().change(function() {
            let file = this.files;
            for (let i = 0; i < file.length; i++) {
                if (window.FileReader) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file[i]);
                    //监听文件读取结束后事件
                    reader.onloadend = function(e) {
                        if (judge) {
                            $($('.' + imgID)[0]).remove();
                            dealImage(this.result, {width: 200, height: 200}, function(base) {
                                $('#' + imgID)[0].innerHTML += '<div class="layui-upload-list"><img src="' + base + '" class="layui-upload-img"/><button class="layui-btn layui-btn-mini delete layui-btn-danger" onclick="deleteFather(this)">删除</button></div>';
                            })
                        } else {
                            dealImage(e.target.result, {width: 200, height: 200}, function(base) {
                                $('#' + imgID).attr("src", base)
                            })
                        }

                    };
                }
            }
        })
    };

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

    /**传入需要获取的元素内的图片地址的父元素 循环获得该元素内的所有图片地址
     * @param {Object} obj  // 需要获取图片的父元素
     * @param {function} callback // 回掉函数
     */
    function getImgArr(obj, callback) {
        for (let i = 0; i < $('#' + obj).children().length; i++) {
            let imgSrc = $($('#' + obj).children()[i]).children().attr("src");
            callback(imgSrc)
        }
    }

    window.deleteFather = function(obj) {
        $(obj).parent().remove();
    };

    function fmtDate(obj) {
        if (obj) {
            let date = new Date(obj);
            let y = 1900 + date.getYear();
            let m = "0" + (date.getMonth() + 1);
            let d = "0" + date.getDate();
            return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
        }
    }

    function disabledhtml() {
        let allInput = $('.requiredFields input');
        // let allSelect = $('.requiredFields select');
        allInput.attr({'disabled': 'disabled'});
        allInput.css({'color': 'red'});
        // allSelect.attr({'disabled': 'disabled'});
    }
})();