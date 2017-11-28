/**
 * @Created with fly.
 * @User: z1163764648.com
 * @Date: 2017/11/14
 * @Time: 12:25
 */
let loanApplication = '';

window.onload = function(e) {
    function GetQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = decodeURI(e.path[0].location.search).substr(1).match(reg);
        if (r !== null) return unescape(r[2]);
    }

    let userId = GetQueryString('userId');
    let appliedAmount = GetQueryString('appliedAmount');
    $.ajax({
        url: url + '/getLoanApplication?userId=' + encodeURIComponent(userId)+ '&' + 'applyAmt=' + appliedAmount,
        method: 'get',
        type: 'json',
        success: function(result) {
            $('#appliedAmount').html(appliedAmount);//申请金额
            if(result.code==='000000'){
                var datas = result.data;
                setData(datas);
            }else if(result.code === 'E000003'){
                alert('申请金额不能为空');
            }
        }
    });
};
function setData(data) {
    $('.userName').html(data.userName);//申请人姓名、权利人
    $('#certNo').html(data.certNo);//身份证号码
    $('.motelName').html(data.motelName);//经营主体名字
    if (parseInt(data.mainProperty) === 0) {  // 主体性质
        $('#mainProperty').text('国有及国家投资企业');
    } else if (parseInt(data.mainProperty) === 1) {
        $('#mainProperty').text('集体企业');
    } else if (parseInt(data.mainProperty) === 2) {
        $('#mainProperty').text('私营企业');
    } else if (parseInt(data.mainProperty) === 3) {
        $('#mainProperty').text('个体工商者');
    }
    $('#spouseName').html(data.spouseName);//配偶姓名
    $('#spouseCertNo').html(data.spouseCertNo);//配偶身份证号
    $('#monthIncome').html(data.monthIncome);//家庭月收入

    $('#motelCertNo').html(data.motelCertNo);//营业执照号
    $('#motelBusinessScale').html(data.motelBusinessScale);//经营范围
    $('#mobile').html(data.mobile);//移动电话

    $('.motelAddress').html(data.motelAddress);//经营所在地、客栈地址
    $('#companyTelephone').html(data.companyTelephone);//公司电话

    switch (data.businessType) {//经营地
        case 0:
            $('#motel').attr('checked', 'checked');
            break;
        case 1:
            $('#store').attr('checked', 'checked');
            break;
    }

    $('#motelAssets').html(data.motelAssets);//客栈/店铺 价值
    $('#motelRoomQuantity').html(data.motelRoomQuantity);//房间数
    var rentStartDate = new Date(data.rentStartDate),
         rentEndDate = new Date(data.rentEndDate);
    $('#rentStartDate').html(rentStartDate.getFullYear() + '年' + (rentStartDate.getMonth()+1) + '月' + rentStartDate.getDate() + '日' );//起租时间
    $('#rentEndDate').html(rentEndDate.getFullYear() + '年' + (rentEndDate.getMonth()+1) + '月' + rentEndDate.getDate() + '日');//到期时间

    $('#accountName').html(data.accountName);//户名
    $('#openBank').html(data.openBank);//开户行
    $('#bankAccount').html(data.bankAccount);//银行账号

    html2canvas(document.body, {
        allowTaint: true,
        taintTest: false,
        onrendered: function(canvas) {
            canvas.id = "mycanvas";
            loanApplication = canvas.toDataURL();
            Storage.loanApplication = loanApplication;
        }
    });
}

//提交同意
$('#agree').on('click', function() {
    $.ajax({
        url: url + +'',
        method: 'post',
        type: 'json',
        data: '',
        success: function(data) {
        }
    });
})

window.disagree = function() {
    parent.document.location.reload()
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