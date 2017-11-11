var code;
const PARAMETERNULL = '900007';
const HASUSER = '200101';
const SUCCESS = '000000';

/*function createCode() {
    code = "";
    var E = 4;
    var A = document.getElementById("code");
    var C = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");
    for (var B = 0; B < E; B++) {
        var D = Math.floor(Math.random() * 36);
        code += C[D]
    }
    document.getElementById("code").value = code
}*/

function createCode(){
    var phoneNumber = $('#phoneNumber').val();
    new ajaxHttp("POST", getUrl(3) + "/portal/findEmployee", Data,
        function(data) {
            alert("获取状态失败，请稍后");
        },
        function(data) {
            if (data.code === SUCCESSFULUSERLOGIN) {
                let objs = data.content;
                for (let j = 0; j < objs.length; j++) {
                    let STAFFSINFORMATION = [];   // 所有得员工信息的数组
                    let b = new Base64();
                    STAFFSINFORMATION[0] = b.decode(objs[j].userName);
                    if (objs[j].registerName === '') {
                        STAFFSINFORMATION[1] = '';
                        alert('员工信息必填项空缺，请完善')
                    } else {
                        STAFFSINFORMATION[1] = objs[j].registerName;
                    }
                    STAFFSINFORMATION[2] = objs[j].phoneNumber;
                    STAFFSINFORMATION[3] = objs[j].createTime;
                    if (objs[j].loginRole === '0')
                        STAFFSINFORMATION[4] = "员工";
                    else if (objs[j].loginRole === '1')
                        STAFFSINFORMATION[4] = "店长";
                    // alert(aa);
                    setData2(STAFFSINFORMATION);
                }
            } else if (data.code === INSUFFICIENTPRIVILEGE) {
                alert('权限不够，请联系管理员！')
            } else {
                alert('系统错误,请刷新浏览器')
            }
        });
}

function validate() {
    var A = document.getElementById("checkcode").value.toUpperCase();
    if (A.length <= 0) {
        return false
    } else {
        if (A != code) {
            alert("验证码错误!");
            createCode();
            document.getElementById("checkcode").value = "";
            return false
        }
    }
    return true
}


/***
 * 滑动发送验证码
 * @param options
 */
$.fn.drag = function(options){
    var x, drag = this, isMove = false, defaults = {
    };
    var options = $.extend(defaults, options);
    //添加背景，文字，滑块
    var html = '<div class="drag_bg"></div>'+
        '<div class="drag_text" onselectstart="return false;" unselectable="on">拖动滑块验证</div>'+
        '<div class="handler handler_bg"></div>';
    this.append(html);

    var handler = drag.find('.handler');
    var drag_bg = drag.find('.drag_bg');
    var text = drag.find('.drag_text');
    var maxWidth = drag.width() - handler.width();  //能滑动的最大间距

    //鼠标按下时候的x轴的位置
    handler.mousedown(function(e){
        isMove = true;
        x = e.pageX - parseInt(handler.css('left'), 10);
    });

    //鼠标指针在上下文移动时，移动距离大于0小于最大间距，滑块x轴位置等于鼠标移动距离
    $(document).mousemove(function(e){
        var _x = e.pageX - x;
        if(isMove){
            if(_x > 0 && _x <= maxWidth){
                handler.css({'left': _x});
                drag_bg.css({'width': _x});
            }else if(_x > maxWidth){  //鼠标指针移动距离达到最大时清空事件
                dragOk();
            }
        }
    }).mouseup(function(e){
        isMove = false;
        var _x = e.pageX - x;
        if(_x < maxWidth){ //鼠标松开时，如果没有达到最大距离位置，滑块就返回初始位置
            handler.css({'left': 0});
            drag_bg.css({'width': 0});
        }
    });

    //清空事件
    function dragOk(){
        var Data = $('#phoneNumber').val();
        new ajaxHttp('POST',getUrl(2) + '/portal/getVirficationCode',Data,
            function(data) {
                alert("获取状态失败，请稍后");
            }),
            function(data) {
                if(data.code === SUCCESS){
                    handler.removeClass('handler_bg').addClass('handler_ok_bg');
                    text.text('验证通过');
                    drag.css({'color': '#fff'});
                    handler.unbind('mousedown');
                    $(document).unbind('mousemove');
                    $(document).unbind('mouseup');
                    text.text('发送成功');
                    alert('成功');
                }else if(data.code === 900007){
                    alert('参数为空');
                }else if(data.code === 200101){
                    alert('用户已经存在');
                }else if(data.code === 200500){
                    alert('验证码错误');
                }else if(data.code === 200501){
                    alert('手机号出错');
                }else if(data.code === 200502){
                    alert('验证码发送失败');
                }else if(data.code === 200503){
                    alert('验证码失效');
                }
            }
    }
};

function memberRegister(data) {
    var D = new Base64();
    var username = data.userName;
    var password = data.password;
    var datas = {"userName": username, "password": password, "hotelName": data.hotelName, "phoneNumber": data.phoneNumber, "email": data.email,"verificationCode":data.verificationCode};
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl(2)+"/portal/registerUser",
        data: datas,
        async: false,
        error: function (result) {
            alert("注册失败，请稍后再试");
        },
        success: function (result) {
            if (result.code == PARAMETERNULL) {
                alert("参数为空")
            }else if (result.code == HASUSER) {
                alert("用户已经存在！")
            }else if (result.code == 200500){
                alert("验证码错误！")
            }else if (result.code == 200501){
                alert("手机号出错！")
            }else if (result.code == 200502){
                alert("验证码发送失败！")
            }else if (result.code == 200503){
                alert("验证码失效！")
            }else if (result.code== SUCCESS) {
                alert("注册成功请登录");
                window.location.href = "../html/login.html"
            }
            return false
        }
    })
};

/*
function memberRegister(E) {
    var D = new Base64();
    var C = D.encode(E.userName);
    var B = D.encode(E.password);
    var A = {"userName": C, "password": B, "hotelName": E.hotelName, "phoneNumber": E.phoneNumber, "email": E.email,};
    $.ajax({
        cache: true,
        type: "POST",
        url: "http://admin.wefint.com:8080/HotelPMS/UserRegisterServlet",
        data: {"strUserRegister": JSON.stringify(A)},
        async: false,
        error: function (F) {
            alert("注册失败，请稍后再试")
        },
        success: function (F) {
            if (F == "405") {
                alert("内部错误，请稍后再试")
            }
            if (F == "800") {
                alert("用户名重复请更换！")
            }
            if (F == "200") {
                alert("注册成功请登陆");
                window.location.href = "../html/login.html"
            }
            return false
        }
    })
};*/
