$(function() {
    var getUrl = 'http://119.23.41.105:20000';
    window.onload = function(e) {
        function GetQueryString(name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            let r = decodeURI(e.path[0].location.search).substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }

        var userId = GetQueryString('userId');
        var appliedAmount = GetQueryString('appliedAmount');
        $.ajax({
            url: url + '/getMerchantInfoByUserId?userId=' + userId,
            method: 'get',
            type: 'json',
            success: function(data) {
                $('#appliedAmount').html(appliedAmount);//申请金额
                setData(data);
            }
        });
    };
    function setData(data) {
        $('.userName').html(data.userName);//申请人姓名、权利人
        $('#certNo').html(data.certNo);//身份证号码
        $('.motelName').html(data.motelName);//经营主体名字
        if(parseInt(data.mainProperty) == 0){  // 主体性质
            $('#mainProperty').text('国有及国家投资企业');
        }else if(parseInt(data.mainProperty) == 1){
            $('#mainProperty').text('集体企业');
        }else if(parseInt(data.mainProperty) == 2){
            $('#mainProperty').text('私营企业');
        }else if(parseInt(data.mainProperty) == 3){
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
        $('#motelRoomQuantity').html(data.motelRoomQuantity);//房间数量
        $('#rentStartDate').html(data.rentStartDate);//起租时间
        $('#rentEndDate').html(data.rentEndDate);//到期时间

        $('#accountName').html(data.accountName);//户名
        $('#openBank').html(data.openBank);//开户行
        $('#bankAccount').html(data.bankAccount);//银行账号
    }

    //提交同意
    $('#agree').on('click', function() {
        $.ajax({
            url: url+ + '',
            method: 'post',
            type: 'json',
            data: '',
            success: function(data) {
            }
        });
    })

    window.disagree = function(){
        parent.document.location.reload()
    }
});