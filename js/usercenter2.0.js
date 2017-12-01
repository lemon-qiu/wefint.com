window.onload = function() {
    var userId = getCookie('userName');
    /**
     * 个人信息
     */
    /*$.ajax({
        url:getUrl(5)+ '/finance/getUserBaseInfoByUserId',
        data:{userId: userId},
        method:'get',
        cache: true,
        async: false,
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        headers: {'wefinttoken': getCookie('token')},
        error:function(result) {
            alert('请求失败，请刷新页面。');
        },
        success:function(result) {
            if(result.code === '000000'){
                var datas = result.data;
                $('#userName').val(datas.userName);//姓名
                $('#mobile').val(datas.mobile);//手机号
                $('#certNo').val(datas.certNo);//身份证号
                $('#monthIncome').val(datas.monthIncome);//家庭月收入
                $('#relativeMobile').val(datas.relativeMobile);//亲属电话
                $('#companyTelephone').val(datas.companyTelephone);//公司电话
                $('#friendMobile').val(datas.friendMobile);//朋友电话
                getImg('certFront',datas.certFront); //身份证正面
                getImg('certBack',datas.certBack); //身份证背面
                getImg('householdRegister',datas.householdRegister); //户口簿照片

            }else {
                alert('请求失败，请刷新页面。');
            }
        }
    })*/

    /****经营状况***/
    /*$.ajax({
        url:getUrl(5)+ '/finance/getUserBaseInfoByUserId',
        data:{userId: userId},
        method:'get',
        cache: true,
        async: false,
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        headers: {'wefinttoken': getCookie('token')},
        error:function(result) {
            alert('请求失败，请刷新页面。');
        },
        success:function(result) {
            if(result.code === '000000'){
                var datas = result.data;
                $('#motelMonthIncome').val(datas.motelMonthIncome);//客栈月收入
                $('#roomMonthIncome').val(datas.roomMonthIncome);//客房月收入
                getImg('personalIncome',datas.personalIncome); //月流水收入证明
                getImg('hydroelectric',datas.hydroelectric); //近三个月水费
                getImg('energy',datas.energy); //近三个月电费
                getImg('incomePhoto',datas.incomePhoto); //客房月收入证明
            }else {
                alert('请求失败，请刷新页面。');
            }
        }
    })*/

    /****婚姻状况***/
    $.ajax({
        url:getUrl(5)+ '/finance/getMaritalStatusoByUserId',
        data:{userId: userId},
        method:'get',
        cache: true,
        async: false,
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        headers: {'wefinttoken': getCookie('token')},
        error:function(result) {
            alert('请求失败，请刷新页面。');
        },
        success:function(result) {
            if(result.code === '000000'){
                var datas = result.data;
                clickSelect(datas.maritalStatus,'maritalStatus');//婚姻状况
                $('#spouseName').val(datas.spouseName);//配偶姓名
                $('#spouseMobile').val(datas.spouseMobile);//配偶联系电话
                $('#spouseCertNo').val(datas.spouseCertNo);//配偶身份证
                getImg('marriageCertificate',datas.marriageCertificate); //上传婚姻证
                getImg('spouseCertFront',datas.spouseCertFront); //配偶身份证正面
                getImg('spouseCertBack',datas.spouseCertBack); //配偶身份证背面
            }else {
                alert('请求失败，请刷新页面。');
            }
        }
    })

    function ajaxHttp(url,data,) {
        
    }

    /**
     *  下拉框反显 根据后台数据模拟点击方法
     * @param dataName 后台获取的数据
     * @param idName   需要模拟点击的ID
     */
    function clickSelect(dataName, idName) {
        var JqSelectId = $('select#' + idName);
        if (dataName === '' || dataName === null) {
            dataName = '';
            JqSelectId.next().find("dd[lay-value=" + dataName + "]").click();
        } else {
            JqSelectId.next().find("dd[lay-value=" + dataName + "]").click();
        }
    }

    /**
     * 判断是否有图片，再反显
     * @param imgID 图片名
     * @param imgSrc 返回图片base64
     */
    function getImg(imgID,imgSrc) {
        if(imgSrc){
            if(typeof(imgSrc) === 'string'){
                $('.'+ imgID).hide();
                $('#'+ imgID).prepend('<div class="img-item"><img src="' + imgSrc + '" class="upload-img"><i class="iconfont icon-zliconwrong01" onclick="deleteFather(\''+ imgID + '\',this)"></i></div>');
            }else if(typeof(imgSrc) === 'object'){
                var len = imgSrc.length;
                for(var i = 0;i<len;i++){
                    $('#'+ imgID).prepend('<div class="img-item"><img src="' + imgSrc[i] + '" class="upload-img"><i class="iconfont icon-zliconwrong01" onclick="deleteFather(\''+ imgID + '\',this)"></i></div>');
                }
            }
        }
    }
}

$(function() {
    var userId = getCookie('userName');
    layui.use(['laydate', 'form', 'layedit', 'jquery'], function() {
        var laydate = layui.laydate
            , form = layui.form
            , layer = layui.layer;

        //layui.on('select()')

        /**
         * 个人信息保存
         */
        form.on('submit(saveInfo)',function(data) {
            var datas = {
                userId: userId,
                userName: $('#userName').val(),
                mobile: $('#mobile').val(),
                certNo: $('#certNo').val(),
                monthIncome: $('#monthIncome').val(),
                relativeMobile: $('#relativeMobile').val(),
                companyTelephone: $('#companyTelephone').val(),
                friendMobile: $('#friendMobile').val(),
                certFront: $('#certFront img').attr('src'),
                certBack: $('#certBack img').attr('src'),
                householdRegister: $('#householdRegister img').attr('src'),
            }
            var Data = JSON.stringify(datas);
            $.ajax({
                url:getUrl(5)+ '/finance/saveOrUpdateUserBaseInfo',
                data:Data,
                method:'post',
                cache: true,
                async: false,
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                headers: {'wefinttoken': getCookie('token')},
                error:function(result) {
                    alert('请求失败，请重试。');
                },
                success:function(result) {
                    if(result.code === '000000'){
                        layer.msg('保存成功');
                        return false;
                    }else {
                        alert('请求失败，请重试。');
                    }
                }
            })
        })

        /**
         * 经营情况保存
         */
        form.on('submit(saveBusinessCase)',function(data) {
            var datas = {
                userId: userId,
                userName: $('#motelMonthIncome').val(),
                mobile: $('#roomMonthIncome').val(),
                householdRegister: getImgArr('householdRegister'),
                hydroelectric: getImgArr('hydroelectric'),
                energy: getImgArr('energy'),
                incomePhoto: getImgArr('incomePhoto')
            }
            var Data = JSON.stringify(datas);
            $.ajax({
                url:getUrl(5)+ '/finance/saveOrUpdateUserBaseInfo',
                data:Data,
                method:'post',
                cache: true,
                async: false,
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                headers: {'wefinttoken': getCookie('token')},
                error:function(result) {
                    alert('请求失败，请重试。');
                },
                success:function(result) {
                    if(result.code === '000000'){
                        layer.msg('保存成功');
                        return false;
                    }else {
                        alert('请求失败，请重试。');
                    }
                }
            })
            return false;
        })

        /**
         * 婚姻情况保存
         */
        form.on('submit(marriageInfo)',function(data) {
            var datas = {
                userId: userId,
                maritalStatus: $('#maritalStatus').val(),
                spouseName: $('#spouseName').val(),
                spouseMobile: $('#spouseMobile').val(),
                spouseCertNo: $('#spouseCertNo').val(),
                marriageCertificate: $('#marriageCertificate img').attr('src'),
                spouseCertFront: $('#spouseCertFront img').attr('src'),
                spouseCertBack: $('#spouseCertBack img').attr('src')
            }
            var Data = JSON.stringify(datas);
            $.ajax({
                url:getUrl(5)+ '/finance/saveOrUpdateMaritalStatus',
                data:Data,
                method:'post',
                cache: true,
                async: false,
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                headers: {'wefinttoken': getCookie('token')},
                error:function(result) {
                    alert('请求失败，请重试。');
                },
                success:function(result) {
                    if(result.code === '000000'){
                        layer.msg('保存成功');
                        return false;
                    }else {
                        alert('请求失败，请重试。');
                    }
                }
            })
        })

    });

    /**
     * 传入需要获取的元素内的图片地址的父元素 循环获得该元素内的所有图片地址
     * 返回图片数组
     * @param {Object} obj  // 需要获取图片的父元素
     */
    function getImgArr(obj) {
        var JqId = $('#' + obj),imgArray = [];
        for (let i = 0; i < JqId.children().length; i++) {
            let imgSrc = $(JqId.children()[i]).children().attr("src");
            if (imgSrc !== null || imgSrc !== '' || imgSrc !== undefined) {
                imgArray.push(imgSrc);
            }
        }
        return imgArray;
    }


})


/**
 *  图片上传
 * @param {object} obj 点击对象
 * @param {string} imgID 图片名字
 * @param {boolean}judge true多张上传，不填单张上传
 */
window.choosephoto = function(obj, imgID, judge) {
    $(obj).next().click();
    $(obj).next().unbind('change').bind('change',function() {
        var file = this.files;
        for (var i = 0; i < file.length; i++) {
            if (window.FileReader) {
                var reader = new FileReader();
                reader.readAsDataURL(file[i]);
                //监听文件读取结束后事件
                reader.onloadend = function(e) {
                    if (judge) {
                        console.log(imgID);
                        dealImage(this.result, {width: 173, height: 128}, function(base) {
                            $('#' + imgID)[0].innerHTML += '<div class="img-item"><img src="' + base + '" class="upload-img"><i class="iconfont icon-zliconwrong01" onclick="deleteFather(\''+ imgID + '\',this)"></i></div>';
                        })
                    } else {
                        dealImage(e.target.result, {width: 173, height: 128}, function(base) {
                            $(obj).hide();
                            $('#' + imgID).prepend('<div class="img-item"><img src="' + base + '" class="upload-img"><i class="iconfont icon-zliconwrong01" onclick="deleteFather(\''+ imgID + '\',this)"></i></div>');
                        })
                    }
                };
            }
        }
        return false;
    })
};

/**
 * 将删除该按钮的父节点
 * @param obj  传递的要删除的按钮
 * @returns {string}
 */
window.deleteFather = function(imgID,obj) {
    $('.'+ imgID).show();
    $(obj).parent().remove();
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


