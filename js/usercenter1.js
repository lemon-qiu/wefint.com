/**
 * @Created with fly.
 * @User: z1163764648.com
 * @Date: 2017/11/6
 * @Time: 16:57
 */
(function() {
    let   approveStatuscall ='';
    layui.use(['laydate', 'form', 'layedit', 'jquery'], function() {
        let laydate = layui.laydate
            , form = layui.form
            , layer = layui.layer
        /**
         * layui 渲染时间控件的方法
         */
        laydate.render({
            elem: '#rentStartDate'
        });
        laydate.render({
            elem: '#rentEndDate'
        });
        laydate.render({
            elem: '#platesStartDate'
        });
        laydate.render({
            elem: '#carLoanStartDate'
        });
        laydate.render({
            elem: '#loanStartDate'
        });
        /**
         *  layui 渲染下拉框选择状态的方法
         */
        form.on('select(marryStatus)', function(d) {
            let marryed = $('.marryed');
            if (d.value > 1) {
                marryed.nextAll().hide();
                $(marryed[1]).hide();
                $('.closequire').attr({'lay-verify':''})
            } else {
                marryed.nextAll().show();
                $(marryed[1]).show();
                $('.closequire').attr({'lay-verify':'required'})
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
        form.on('select(resaleFeeFlag)', function(d) {
            if (parseInt(d.value) === 0) {
                $('#resaleFee').attr({'placeholder': '请输入转让费金额（元）'})
            } else if (parseInt(d.value) === 1) {
                $('#resaleFee').attr({'placeholder': '请输入转让费金额（百分比）'})
            }
        });
        // 页面加载时处理的方法  检查审核状态 根据状态处理
        window.onload = function() {
            $('#cuowu').hide();
            let userId = getCookie("userName");
            $.post(url + "/getMerchantInfoByUserId", {userId: userId},
                /**
                 *  通过ajax调用根据传回的数据做页面展示的处理
                 * @param data  传回的数据
                 * @param err
                 */
                function(data, err) {
                    approveStatuscall = data.approveStatus;
                    // @param searchUrl   定义需要跳转的页面 特别是参数需要注意
                    let searchUrl = encodeURI("./hexagram.html?userName=" + data.userName + '&' + 'certNo=' + data.certNo + '&' + 'mobile=' + data.mobile + '&' + 'motelName=' + data.motelName + '&' + 'friendMobile=' + data.friendMobile + '&' + 'averageCommision=' + data.monthIncome + '&' + 'userId=' + userId);
                    // 获取全局的按钮
                    let HTMLALLBUTTON = $('button');    // 获取全局所有的按钮
                    let HTMLALLINPUT = $('input');      // 获取全局所有的输入框
                    // 定义审核的状态
                   // checkPageStatus(data.approveStatus, HTMLALLINPUT, HTMLALLBUTTON, searchUrl);  //检查页面状态 根据不同状态 显示不同效果
                    let strcustomer = data.customerCooperation;
                    let strtourism = data.tourismCooperation;
                    if (strcustomer) {   // 客户合作方
                        getStrcustList(strcustomer, 'customerCooperation');
                    }
                    if (strtourism) {   // 客源合作方
                        getStrcustList(strtourism, 'tourismCooperation');
                    }
                    $('#userName').val(data.userName);   //用户名
                    $('#id_card').val(data.certNo);   // 身份证号码
                    $('#phone_number').val(data.mobile); // 电话号码
                    $('#relativeMobile').val(data.relativeMobile); // 亲属电话号码
                    $('#friendMobile').val(data.friendMobile);     // 朋友电话号码
                    $('#companyTelephone').val(data.companyTelephone); // 公司电话·号码
                    getOnePhoto(data.certFront, 'certFront');//省份证正面
                    getOnePhoto(data.certBack, 'certBack'); //省份证反面
                    getOnePhoto(data.householdRegister, 'householdRegister');// 户口簿照片

                    $('#monthIncome').val(data.monthIncome); // 月收入金额
                    clickSelect(data.marryStatus, 'marryStatus'); // 婚姻状况
                    getOnePhoto(data.marryCert, 'marryCert'); // 婚姻证明
                    // data.approveStatus = '0'; // 审核状;
                    $('#spouseName').val(data.spouseName); // 配偶姓名
                    $('#spouseMobile').val(data.spouseMobile); // 配偶电话
                    $('#spouseCertNo').val(data.spouseCertNo);  // 配偶身份证号码
                    getOnePhoto(data.spouseCertFront, 'spouseCertFront'); // 配偶身份证正面
                    getOnePhoto(data.spouseCertBack, 'spouseCertBack');//配偶身份证反面

                    clickSelect(data.mainProperty, 'mainProperty'); // 主体性质
                    $('#motelName').val(data.motelName); // 客栈名称
                    $('#motelAssets').val(data.motelAssets); // 客栈详细地址
                    $('#motelRoomQuantity').val(data.motelRoomQuantity); // 客栈的房间数
                    $('#motelCertNo').val(data.motelCertNo);            // 营业执照号码
                    getOnePhoto(data.motelCert, 'motelCert'); // 营业执照照片
                    $('#motelBusinessScale').val(data.motelBusinessScale); //  客栈经营范围
                    getOnePhoto(data.motelPic, 'motelPic'); // 客栈照片
                    clickSelect(data.motelProvice, 'motelProvice'); // 客栈所在省;
                    linkageToChoose('motelProvice',data.motelCity,'motelCity',data.motelArea,'motelArea'); // 省市联动选择的方法
                    $('#motelAddress').val(data.motelAddress); // 客栈详细地址
                    $('#leftRentYear').val(data.leftRentYear);  // 剩余租期
                    clickSelect(data.resaleFeeFlag, 'resaleFeeFlag'); //转让费类型
                    clickSelect(data.monthIncomeType, 'monthIncomeType'); // 其他收入类型
                    $('#resaleFee').val(data.resaleFee);  // 装让费金额
                    $('#occupieRate').val(data.occupieRate); // 入住率
                    $('#motelMonthIncome').val(data.motelMonthIncome);  // 客栈月收入
                    $('#roomMonthIncome').val(data.roomMonthIncome);   // 客房月收入
                    $('#landlordName').val(data.landlordName);          // 房东姓名
                    $('#rentStartDate').val(fmtDate(data.rentStartDate));        // 房租起始日
                    $('#rentEndDate').val(fmtDate(data.rentEndDate));            // 剩余租期
                    $('#leftPaidRentalMonth').val(data.leftPaidRentalMonth); // 已支付房租剩余期限
                    clickSelect(data.rentPaymentOption, 'rentPaymentOption'); // 房租交付方式
                    $('#rentPerYear').val(data.rentPerYear);                // 每年房租价格
                    data.reMark = ''; // 审核备;
                    $('#deposit').val(data.deposit); // 以支付押金
                    getOnePhoto(data.rentContract, 'rentContract'); // 原始租赁合同
                    $('#accountName').val(data.accountName);        // 户名
                    $('#openBank').val(data.openBank);              // 开户行
                    $('#bankAccount').val(data.bankAccount);        // 银行卡账号
                    getOnePhoto(data.cardFront, 'cardFront');       // 银行卡正面照片
                    getOnePhoto(data.cardBack, 'cardBack');         // 银行卡反面照片


                    clickSelect(data.educationDegree, 'educationDegree'); //学历情况
                    $('#workExperiences').val(data.workExperiences);
                    $('#otherJobs').val(data.otherJobs);
                    clickSelect(data.personalHealth, 'personalHealth'); // 个人健康程度
                    clickSelect(data.preWorkspace, 'preWorkspace');  // 上一单位性质及职务
                    $('#bondsman').val(data.bondsman);  // 担保人
                    $('#averageCommision').val(data.averageCommision); // 平均月收入
                    $('#onlinePercentage').val(data.onlinePercentage);  // 客栈客源线上占比
                    $('#offlinePercentage').val(data.offlinePercentage);    // 客栈客源线下占比
                    $('#residenceYear').val(data.residenceYear);            // 当地居住年限
                    $('#houseAddress').val(data.houseAddress);              // 房子所在地
                    $('#houseSquare').val(data.houseSquare);                // 房子面积
                    $('#houseFloors').val(data.houseFloors);                // 房子楼层
                    clickSelect(data.houseDecoLevel, 'houseDecoLevel'); // 装修程度
                    clickSelect(data.ifnotLoan, 'ifnotLoan'); // 房子是否贷款
                    $('#loanAmt').val(data.loanAmt);                        // 贷款金额
                    $('#loanStartDate').val(data.loanStartDate);               // 房子贷款时间
                    $('#loanDuration').val(data.loanDuration);                  // 贷款期限 （月）
                    $('#loanPaymentOption').val(data.loanPaymentOption);           // 贷款还款方式

                    getOnePhoto(data.housePic, 'housePic'); // 房屋证明
                    getOnePhoto(data.houseCertPic, 'houseCertPic'); // 房产证明
                    $('#carAddress').val(data.carAddress);                      // 车子所在地
                    $('#carCatelog').val(data.carCatelog);                      // 车子型号
                    $('#platesStartDate').val(fmtDate(data.platesStartDate));            // 上牌时间
                    $('#driverKm').val(data.driverKm);// 驾驶里程
                    clickSelect(data.carIfnotLoan, 'carIfnotLoan');
                    $('#carloanAmt').val(data.carloanAmt);          // 贷款金额
                    $('#carLoanStartDate').val(data.carLoanStartDate);      // 车子贷款时间
                    $('#carLoanDuration').val(data.carLoanDuration);       // 还款方式
                    $('#carLoanPaymentOption').val(data.carLoanPaymentOption); // 还款方式
                    getOnePhoto(data.carPic, 'carPic');// 车子照片
                    getOnePhoto(data.carCertPic, 'carCertPic'); // 驾驶证照片
                    $('#perMonthWaterFee').val(data.perMonthWaterFee); // 每月水费
                    $('#perMonthSheetsFee').val(data.perMonthSheetsFee); // 每月布花草费

                    arrPhotoView(data.personalIncome, 'weixinPhoto');
                    arrPhotoView(data.innIncome, 'incomePhoto');
                    arrPhotoView(data.hydroelectric, 'payPhoto');
                    arrPhotoView(data.energy, 'energyphoto');
                    arrPhotoView(data.waterPayment, 'payFeesPhoto');
                    arrPhotoView(data.energyPayment, 'ChargePhoto');
                    arrPhotoView(data.otherPhoto, 'sanitationPhoto');
                }, "json");

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
    /**
     * 添加 客源合作方的方法  是一个循环的list
     */
    window.addCustomer = function() {
        $('#customerCooperation')[0].innerHTML += '<div class="layui-col-md"><input type="text" name="" required lay-verify="required" class="layui-input" placeholder="请输入客户合作方"><i class="layui-icon" style="font-size: 30px; color: red;" onclick="deleteFather(this)">&#x1006;</i></div>'
    };
    window.addTourism = function() {
        $('#tourismCooperation')[0].innerHTML += '<div class="layui-col-md"><input type="text" name="" required lay-verify="required" class="layui-input" placeholder="请输入客源合作方"><i class="layui-icon" style="font-size: 30px; color: red;" onclick="deleteFather(this)">&#x1006;</i></div>'
    };


    /**
     * 定义上传的方法
     */
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
        /**
         *
         * @type {{userId: string, userName: jQuery, certNo: jQuery, mobile: jQuery, relativeMobile: jQuery, friendMobile: jQuery, companyTelephone: jQuery, certFront: jQuery, certBack: jQuery, monthIncome: jQuery, marryStatus: jQuery, marryCert: jQuery, approveStatus: string, spouseName: jQuery, spouseMobile: jQuery, spouseCertNo: jQuery, referencePictures: jQuery, spouseCertFront: jQuery, spouseCertBack: jQuery, motelName: jQuery, motelAssets: jQuery, motelRoomQuantity: jQuery, motelCertNo: jQuery, motelCert: jQuery, motelBusinessScale: jQuery, motelPic: jQuery, motelProvice: jQuery, motelCity: jQuery, motelArea: jQuery, motelAddress: jQuery, leftRentYear: jQuery, leftPaidRentalMonth: jQuery, loanDuration: jQuery, loanPaymentOption: jQuery, monthIncomeType: jQuery, resaleFeeFlag: jQuery, occupieRate: jQuery, motelMonthIncome: jQuery, roomMonthIncome: jQuery, landlordName: jQuery, mainProperty: jQuery, rentStartDate: jQuery, resaleFee: jQuery, rentEndDate: jQuery, rentPaymentOption: jQuery, rentPerYear: jQuery, reMark: string, deposit: jQuery, rentContract: jQuery, accountName: jQuery, openBank: jQuery, bankAccount: jQuery, cardFront: jQuery, cardBack: jQuery, educationDegree: jQuery, workExperiences: jQuery, otherJobs: jQuery, personalHealth: jQuery, preWorkspace: jQuery, customerCooperation: string, tourismCooperation: string, bondsman: jQuery, averageCommision: jQuery, onlinePercentage: jQuery, offlinePercentage: jQuery, residenceYear: jQuery, houseAddress: jQuery, houseSquare: jQuery, houseFloors: jQuery, houseDecoLevel: jQuery, ifnotLoan: jQuery, loanAmt: jQuery, loanStartDate: jQuery, housePic: jQuery, houseCertPic: jQuery, carAddress: jQuery, carCatelog: jQuery, platesStartDate: jQuery, driverKm: jQuery, carIfnotLoan: jQuery, carloanAmt: jQuery, carLoanStartDate: jQuery, carLoanDuration: jQuery, carLoanPaymentOption: jQuery, carPic: jQuery, carCertPic: jQuery, personalIncome: Array, innIncome: Array, hydroelectric: Array, energy: Array, waterPayment: Array, energyPayment: Array, otherPhoto: Array}}
         */
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
            approveStatus:approveStatuscall, // 审核状态
            spouseName: $('#spouseName').val(),
            spouseMobile: $('#spouseMobile').val(),
            spouseCertNo: $('#spouseCertNo').val(),
            householdRegister: $('#householdRegister').attr('src'),
            spouseCertFront: $('#spouseCertFront').attr('src'), // 配偶身份证正面
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
            leftRentYear: $('#leftRentYear').val(),
            leftPaidRentalMonth: $('#leftPaidRentalMonth').val(), // 已支付房租剩余期限
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
            perMonthWaterFee:$('#perMonthWaterFee').val(), // 每月水费
            perMonthSheetsFee:$('#perMonthSheetsFee').val(), // 每月布草花费
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
        getImgArr('weixinPhoto', private.personalIncome);
        getImgArr('incomePhoto', private.innIncome);
        getImgArr('payPhoto', private.hydroelectric);
        getImgArr('energyphoto', private.energy);
        getImgArr('payFeesPhoto', private.waterPayment);
        getImgArr('ChargePhoto', private.energyPayment);
        getImgArr('sanitationPhoto', private.otherPhoto);
        console.log(private);
        // @parmers 定义需要跳转的页面的地址
        let searchUrl = encodeURI("./hexagram.html?userName=" + private.userName + '&' + 'certNo=' + private.certNo + '&' + 'mobile=' + private.mobile + '&' + 'motelName=' + private.motelName + '&' + 'friendMobile=' + private.friendMobile + '&' + 'averageCommision=' + private.monthIncome + '&' + 'userId=' + private.userId);
        let JqUpdatabtn = $('#updatabtn');
        if (JqUpdatabtn.text() === '立即提交') {
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
        } else if (JqUpdatabtn.text() === '确认修改') {
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
            console.log(JqUpdatabtn.text())
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
                            console.log(imgID)
                            $('.' + imgID).remove();
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
     * @param {function} data // 回掉函数
     */
    function getImgArr(obj, data) {
        let JqId = $('#' + obj);
        for (let i = 0; i < JqId.children().length; i++) {
            let imgSrc = $(JqId.children()[i]).children().attr("src");
            if (imgSrc !== null || imgSrc !== undefined) {
                data.push(imgSrc);
            }
        }
    }

    /**
     * 将删除该按钮的父节点
     * @param obj  传递的要删除的按钮
     * @returns {string}
     */
    window.deleteFather = function(obj) {
        $(obj).parent().remove();
    };

    /**
     * 将时间戳转化为标准时间
     * @param obj  传递的时间戳
     * @returns {string}
     */
    function fmtDate(obj) {
        if (obj) {
            let date = new Date(obj);
            let y = 1900 + date.getYear();
            let m = "0" + (date.getMonth() + 1);
            let d = "0" + date.getDate();
            return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
        }
    }
    /**
     * 使用layer的打开模态框的方法
     * @returns {string}
     */
    window.bootProcess = function() {
        layer.open({
            title: '查看注册征信流程',
            type: 1,
            area: ['600px', '800px'],
            btn: ['确认'],
            yes: function(index) {
                layer.close(index);
            },
            content: $('#modal')
        });
    };

    /**
     * 获取后台数据 将内容显示到 固定id下
     * @param strcustName 数据库传递的数据进行处理 转化成数据
     * @param idName  需要显示在当前对象下面
     */
    function getStrcustList(strcustName, idName) {
        let strcustArr = strcustName.split(';');
        let strcustSpring = '';
        for (let i = 0; i < strcustArr.length - 1; i++) {
            strcustSpring += '<div class="layui-col-md"> <input type="text" class="layui-input" value="' + strcustArr[i] + '"></div>';
            $('#' + idName).html(strcustSpring)
        }
    }

    /**
     *  根据后台数据模拟点击方法
     * @param dataName 后台获取的数据
     * @param idName    需要模拟点击的ID
     */
    function clickSelect(dataName, idName) {
        let JqSelectId = $('select#' + idName);
        if (dataName === '') {
            dataName = null;
        } else {
            JqSelectId.next().find("dd[lay-value=" + dataName + "]").click();    // 车子是否贷款
        }
    }

    /**
     * 将后台获取到的数据 判断数据是否为空 如果不为空 就显示到ui
     * @param dataName 后台的数据
     * @param idName  需要显示图片的ID
     */
    function getOnePhoto(dataName, idName) {
        let JqId = $('#' + idName);
        dataName === null ? JqId.attr({'display': 'none'}) : JqId.attr({'src': dataName});
    }

    /**
     * 获取后台的图片数据 循环加载到 当前ID的下面
     * @param dataName 后台数据
     * @param idName  需要显示内容的ID
     */
    function arrPhotoView(dataName, idName) {
        let JqClass = $('.' + idName);
        let JqId = $('#'+idName);
        let innerImgArrUi = '';
        JqClass.remove();
        for(let i = 0; i < dataName.length; i++){
            if(dataName[i]!== null){
                innerImgArrUi += '<div class="layui-upload-list"><img src="' + dataName[i] + '" class="layui-upload-img"/><button class="layui-btn layui-btn-mini delete layui-btn-danger" onclick="deleteFather(this)">删除</button></div>'
                JqId.html(innerImgArrUi)
            }else{
                innerImgArrUi = '<div class="layui-upload-list '+idName+'"><img class="layui-upload-img"></div>'
                JqId.html(innerImgArrUi)
            }
        }

    }

    /**
     * 检查后台传递的状态码 根据不同状态禁用按钮
     * @param dataName 后台数据的状态码
     * @param htmlinput 获取到的所有的input 按钮
     * @param htmlbutton 获取到的所有的 button 按钮
     */
    function checkPageStatus(dataName, htmlinput, htmlbutton, searchUrl) {
        const GETENDTIRELYAPPROVESTAATUS = 4;           // 完全审核通过
        const GETPUTINAPPROVESTATUSONE = 0;             // 一级审核
        const GETPUTINAPPROVESTATUSTWO = 1;             // 二级审核
        const GETPUTINAPPROVESTATUSTHREE = 2;            // 一级驳回
        const GETPUTINAPPROVESTATUSFOUR = 3;             // 二级驳回
        if (dataName === GETENDTIRELYAPPROVESTAATUS) {
            window.location.href = searchUrl;
            for (let i = 0; i < htmlinput.length; i++) {
                $(htmlinput[i]).attr({'disabled': "disabled"})
            }
            for (let i = 0; i < htmlbutton.length; i++) {
                $(htmlbutton[i]).attr({'disabled': "disabled"})
            }
        } else if (dataName === GETPUTINAPPROVESTATUSONE || dataName === GETPUTINAPPROVESTATUSTWO) {
            window.location.href = searchUrl;
            for (let i = 0; i < htmlinput.length; i++) {
                $(htmlinput[i]).attr({'disabled': "disabled"})
            }
            for (let i = 0; i < htmlbutton.length; i++) {
                $(htmlbutton[i]).attr({'disabled': "disabled"})
            }
        } else if (dataName === GETPUTINAPPROVESTATUSTHREE || dataName === GETPUTINAPPROVESTATUSFOUR) {
            // 切换为修改数据的状态
            $('#cuowu').show();
            $('#updatabtn').text('确认修改');
        }
    }
    function linkageToChoose(firstId,secendData,secendId,thereData,thereId) {
        let firstIdJq = $('#' + firstId);
        if(firstIdJq!== ''){
            setTimeout(function() {
                clickSelect(secendData, secendId); // 客栈所在市;
                if($('#'+ secendId)!== ''){
                    setTimeout(function() {
                        clickSelect(thereData, thereId); // 客栈所在区;
                        // let allSelect = $('.requiredFields select');
                        // allSelect.attr({'disabled': 'disabled'});
                        let allInput = $('.requiredFields input');
                        let allButton = $('.requiredFields button');
                        allInput.attr({'disabled': 'disabled'});
                        allButton.attr({'disabled': 'disabled'});
                        allInput.css({'color': 'red'});
                        allInput.click(function() {
                            alert('必填项已经不能修改')
                        });
                        allButton.click(function() {
                            alert('必填项已经不能修改')
                        })
                    },300)
                }
            },100)
        }
    }
})();