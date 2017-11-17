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

/*function createCode(){
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
}*/


/*function validate() {
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
}*/


/***
 * 滑动发送短信
 * @param options
 */
(function(window,document,undefined){
    var dog = {//声明一个命名空间，或者称为对象
        $:function(id){
            return document.querySelector(id);
        },
        on:function(el,type,handler){
            el.addEventListener(type,handler,false);
        },
        off:function(el,type,handler){
            el.removeEventListener(type,handler,false);
        }
    };
//封装一个滑块类
    function Slider(){
        var args = arguments[0];
        for(var i in args){
            this[i] = args[i]; //一种快捷的初始化配置
        }
//直接进行函数初始化，表示生成实例对象就会执行初始化
        this.init();
    }
    Slider.prototype = {
        constructor:Slider,
        init:function(){
            this.getDom();
            this.dragBar(this.handler);
        },
        getDom:function(){
            this.slider = dog.$('#'+this.id);
            this.handler = dog.$('.handler');
            this.bg = dog.$('.drag_bg');
        },
        dragBar:function(handler){
            var that = this,
                startX = 0,
                lastX = 0,
                doc = document,
                width = this.slider.offsetWidth,
                max = width - handler.offsetWidth,
                drag = {
                    down:function(e){
                        var e = e||window.event;
                        that.slider.classList.add('unselect');
                        startX = e.clientX - handler.offsetLeft;
                        console.log('startX: '+startX+' px');
                        dog.on(doc,'mousemove',drag.move);
                        dog.on(doc,'mouseup',drag.up);
                        return false;
                    },
                    move:function(e){
                        var e = e||window.event;
                        lastX = e.clientX - startX;
                        lastX = Math.max(0,Math.min(max,lastX)); //这一步表示距离大于0小于max，巧妙写法
                        console.log('lastX: '+lastX+' px');
                        if(lastX>=max){
                            handler.classList.add('handler_ok_bg');
                            that.slider.classList.add('slide_ok');
                            dog.off(handler,'mousedown',drag.down);
                            drag.up();
                            console.log(11);
                            sendMsg();//发送短信获取验证码

                            //倒计时60s
                            function invokeSettime(obj){
                                var countdown=60;
                                settime(obj);
                                function settime(obj) {
                                    if (countdown == 0) {
                                        $(obj).attr("disabled",false);
                                        $(obj).text("从新获取验证码");
                                        countdown = 60;
                                        //滑块复位
                                        that.bg.style.width =  '0px';
                                        handler.style.left = '0px';
                                        handler.classList.remove('handler_ok_bg');
                                        that.slider.classList.remove('slide_ok');
                                        return;
                                    } else {
                                        $(obj).attr("disabled",true);
                                        $(obj).text("(" + countdown + ") s 后请重新发送");
                                        countdown--;
                                    }
                                    setTimeout(function() {
                                            settime(obj) }
                                        ,1000)
                                }
                            }
                            new invokeSettime("#time");

                        }
                        that.bg.style.width = lastX + 'px';
                        handler.style.left = lastX + 'px';
                    },
                    up:function(e){
                        var e = e||window.event;
                        that.slider.classList.remove('unselect');
                        if(lastX < width){
                            that.bg.classList.add('ani');
                            handler.classList.add('ani');
                            that.bg.style.width = 0;
                            handler.style.left = 0;
                            setTimeout(function(){
                                that.bg.classList.remove('ani');
                                handler.classList.remove('ani');
                            },300);
                        }
                        dog.off(doc,'mousemove',drag.move);
                        dog.off(doc,'mouseup',drag.up);
                    }
                };
            dog.on(handler,'mousedown',drag.down);
        }
    };
    window.S = window.Slider = Slider;
})(window,document);

$('#slider').on('mousedown',function() {
    if($('#phoneNumber').val() === null || $('#phoneNumber').val() === ""){
        alert('手机号不能为空');
        return false;
    }else if(!checkMobiles($.trim($('#phoneNumber').val()))) {
        alert('手机号格式不对');
    }else{
        var defaults = {
            id:'slider'
        };
        new S(defaults);
    }
})

function checkMobiles(theForm) {
    return /^((13|15|18|14|17)+\d{9})$/.test(theForm);
}

/**
 *发送短信获取验证码
 */
function sendMsg(){
    var Data = {
        phoneNumber:$('#phoneNumber').val(),
    };
    new ajaxHttp('POST',getUrl(2) + '/portal/getVirficationCode',Data,
        function(data) {
            alert("获取状态失败，请稍后");
        }),
        function(data) {
            if(data.code === SUCCESS){
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
            }else if(data.code === 200505){
                alert('短信验证码超量，请联系管理员（由于阿里限制，每一天同一个手机，只可以发送10条数据）');
            }else {
                alert('系统错误');
            }
        }
}


/**
 * 用户注册
 * @param data
 */
function memberRegister(data) {
    var D = new Base64();
    var username = data.userName;
    var password = data.password;
    var datas = {
        "userName": $('#userName').val(),
        "password": $('#password').val(),
        "hotelName": $('#hotelName').val(),
        "phoneNumber": $('#phoneNumber').val(),
        "email": $('#email').val(),
        "verificationCode":$('#verificationCode').val()
    };
    console.log(datas);
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl(2)+"/portal/registerUser",
        data: datas,
        headers: {'wefinttoken': getCookie('token')},
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
            }else {
                alert('系统错误');
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
