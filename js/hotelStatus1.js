/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 2017/11/11
 * Time: 11:20
 *
 */

layui.use(['laydate', 'form', 'layedit', 'jquery'], function() {
    let laydate = layui.laydate
        , form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit;

    //常规用法
    laydate.render({
        elem: '#nowTimeChoose',
        format: 'yyyy-MM-dd',
        value: new Date(),
        show: true,
        ready: function(date) { //监听日期被切换
            let nowYear = date.year;
            let nowMonth = date.month;
            let nowDate = date.date;
            let nowTime = nowYear + '-' + nowMonth + '-' + nowDate;
            let datenumber = mGetDate(nowYear, nowMonth);
            createMainTable(nowTime, datenumber, 30);
        },
        done: function(value, date, endDate) {
            let dateArr = value.split('-');
            let datenumber = mGetDate(dateArr[0], dateArr[1]);
            createMainTable(value, datenumber, dateArr[2]);
        }
    });
});

/**
 *
 * @param nowTime 当前开市的时间
 * @param n       当前月的天数
 * @param maxnum  要显示的天数
 */
function createMainTable(nowTime, n, maxnum) {
    let dateChooseRight = $('.dateChooseRight');
    let dateArr = nowTime.split('-');
    let date = parseInt(dateArr[2]);
    let month = parseInt(dateArr[1]);
    let year = parseInt(dateArr[0]);
    let uiDateStr = '';
    let divStr = '';
    for (let i = 0; i < maxnum; i++) {
        date +=1;
        if(date > n){
            date = 1;
            month ++;
            if(month >12){
                month = 1;
                year++
            }
        }
        uiDateStr = year + '-' + month + '-' + date;
        let uiweek = '星期' + getWeek(uiDateStr);
        divStr += ' <div><p>' + uiDateStr + '</p><p>' + uiweek + '</p></div>'
        dateChooseRight.html(divStr)
    }
    initPageData();
    initPanel(nowTime);
}

/**
 * 获取当前月有多少天
 * @param year  当前年
 * @param month 当前月
 * @returns {number}
 */
function mGetDate(year, month) {
    let d = new Date(year, month, 0);
    return d.getDate();
}

/**
 * 根据当前时间 获取 当前周
 * @param nowTime  当前的时间
 * @returns {string}
 */
function getWeek(nowTime) {
    let week = new Date(nowTime).getDay();
    let str = '';
    switch (week) {
        case 0 :
            str += "日";
            break;
        case 1 :
            str += "一";
            break;
        case 2 :
            str += "二";
            break;
        case 3 :
            str += "三";
            break;
        case 4 :
            str += "四";
            break;
        case 5 :
            str += "五";
            break;
        case 6 :
            str += "六";
            break;
    }
    return str;
}


function initPanel(nowTime) {
    let data = {
        "userName": getCookie("userName"),
        "hasStayDate": nowTime
    };
    console.log(data)
    new ajaxHttp("GET", getUrl(2) + "/roomStatus/findAll", data, function(C) {
        alert("查询失败，请联系管理员")
    }, function(data) {
        if(data.code === SUCCESSFULUSERLOGIN){

        }else if(data.code === PARAMETERCANNOTBEEMPTY){
                alert('用户没有登录，请登录')
        }else if(data.code === INSUFFICIENTPRIVILEGE){
                alert('用户1权限不够，请联系管理员')
        }else if(data.code === TIMEFORMATERROR){
                alert('时间格式不正确，请查看')
        }else if(data.code === ROOMOCCUPANCYCONFLICT){
                alert('用户入住情况冲突，请联系管理员')
        }else{
                alert('系统故障，正在维护中，请稍后')
        }
        // let content = data.content;
        // createLeftTable(content);
        // initMainTable(content,30);

    });
}


/**
 * 日期转字符串
 * @param curDate 当前日期
 * @returns 返回字符串
 */
function dateToString(curDate) {
    let year = curDate.getFullYear();
    let monthValue = curDate.getMonth() + 1;
    let dateValue = curDate.getDate();
    let month = monthValue < 10 ? "0" + monthValue : monthValue;
    let date = dateValue < 10 ? "0" + dateValue : dateValue;
    return year + "-" + month + "-" + date;
}