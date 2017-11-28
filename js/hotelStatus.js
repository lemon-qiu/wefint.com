/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 2017/11/11
 * Time: 11:20
 *
 */

let clickDate = '';

layui.use(['laydate', 'form', 'layedit', 'jquery'], function() {
    let laydate = layui.laydate
        , form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit;
    layui.use('form', function() {
        let form = layui.form;
        let onupdataBtn = $('#onupdata');
        // if(onupdataBtn.text() === '立即提交'){
        //     console.log('++++++++++')
        form.on('submit(insertHouse)', function(data) {
            if (onupdataBtn.text() === '立即提交') {
                insertHouse(data.field);
                return false;
            } else if (onupdataBtn.text() === '补单') {
                addAdditionalOrder(data.field);
                return false;
            } else {
                console.log(onupdataBtn.text())
            }

        });
        form.on('submit(addCheckin)', function(data) {
            if (data.field.clientType === '1') {
                alert('请将订单状态改为入住才能修改为入住')
            } else {
                addCheckin(data.field);
            }
            return false;
        });
        form.on('submit(updateCheckinInfo)', function(data) {
            if (data.field.clientType === '1' || data.field.clientType === '3') {
                alert('请将订单状态改为入住才能修改住房信息')
            } else {
                updateCheckinInfo(data.field);
            }
            return false;
        });

        form.on('select(clientType)', function(data) {
            if (data.value === '1') {
                $('#truePaymentLayble').text('实际付款金额');
                $('#truePaymentLableInput').attr({'name': 'truePayment'});
                $('#startDayLayble').text('开始时间');
                $('#startDayInput').attr({'name': 'startDay'});
                form.on('submit(updataHouse)', function(data) {
                    if (data.field.clientType === '2') {
                        alert('请将订单状态改为’预定’才能修改预定信息')
                    } else {
                        updataHouse(data.field);
                    }
                    return false;
                });
            } else if (data.value === '2') {
                let depositInput = $('#depositInput');
                let otherChannelInput = $('#otherChannelInput');
                $('#depositLayble').text('押金');
                depositInput.attr({'name': 'deposit', 'lay-verify': ''});
                $('#otherChannelLayble').text('其他渠道');
                otherChannelInput.attr({'name': 'otherChannel', 'lay-verify': ''});
                $('#truePaymentLayble').text('实际收款金额');
                $('#truePaymentLableInput').attr({'name': 'enterRoomPrice'});
                $('.startDayLayble').text('当前时间');
                $('.startDayInput').attr({'name': 'hasStayDate', 'disabled': 'disabled'});
                form.on('submit(addCheckin)', function(data) {
                    if (data.field.clientType === '1') {
                        alert('请将订单状态改为入住才能修改为入住')
                    } else {
                        addCheckin(data.field);
                    }
                    return false;
                });

            } else if (data.value === '3') {
                let depositInput = $('#depositInput');
                let otherChannelInput = $('#otherChannelInput');
                $('.startDayLayble').text('当前时间');
                $('.startDayInput').attr({'name': 'hasStayDate', 'disabled': 'disabled'});
                $('#depositLayble').text('退款金额');
                depositInput.attr({'name': 'refund'});
                depositInput.val('0');
                $('#otherChannelLayble').text('补差金额');
                otherChannelInput.attr({'name': 'refundPrice'});
                otherChannelInput.val('0');
                form.on('submit(checkout)', function(data) {
                    console.log(data.field.clientType);
                    if (data.field.clientType === '1' || data.field.clientType === '2') {
                        alert('请将订单状态改为退房才能修改退房')
                    } else {
                        checkout(data.field);
                    }
                    return false;
                });
            }
        });

    });
    //常规用法
    laydate.render({
        elem: '#nowTimeChoose',
        format: 'yyyy-MM-dd',
        value: new Date(),
        // show: true,  // 0.4 版本  监听页面打开后直接调用 打开时间弹窗功能 0.5 版本 取消这个方法
        btns: ['now', 'confirm'],
        // ready: function(date) {  //监听日期被切换 当时间打开后直接调用 创建表单的方法
        //     let nowYear = date.year;
        //     let nowMonth = date.month;
        //     let nowDate = date.date;
        //     let nowTime = nowYear + '-' + nowMonth + '-' + nowDate;
        //     let datenumber = mGetDate(nowYear, nowMonth);
        //     createMainTable(nowTime, datenumber, 30);   // 自动创建表单的方法
        // },
        done: function(value, date, endDate) {
            let dateArr = value.split('-');
            let datenumber = mGetDate(dateArr[0], dateArr[1]);
            createMainTable(value, datenumber, 30);
        }
    });
});

window.onload = function() {  // 0.5 版本 在页面读取完毕后 根据当前时间 打开 创建表单的方法
    let nowDate = $('#nowTimeChoose').val();
    let viewTimeArr = nowDate.split('-');
    let year = viewTimeArr[0];
    let mounth = viewTimeArr[1];
    let datenumber = mGetDate(year, mounth);
    createMainTable(nowDate, datenumber, 30);   // 自动创建表单的方法

};

function formatDate(date) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
}

/**
 * 根据按钮的状态 加减时间 并且显示
 * @param type  按钮的状态 是加时间 还是减时间
 */
function appendTime(type) {

    if (type === '+') {
        let viewTime = $('#nowTimeChoose');
        let date = new Date(viewTime.val());
        date.setDate(date.getDate() + 1);
        let time = date.Format("yyyy-MM-dd");
        viewTime.val(time);
        let viewTimeArr = viewTime.val().split('-');
        let year = viewTimeArr[0];
        let mounth = viewTimeArr[1];
        let datenumber = mGetDate(year, mounth);
        createMainTable(time, datenumber, 30)
    } else if (type === '-') {
        let viewTime = $('#nowTimeChoose');
        let date = new Date(viewTime.val());
        date.setDate(date.getDate() - 1);
        let time = date.Format("yyyy-MM-dd");
        viewTime.val(time);
        let viewTimeArr = viewTime.val().split('-');
        let year = viewTimeArr[0];
        let mounth = viewTimeArr[1];
        let datenumber = mGetDate(year, mounth);
        createMainTable(time, datenumber, 30)
    }
}

/**
 *
 * @param nowTime 当前开市的时间
 * @param n       当前月的天数
 * @param maxnum  要显示的天数
 */
function createMainTable(nowTime, n, maxnum) {
    let dateChooseRight = $('.dateChooseRight');
    let dateArr = nowTime.split('-');
    let date = parseInt(dateArr[2]) - 1;
    let month = parseInt(dateArr[1]);
    let year = parseInt(dateArr[0]);
    let uiDateStr = '';
    let divStr = '';
    for (let i = 0; i < maxnum; i++) {
        parseInt(date);
        date++;
        if (date > n) {
            date = 1;
            month++;
            if (month > 12) {
                month = 1;
                year++
            }
        }
        if (date < 10) {
            date = '0' + date;
        }
        uiDateStr = year + '-' + month + '-' + date;
        let uiweek = '星期' + getWeek(uiDateStr);

        divStr += ' <div><p class="timeStr">' + uiDateStr + '</p><p>' + uiweek + '</p></div>';
        dateChooseRight.html(divStr);
    }
    let alldateChooseRightDiv = $('.dateChooseRight div');
    let nowDate = new Date();
    let formatNowDate = formatDate(nowDate);
    for (let i = 0; i < alldateChooseRightDiv.length; i++) {
        if ($(alldateChooseRightDiv[i]).children('.timeStr').text() === formatNowDate) {
            let nowDayStyle = '<div class="now_day">今日</div>';
            let p = document.createElement('div');
            $(p).html(nowDayStyle);
            $(alldateChooseRightDiv[i]).append(p);
            $(alldateChooseRightDiv[i]).css({'color': 'red'})
        }
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
    new ajaxHttp("GET", getUrl(2) + "/roomStatus/findAll", data, function(C) {
        alert("服务器故障，正在维护中，请稍后")
    }, function(data) {
        if (data.code === SUCCESSFULUSERLOGIN) {
            let leftTableTbody = $('#left_table').children();
            leftTableTbody.html('');
            let jsonData = data.content;
            let uiStr = '';
            let RoomIdArr = [];
            let roomInitalPriceArr = [];
            for (let i = 0; i < jsonData.length; i++) {
                let roomName = jsonData[i].roomName;
                let roomNumber = jsonData[i].roomNumber + '号房';
                let RoomId = jsonData[i].id;
                let roomInitalPrice = jsonData[i].roomInitalPrice;
                RoomIdArr.push(RoomId);
                roomInitalPriceArr.push(roomInitalPrice);
                let hotelInfoList = jsonData[i].hotelCheckinInfoList;
                uiStr += '  <tr roomId="' + RoomId + '" roomInitalPrice="' + roomInitalPrice + '"><td>' + roomName + '</td><td>' + roomNumber + '</td></tr>';
                setTimeout(function() {
                    let leftTable = $('#left_table');
                    let dataRight = $('.dataRight');
                    for (let i = 0; i < dataRight.length; i++) {
                        let leftTableTd = leftTable.children().children().children('td:nth-of-type(2)');
                        let RoomNumber = $(leftTableTd[i]).text();
                        $(dataRight[i]).attr({'roomId': RoomIdArr[i], 'RoomNumber': RoomNumber, 'roomInitalPrice': roomInitalPriceArr[i]})
                    }
                    for (let i = 0; i < dataRight.length; i++) {
                        let RoomID = $(dataRight[i]).attr('roomId');
                        let RoomNumber = $(dataRight[i]).attr('RoomNumber');
                        let roomInitalPrice = $(dataRight[i]).attr('roomInitalPrice');
                        $(dataRight[i]).children().attr({'roomId': RoomID, 'RoomNumber': RoomNumber, 'roomInitalPrice': roomInitalPrice})
                    }
                }, 200);
                leftTableTbody.html(uiStr);
                for (let j = 0; j < hotelInfoList.length; j++) {
                    setTimeout(function() {
                        let roomid = hotelInfoList[j].roomId;
                        let dataRight = $('.dataRight');
                        let leftTable = $('#left_table');
                        let leftTableTr = leftTable.children().children();
                        let leftTableTd = leftTable.children().children().children('td:nth-of-type(2)');
                        let nowdateDiv = $('.nowdateDiv');

                        for (let y = 0; y < leftTableTr.length; y++) {
                            let RoomID = $(leftTableTr[y]).attr('roomId');
                            let roomInitalPrice = $(leftTableTr[y]).attr('roomInitalPrice');
                            let RoomNumber = $(leftTableTd[y]).text();
                            $(dataRight[y]).attr({'roomId': RoomID, 'RoomNumber': RoomNumber, 'roomInitalPrice': roomInitalPrice})
                        }
                        for (let i = 0; i < dataRight.length; i++) {
                            let RoomID = $(dataRight[i]).attr('roomId');
                            let RoomNumber = $(dataRight[i]).attr('RoomNumber');
                            let roomInitalPrice = $(dataRight[i]).attr('roomInitalPrice');
                            $(dataRight[i]).children().attr({'roomId': RoomID, 'RoomNumber': RoomNumber, 'roomInitalPrice': roomInitalPrice})
                        }
                        for (let n = 0; n < nowdateDiv.length; n++) {
                            let hasStayDate = hotelInfoList[j].hasStayDate;
                            let clientType = hotelInfoList[j].clientType;
                            let copyId = hotelInfoList[j].copyId;
                            let checkRightStr = '<div class="parent"><div class="checkSubscribe" copyId="' + copyId + '"  onclick="getColumnDetail(this,event)">已预定</div></div>';
                            let checkIn = '<div class="parent"><div class="checkIn" copyId="' + copyId + '"  onclick="getColumnDetail(this,event)">已入住</div></div>';
                            let checkOut = ' <div class="parent"><div class="checkOut" copyId="' + copyId + '"  onclick="getColumnDetail(this,event)">已退房</div></div>';
                            let checkReplenishment = ' <div class="parent"><div class="checkOut" copyId="' + copyId + '"  onclick="getColumnDetail(this,event)">补单</div></div>'
                            if ($(nowdateDiv[n]).attr('date') === hasStayDate && $(nowdateDiv[n]).attr('roomId') === roomid) {
                                if (clientType === '1') {
                                    $(nowdateDiv[n]).html(checkRightStr);
                                }
                                if (clientType === '2') {
                                    $(nowdateDiv[n]).html(checkIn);
                                }
                                if (clientType === '3') {
                                    $(nowdateDiv[n]).html(checkOut);
                                }
                                if (clientType === '4') {
                                    $(nowdateDiv[n]).html(checkReplenishment);
                                }
                            }
                        }

                    }, 300);
                }
            }
            initPageData();
        } else if (data.code === PARAMETERCANNOTBEEMPTY) {
            alert('用户没有登录，请登录')
        } else if (data.code === INSUFFICIENTPRIVILEGE) {
            alert('用户权限不够，请联系管理员')
        } else if (data.code === TIMEFORMATERROR) {
            alert('时间格式不正确，请查看')
        } else if (data.code === ROOMOCCUPANCYCONFLICT) {
            alert('用户入住情况冲突，请联系管理员')
        } else {
            alert('系统故障，正在维护中，请稍后')
        }
    });
}
/**
 * 初始化表单数据
 */
function initPageData() {
    // 根据左边表单数据的量创建右边的表单
    let leftTableTr = $('#left_table').children().children();
    let tableContent = $('#table_content');
    let strNode = '';
    for (let i = 0; i < leftTableTr.length; i++) {
        if ($(leftTableTr[i]).attr('date-type') !== '1') {
            strNode += ' <div class="dataRight"></div>';
            tableContent.html(strNode)
        } else {
            tableContent.html('')
        }

    }
    // 根据div个数计算 整个宽度
    let dateChooseRight = $('.dateChooseRight');
    let dataRight = $('.dataRight');
    let divlength = dateChooseRight.children();
    let width = (divlength.length) * 226;
    dateChooseRight.css({'width': width});
    dataRight.css({'width': width});
    let strNodeTD = '';
    let attrTime = '';
    if (dataRight.length > 0) {
        for (let i = 0; i < divlength.length; i++) {
            attrTime = $($('.timeStr')[i]).text();

            strNodeTD += '<div date ="' + attrTime + '" class="nowdateDiv" onclick="getColumnDetail(this,event)"></div>';
            dataRight.html(strNodeTD)
        }
    }
}


/**
 * 根据 不同的点击按钮 打开不同的模态框
 * @param obj  当前点击对象
 * @param e  window 对象
 */
function getColumnDetail(obj, e) {
    e.stopPropagation();   // 阻止事件向上冒泡   ！！！！
    let roomId = $('.roomId');
    let startDay = $('.startDay');
    let roomNumber = $('.roomNumber');
    let onupdata = $('#onupdata');
    let tdTxt = obj.innerHTML;

    let clickRoomId = '';
    let clickRoomNumber = '';
    let roomInitalPrice = '';
    let userName = $('#userName');
    if (tdTxt === "已预定") {
        let copyId = $(obj).attr('copyId');
        let viewCopyId = $('.copyId');
        viewCopyId.val(copyId);
        clickDate = $(obj).parent().parent().attr('date');
        clickRoomId = $(obj).parent().parent().attr('roomid');
        startDay.val(clickDate);
        roomId.val(clickRoomId);
        viewOrder(copyId, clickDate, obj);
        layer.open({
            type: 1,
            area: ["61%", "80%"],
            content: $('#checkRightStr')
        });
        roomInitalPrice = $(obj).parent().parent().attr('roomInitalPrice');
        let stayDays = $('.stayDays');
        let date = stayDays.val();
        stayDays.blur(function() {
            date = $(stayDays[0]).val();
            let allReceivable = parseInt(date) * parseInt(roomInitalPrice);
            $('.red').val(allReceivable)
        })
    } else if (tdTxt === "已入住") {
        let stayDays = $('.stayDays');
        stayDays.attr({'disabled':'disabled'});
        let copyId = $(obj).attr('copyId');
        let viewCopyId = $('.copyId');
        viewCopyId.val(copyId);
        clickDate = $(obj).parent().parent().attr('date');
        clickRoomId = $(obj).parent().parent().attr('roomid');
        startDay.val(clickDate);
        roomId.val(clickRoomId);
        viewOrder(copyId, clickDate, obj);
        // layer.close(index);
        layer.open({
            type: 1,
            area: ["61%", "80%"],
            content: $('#checkin')
        });
        // roomInitalPrice = $(obj).parent().parent().attr('roomInitalPrice');   // 版本号 ： 0.56  禁用 修改住房信息时  不再可以修改 入住天数
        // let date = stayDays.val();
        // stayDays.blur(function() {
        //     date = $(stayDays[1]).val();
        //     let allReceivable = parseInt(date) * parseInt(roomInitalPrice);
        //     $('.red').val(allReceivable)
        // })

        // let index = layer.confirm('确认修改已入住', {
        //     btn: ['确认'] //按钮
        // }, function() {
        //     layer.close(index);
        //     layer.open({
        //         type: 1,
        //         area: ["61%", "80%"],
        //         content: $('#checkin')
        //     });
        // });
    } else if (tdTxt === "已退房" || tdTxt === "补单") {
        let copyId = $(obj).attr('copyId');
        clickDate = $(obj).parent().parent().attr('date');
        clickRoomId = $(obj).parent().parent().attr('roomid');
        roomId.val(clickRoomId);
        viewOrder(copyId, clickDate, obj);
        let allInput = $('input');
        $('#onupdata').hide();
        for (let i = 0; i < allInput.length; i++) {
            if ($(allInput[i]).attr('id') !== 'userName') {
                $($(allInput[i])).attr({'disabled': 'disabled'});
            } else {
                userName.val(getCookie('userName'));
                userName.attr({'disabled': 'disabled'})
            }

        }
        roomInitalPrice = $(obj).attr('roomInitalPrice');
        startDay.val(clickDate);
        layer.open({
            type: 1,
            area: ["61%", "80%"],
            content: $('#addReservation')
        });
    } else {
        let nowDate = new Date();
        let formatNowDate = formatDate(nowDate);
        clickDate = $(obj).attr('date');
        if (clickDate >= formatNowDate) {
            $('#clientType').text('预定');
            onupdata.show();
            onupdata.text('立即提交');
            let allInput = $('input');
            for (let i = 1; i < allInput.length; i++) {
                if ($(allInput[i]).attr('id') !== 'userName') {
                    $($(allInput[i])).val('');
                    $($(allInput[i])).removeAttr('disabled');
                } else {
                    userName.val(getCookie('userName'));
                    userName.attr({'disabled': 'disabled'})
                }

            }
            clickDate = $(obj).attr('date');
            clickRoomId = $(obj).attr('roomid');
            clickRoomNumber = $(obj).attr('roomnumber');
            roomInitalPrice = $(obj).attr('roomInitalPrice');

            startDay.val(clickDate);
            roomId.val(clickRoomId);
            roomNumber.val(clickRoomNumber);
            layer.open({
                title: '订单信息',
                type: 1,
                area: ["45%", "85%"],
                content: $('#addReservation')
            });


            layui.use(['laydate', 'form', 'layedit', 'jquery'], function(){
              let form = layui.form;
                form.render(); //更新全部
            });
            let stayDays = $('.stayDays');
            let truePayment = $('.truePayment');
            let checkinPerson = $('.checkinPerson');
            let deposit = $('.deposit');
            deposit.val('0');
            checkinPerson.val('0');
            truePayment.val('0');
            stayDays.val('1');
            let date = stayDays.val();
            let allReceivable = parseInt(date) * parseInt(roomInitalPrice);
            $('.red').val(allReceivable);
            $('.red').attr({'disabled':'disabled'});
            stayDays.blur(function() {
                date = $(stayDays[2]).val();
                let allReceivable = parseInt(date) * parseInt(roomInitalPrice);
                $('.red').val(allReceivable)
            })
        } else {
            $('#clientType').text('补单');
            onupdata.show();
            onupdata.text('补单');
            let allInput = $('input');
            for (let i = 1; i < allInput.length; i++) {
                if ($(allInput[i]).attr('id') !== 'userName') {
                    $($(allInput[i])).val('');
                    $($(allInput[i])).removeAttr('disabled');
                } else {
                    userName.val(getCookie('userName'));
                    userName.attr({'disabled': 'disabled'})
                }

            }
            clickDate = $(obj).attr('date');
            clickRoomId = $(obj).attr('roomid');
            clickRoomNumber = $(obj).attr('roomnumber');
            roomInitalPrice = $(obj).attr('roomInitalPrice');

            startDay.val(clickDate);
            roomId.val(clickRoomId);
            roomNumber.val(clickRoomNumber);
            layer.open({
                type: 1,
                area: ["61%", "80%"],
                content: $('#addReservation')
            });
            layui.use(['laydate', 'form', 'layedit', 'jquery'], function(){
                let form = layui.form;
                form.render(); //更新全部
            });
            let stayDays = $('.stayDays');
            let truePayment = $('.truePayment');
            let checkinPerson = $('.checkinPerson');
            let deposit = $('.deposit');
            deposit.val('0');
            checkinPerson.val('0');
            truePayment.val('0');
            stayDays.val('1');
            let date = stayDays.val();
            let allReceivable = parseInt(date) * parseInt(roomInitalPrice);
            $('.red').val(allReceivable);
            $('.red').attr({'disabled':'disabled'});
            stayDays.blur(function() {
                date = $(stayDays[2]).val();
                let allReceivable = parseInt(date) * parseInt(roomInitalPrice);
                $('.red').val(allReceivable)
            })
        }
    }
}

/**
 * 根据 模态框表单内容 添加房间信息到数据库
 * @param data  需要插入的房间的数据
 */
function insertHouse(data) {
    new ajaxHttp('post', getUrl(2) + '/roomStatus/addReservation', data, (err) => {
        alert('系统故障，正在维护中，请稍后', err)
    }, (Data) => {
        if (Data.code === SUCCESSFULUSERLOGIN) {
            // confirm('添加成功，请注意查看', function() {
                history.go(0);
            // })
        } else if (Data.code === PARAMETERCANNOTBEEMPTY) {
            alert('用户没有登录，请登录')
        } else if (Data.code === INSUFFICIENTPRIVILEGE) {
            alert('用户权限不够，请联系管理员')
        } else if (Data.code === TIMEFORMATERROR) {
            alert('时间格式不正确，请查看')
        } else if (Data.code === ROOMOCCUPANCYCONFLICT) {
            alert('用户入住情况冲突，请联系管理员')
        } else if (Data.code === NOTOUTOFTIME) {
            alert('输入预定天数超时（超过30天）');
        } else if (Data.code === USERCHOOSETIMENOTNOWTIME) {
            alert('用户入住时间必须为当天时间才能入住');
        } else {
            alert('系统故障，正在维护中，请稍后')
        }
    })
}

function addAdditionalOrder(data) {
    let nowDate = new Date();
    let formatNowDate = formatDate(nowDate);
    let stayTime = $('.startDay').val();
    let stayDays = $('.stayDays').val();
    let dateDifference = (new Date(formatNowDate) - new Date(stayTime)) / 1000 / 60 / 60 / 24;
    console.log(dateDifference, stayDays)
    if (parseInt(dateDifference) >= parseInt(stayDays)) {
        new ajaxHttp('post', getUrl(2) + '/roomStatus/addAdditionalOrder', data, (err) => {
            alert('系统故障，正在维护中，请稍后', err)
        }, (Data) => {
            if (Data.code === SUCCESSFULUSERLOGIN) {
                // confirm('添加成功，请注意查看', function() {
                    history.go(0);
                // })
            } else if (Data.code === PARAMETERCANNOTBEEMPTY) {
                alert('用户没有登录，请登录')
            } else if (Data.code === INSUFFICIENTPRIVILEGE) {
                alert('用户权限不够，请联系管理员')
            } else if (Data.code === TIMEFORMATERROR) {
                alert('时间格式不正确，请查看')
            } else if (Data.code === ROOMOCCUPANCYCONFLICT) {
                alert('用户入住情况冲突，请联系管理员')
            } else if (Data.code === NOTOUTOFTIME) {
                alert('输入预定天数超时（超过30天）');
            } else if (Data.code === USERCHOOSETIMENOTNOWTIME) {
                alert('用户入住时间必须为当天时间才能入住');
            } else if (Data.code === NOMORETHANTODAY) {
                alert('用户输入住宿的时间不能超过今天');
            } else {
                alert('系统故障，正在维护中，请稍后')
            }
        })
    } else {
        alert('补单住宿时间不能超过今天！')
    }


}

/**
 * 根据表单内容 修改房间预订信息
 * @param data  修改预定信息的 表单内容
 */
function updataHouse(data) {
    new ajaxHttp('post', getUrl(2) + '/roomStatus/updateReservation', data, (err) => {
        alert('系统故障，正在维护中，请稍后', err)
    }, (Data) => {
        if (Data.code === SUCCESSFULUSERLOGIN) {
            // confirm('修改成功，请注意查看', function() {
                history.go(0);
            // })
        } else if (Data.code === PARAMETERCANNOTBEEMPTY) {
            alert('用户没有登录，请登录')
        } else if (Data.code === INSUFFICIENTPRIVILEGE) {
            alert('用户权限不够，请联系管理员')
        } else if (Data.code === TIMEFORMATERROR) {
            alert('时间格式不正确，请查看')
        } else if (Data.code === ROOMOCCUPANCYCONFLICT) {
            alert('用户入住情况冲突，请联系管理员')
        } else if (Data.code === NOTOUTOFTIME) {
            alert('输入预定天数超时（超过30天）');
        } else {
            alert('系统故障，正在维护中，请稍后')
        }
    })
}

/**
 * 根据当前点击按钮判断时间 退订房间
 * @param e  window 对象
 */
function checkOut(e) {
    let copyId = $('.copyId').val();
    let note = $('#note').val();
    let hasStayDate = $('.startDay').val();
    let Data = {
        copyId: copyId,
        note: note,
        hasStayDate: hasStayDate,
    };
    confirm('确定退订房间？', function() {
        new ajaxHttp('post', getUrl(2) + '/roomStatus/deleteReservation', Data, (err) => {
            alert('系统故障，正在维护中，请稍后', err)
        }, (data) => {
            if (data.code === SUCCESSFULUSERLOGIN) {
                // confirm('退订成功，请注意查看', function() {
                    history.go(0);
                // })
            } else if (data.code === PARAMETERCANNOTBEEMPTY) {
                alert('用户没有登录，请登录')
            } else if (data.code === INSUFFICIENTPRIVILEGE) {
                alert('用户权限不够，请联系管理员')
            } else if (data.code === TIMEFORMATERROR) {
                alert('时间格式不正确，请查看')
            } else if (data.code === ROOMOCCUPANCYCONFLICT) {
                alert('用户入住情况冲突，请联系管理员')
            } else if (data.code === NOTOUTOFTIME) {
                alert('输入预定天数超时（超过30天）');
            } else {
                alert('系统故障，正在维护中，请稍后')
            }
        })
    })
}

function addCheckin(Data) {
    new ajaxHttp('post', getUrl(2) + '/roomStatus/addCheckin', Data, (err) => {
        alert('系统故障，正在维护中，请稍后', err)
    }, (data) => {
        if (data.code === SUCCESSFULUSERLOGIN) {
        +
                history.go(0);
            // })
        } else if (data.code === PARAMETERCANNOTBEEMPTY) {
            alert('用户没有登录，请登录')
        } else if (data.code === INSUFFICIENTPRIVILEGE) {
            alert('用户权限不够，请联系管理员')
        } else if (data.code === TIMEFORMATERROR) {
            alert('时间格式不正确，请查看')
        } else if (data.code === ROOMOCCUPANCYCONFLICT) {
            alert('用户入住情况冲突，请联系管理员')
        } else if (data.code === NOTOUTOFTIME) {
            alert('输入预定天数超时（超过30天）');
        } else if (data.code === USERCHOOSETIMENOTNOWTIME) {
            alert('用户入住时间必须为当天时间才能入住');
        } else {
            alert('系统故障，正在维护中，请稍后')
        }
    })
}


function updateCheckinInfo(Data) {
    new ajaxHttp('post', getUrl(2) + '/roomStatus/updateCheckinInfo', Data, (err) => {
        alert('系统故障，正在维护中，请稍后', err)
    }, (data) => {
        if (data.code === SUCCESSFULUSERLOGIN) {
            // confirm('修改入住成功，请注意查看', function() {
                history.go(0);
            // })
        } else if (data.code === PARAMETERCANNOTBEEMPTY) {
            alert('用户没有登录，请登录')
        } else if (data.code === INSUFFICIENTPRIVILEGE) {
            alert('用户权限不够，请联系管理员')
        } else if (data.code === TIMEFORMATERROR) {
            alert('时间格式不正确，请查看')
        } else if (data.code === ROOMOCCUPANCYCONFLICT) {
            alert('用户入住情况冲突，请联系管理员')
        } else if (data.code === NOTOUTOFTIME) {
            alert('输入预定天数超时（超过30天）');
        } else if (data.code === USERCHOOSETIMENOTNOWTIME) {
            alert('用户入住时间必须为当天时间才能入住');
        } else {
            alert('系统故障，正在维护中，请稍后')
        }
    })
}

function checkout(Data) {
    new ajaxHttp('post', getUrl(2) + '/roomStatus/checkout', Data, (err) => {
        alert('系统故障，正在维护中，请稍后', err)
    }, (data) => {
        if (data.code === SUCCESSFULUSERLOGIN) {
            // confirm('退房成功，请注意查看', function() {
                history.go(0);
            // })
        } else if (data.code === PARAMETERCANNOTBEEMPTY) {
            alert('用户没有登录，请登录')
        } else if (data.code === INSUFFICIENTPRIVILEGE) {
            alert('用户权限不够，请联系管理员')
        } else if (data.code === TIMEFORMATERROR) {
            alert('时间格式不正确，请查看')
        } else if (data.code === ROOMOCCUPANCYCONFLICT) {
            alert('用户入住情况冲突，请联系管理员')
        } else if (data.code === NOTOUTOFTIME) {
            alert('输入预定天数超时（超过30天）');
        } else {
            alert('系统故障，正在维护中，请稍后')
        }
    })
}

function viewOrder(Id, date, obj) {
    let Data = {
        copyId: Id,
        hasStayDate: date,
    };
    new ajaxHttp('get', getUrl(2) + '/roomStatus/viewOrder', Data, (err) => {
        alert('系统故障，正在维护中，请稍后', err)
    }, (data) => {
        if (data.code === SUCCESSFULUSERLOGIN) {
            let base = new Base64();
            let jsdata = data.content;
            let allInput = $('input');
            let note = jsdata.note;
            let clickRoomNumber = $(obj).parent().parent().attr('RoomNumber');
            let clickDate = $(obj).parent().parent().attr('date');
            jsdata.startDay = clickDate;
            jsdata.roomNumber = clickRoomNumber;
            $('.userName').text(getCookie('userName'));
            $('.note').text(note);
            let clientType = jsdata.clientType;
            let clientSource = jsdata.clientSource;
            let paymentWays = jsdata.paymentWays;
            clickSelect(clientType, 'clientType');
            clickSelect(clientSource, 'clientSource');
            clickSelect(paymentWays, 'paymentWays');
            for (let i = 0; i < allInput.length; i++) {
                $.each(jsdata, function(a, b) {
                    if ($(allInput[i]).attr('name') === a) {
                        $(allInput[i]).val(b);
                    }
                })
            }
        } else if (data.code === PARAMETERCANNOTBEEMPTY) {
            alert('用户没有登录，请登录')
        } else if (data.code === INSUFFICIENTPRIVILEGE) {
            alert('用户权限不够，请联系管理员')
        } else if (data.code === TIMEFORMATERROR) {
            alert('时间格式不正确，请查看')
        } else if (data.code === ROOMOCCUPANCYCONFLICT) {
            alert('用户入住情况冲突，请联系管理员')
        } else if (data.code === NOTOUTOFTIME) {
            alert('输入预定天数超时（超过30天）');
        } else {
            alert('系统故障，正在维护中，请稍后')
        }
    })
}

/**
 *  根据后台数据模拟点击方法
 * @param dataName 后台获取的数据
 * @param className    需要模拟点击的ID
 */
function clickSelect(dataName, className) {
    let JqSelectId = $('select.' + className);
    if (dataName === '') {
        dataName = null;
    } else {
        JqSelectId.next().find("dd[lay-value=" + dataName + "]").click();    // 车子是否贷款
    }
}


Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};