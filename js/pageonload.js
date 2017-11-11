/**
 * @Created with fly.
 * @User: z1163764648.com
 * @Date: 2017/11/6
 * @Time: 15:38
 */

let SERVER_ADD_PORT = "http://47.94.108.64:3000";   // 设置的测试的端口
let SUCCESSFULUSERLOGIN = '000000'; // 登录 操作 成功
let USERDOESNOTEXIST = '200001';  // 用户不存在;
let WRONGPASSWORD = '200002'; // 密码错误；
let INVALIDLOGIN = '200003'; // 无效登录
let PARAMETERCANNOTBEEMPTY = '900007'; // 请求的参数不能为空
let INSUFFICIENTPRIVILEGE = '200102'; // 权限不够
let DATAALREADYEXISTS = '200103';  // 业务数据已经存在
let TIMEFORMATERROR = '200104' ; // 时间格式错误
let ROOMOCCUPANCYCONFLICT = '200105'; // 用户入住情况冲突

/**
 *
 * @param B   传入 需要设置cookie的键
 * @param C   村放的cookie的值
 * @param D   时间
 */
function setCookie(B, C, D) {
    let A = new Date();
    A.setDate(A.getDate() + D);
    document.cookie = B + "=" + escape(C) + ((D === null) ? "" : ";expires=" + A.toGMTString())
}

/**
 *
 * @param A
 * @returns {string}  传如获取cookie的名称
 */
function getCookie(A) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(A + "=");
        if (c_start != -1) {
            c_start = c_start + A.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end === -1) {
                c_end = document.cookie.length
            }
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

/**
 *
 * @param B  // 传入 需要删除的cookie值
 *  删除某一个cookie的方法
 */
function delCookie(B) {
    let A = new Date();
    A.setTime(A.getTime() - 1);
    let C = getCookie(B);
    if (C != null) {
        document.cookie = B + "=" + C + ";expires=" + A.toGMTString()
    }
}

/**
 *
 * @returns {boolean}
 * 在登录页面检查是否存在cookie；如果存在直接进入主页面
 */
function loginCheckCookieLogin() {
    if (getCookie("token") === "" || getCookie('token') === undefined || getCookie('token') === null) {
        return false
    }
    let A = {"userName": getCookie("userName")};
    $.ajax({
        cache: true,
        type: "POST",

        url: getUrl() + "/HotelPMS/UserLoginServlet",
        data: {"strUserLogin": JSON.stringify(A)},
        async: false,
        error: function(B) {
            delCookie("userName");
            delCookie("password");
            window.location.href = "./login.html"
        },
        success: function(B) {
            if (B === "405") {
                delCookie("userName");
                delCookie("password");
                window.location.href = "./login.html";
                return false
            }
            if (B === "200") {
                window.location.href = "./mainPannel.html";
                return false
            }
        }
    });
    return false
}
/**
 *
 * @returns {boolean}
 *  检查页面是否存在cookie，如果存在 直接进入主页面
 */
function pannelCheckCookieLogin() {
    if (getCookie("token") === "" || getCookie('token') === undefined || getCookie('token') === null) {
        window.location.href = "./login.html";
        return false
    }
    let A = {"userName": getCookie("userName"), "password": getCookie("password"),};
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl(1) + '/sso/login',
        data: {"strUserLogin": JSON.stringify(A)},
        async: false,
        error: function(B) {
            delCookie("userName");
            delCookie("password");
            window.location.href = "./login.html"
        },
        success: function(DATA) {
            if (DATA.code === SUCCESSFULUSERLOGIN) {
                return false
            } else {
                delCookie("userName");
                delCookie("password");
                window.location.href = "./mainPannel.html";
                return false
            }
        }
    });
    return false
}

/**
 *
 * @constructor  其他页面检查是否登陆
 *
 */
function checkCookieLogin() {
    if (getCookie("token") === "" || getCookie('token') === undefined || getCookie('token') === null) {
        window.location.href = "./login.html";
    }
}
/**
 *  退出登录的方法 清楚cookie
 */
function logout() {
    delCookie("userName");
    delCookie("token");
    delCookie("token");
    window.location.href = "./login.html"
}

/**
 *
 * @param type 传入需要获取ip的类型
 * @returns {*}
 */
function getUrl(type) {
    if (type === 1) { // 登录
        return "http://192.168.0.8:48080"
    } else if (type === 2) { // 注册
        return "http://192.168.0.130:30000"
    } else if (type === 3) { // 设置
        return "http://192.168.0.102:30000"
    } else if(type === 4){
        return "http://192.168.0.8:30050"//金融图片上传
    } else if(type === 5 ){
        return "http://192.168.0.157:20000"//金融审核
        //return "http://119.23.41.105:20000"
    } else if(type === 6 ){
        return "http://192.168.0.157:20000" //OSS账户信息
    }else if(type === 7 ){
        return "http://wefint.oss-cn-qingdao.aliyuncs.com" //OSS上传图片
    }

};

/**
 * window alert方法的封装
 * @param msg 传入需要显示对话框的内容
 * @returns {*}
 * @param index   需要显示的弹出层的icon
 */
window.alert = function (msg , index) {
    if(index === null || index === ''){
        layer.alert(msg,{icon:0});
    }else {
        layer.alert(msg,{icon:index});
    }
};

/**
 * window confirm方法的封装
 * @param msg 传入需要显示对话框的内容
 * @param fn   传入点击确定时需要处理的人方法
 * @returns {*}
 */
window.confirm = function(msg,fn) {
    layer.confirm(msg, {
        btn: ['确定','取消'] //按钮
    },fn);
};

/**
 *
 * @param methoud  传入ajax方法
 * @param url      url地址
 * @param Data      参数
 * @param errfn        失败的方法
 * @param sucfn         成功的方法
 * @constructor
 */
function ajaxHttp(methoud,url,Data,errfn,sucfn) {
    $.ajax({
        cache: true,
        type: methoud,
        url: url,
        data: Data,
        async: false,
        headers: {'wefinttoken': getCookie('token')},
        //headers: {'wefinttoken': '0ddd9e12-c38b-11e7-ac90-c81f66bc7d83'},
        error: errfn,
        success: sucfn,
    });
}


/**
 *
 * @param name  传入 需要获取url地址的值  可以获得 相应的值
 *
 * @returns {null}
 * @constructor
 */
function GetQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = decodeURI(e.path[0].location.search).substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}