/**
 * @Created with fly.
 * @User: z1163764648.com
 * @Date: 2017/11/9
 * @Time: 16:17
 * @return {boolean}  获取客栈信息的方法
 */


function getName() {
    let Data = {"id": getCookie("token")};
    new ajaxHttp('get', getUrl(1) + '/sso/find', Data, () => {
        alert('用户未登录， 请重新登录')
    }, (data) => {
        $('#contact').val(data.content.phoneNumber);
        $('#hotelName').val(data.content.hotelName)
    });
    return false
}

/**
 * 默认查询当月收入信息
 */
function getMonthAccount() {
    let nowDate = new Date();
    let month = nowDate.getMonth() + 1;
    let startDate = nowDate.getFullYear() + '-' + month + '-' + 1; // 当前月份 第一天
    let endDate = nowDate.getFullYear() + '-' + month + '-' + 30; // 当前月份最后一天
    $('#startDate').val(startDate);
    $('#endDate').val(endDate);
    let data = {
        startDate: startDate,
        endDate: endDate
    };
    hotelFinancialChart(data) // 调用查询 所有收入的方法
}


/**
 * 添加账本信息的方法
 * @param obj 表单传递的账本信息对象
 */
function submitAddBook(obj) {
    let Data = {
        userName: getCookie('userName'),
        countingType: obj.countingType,
        countingMoney: obj.countingMoney,
        countingGoods: obj.countingGoods,
        countingDate: obj.countingDate,
        countingNotes: obj.countingNotes,
    };
    new ajaxHttp('post', getUrl(2) + '/countingBook/add', Data, (err) => {
        alert('服务器故障，正在处理，请稍后', err)
    }, (data) => {
        if (data.code === SUCCESSFULUSERLOGIN) {
            confirm('添加成功，请注意查看', function() {
                history.go(0);
            });
        } else if (data.code === PARAMETERCANNOTBEEMPTY) {
            alert('请求的参数不能为空，请检查')
        } else if (data.code === INSUFFICIENTPRIVILEGE) {
            alert('用户权限不够，请联系管理员')
        } else if (data.code === TIMEFORMATERROR) {
            alert('时间格式不正确，请检查时间是否是否输入正确')
        } else {
            alert('服务器故障，正在处理，请稍后')
        }
    })
}

/**
 * 根据时间获取 账本的房间收入信息
 * @param obj  表单传递的时间对象
 */
function hotelFinancialChart(obj) {
    let Data = {
        userName: getCookie('userName'),
        startDate: obj.startDate,
        endDate: obj.endDate,
    };
    hotelFinancialChartOTA(Data);
    new ajaxHttp('get', getUrl(2) + '/countingBook/hotelFinancialChart', Data, (err) => { // ajax请求错误的方法
        alert('服务器故障，正在处理，请稍后', err)
    }, (data) => {
        if (data.code === SUCCESSFULUSERLOGIN) {
            let getdata = data.content;  // 获取后台content 数据
            let allField = ['total', 'cash', 'wechat', 'bankCard', 'aliPay', 'other']; // 开始定义试图内所有的键值对应，调用方法是一一对象
            let HOUSEINCOMETD = $('#houseIncome').children(); //  houseIncome 下所有的TD
            let TALLYINCOMETD = $('#tallyIncome').children(); //  tallyIncome 下所有的TD
            let EXPENDITURETD = $('#expendIture').children(); //  expendIture 下所有的TD
            let HOUSEINCOME = getdata[0]; // 房屋收入
            let TALLYINCOME = getdata[1]; // 记账收入
            let EXPENDITURE = getdata[2]; // 支出
            setTd(HOUSEINCOMETD, HOUSEINCOME, allField); // 调用settd方法 将数据循环显示到视图
            setTd(TALLYINCOMETD, TALLYINCOME, allField); // 调用settd方法 将数据循环显示到视图
            setTd(EXPENDITURETD, EXPENDITURE, allField); // 调用settd方法 将数据循环显示到视图
            setTimeout(function() {
                strikingBalance()
            }, 400)
        } else if (data.code === PARAMETERCANNOTBEEMPTY) {
            alert('时间不能为空')
        } else if (data.code === INSUFFICIENTPRIVILEGE) {
            alert('用户权限不够，请联系管理员')
        } else if (data.code === TIMEFORMATERROR) {
            alert('时间格式不正确，请检查时间格式')
        } else {
            alert('服务器故障，正在处理，请稍后', data)
        }
    })
}

/**
 * 根据时间获取第三方收入的方法
 * @param Data 传递获取OTA时间
 */
function hotelFinancialChartOTA(Data) {
    new ajaxHttp('get', getUrl(2) + '/countingBook/hotelFinancialChartOTA', Data, (err) => {
        alert('服务器故障，正在处理，请稍后', err)
    }, (data) => {
        if (data.code === SUCCESSFULUSERLOGIN) {
            let getdata = data.content;
            let accountField = ['accountingFeiZhu', 'accountingQuNaEr', 'accountingXieCheng',
                'accountingYiLong','accountingMeiTuan','accountingTuJia','accountingAli']; // 开始定义视图内所有的键值对应，调用方法是一一对象
            let commissionField = ['compensasenFeiZhuSolid', 'compensasenQuNaErSolid',
                'compensasenXieChengSolid', 'compensasenYiLongSolid','compensasenMeiTuanSolid',
                'compensasenTuJiaSolid','compensasenAliSolid']; // 定义视图内所有的键值对应
            let compensasenField = ['commissionFeiZhu', 'commissionQuNaEr', 'commissionXieCheng', 'commissionYiLong','commissionMeiTuan',
            'commissionTuJia','commissionAli']; // 开始定义视图内所有的键值对应，调用方法是一一对象
            let ACCOUNTTD = $('#account').children(); //  account 下所有的TD
            let COMMISSIONTD = $('#commission').children();  //  commission 下所有的TD
            let COMPENSASENTD = $('#compensasen').children();  //  compensasen 下所有的TD
            setTd(ACCOUNTTD, getdata, accountField);  // 调用account方法 将数据循环显示到视图
            setTd(COMMISSIONTD, getdata, compensasenField); // 调用commission方法 将数据循环显示到视图
            setTd(COMPENSASENTD, getdata, commissionField); // 调用compensasen方法 将数据循环显示到视图

        } else if (data.code === PARAMETERCANNOTBEEMPTY) {
            alert('时间不能为空')
        } else if (data.code === INSUFFICIENTPRIVILEGE) {
            alert('用户权限不够，请联系管理员')
        } else if (data.code === TIMEFORMATERROR) {
            alert('时间格式不正确，请检查时间格式')
        } else {
            alert('服务器故障，正在处理，请稍后', data)
        }
    })
}

/**
 * 向表单传递数据并显示
 * @param tdname 所有的td对象
 * @param objname   需要向td 内装的数据
 * @param obj   对应 对象内的键值
 */
function setTd(tdname, objname, obj) {
    for (let i = 1; i <= obj.length; i++) {
        $.each(objname, function(a, b) {
            if (obj[i - 1] === a) {
                if (b === null || b === undefined) { // 如果 对象内的值为null or undefiend  直接转换成为0
                    $(tdname[i]).text('0')
                } else {
                    $(tdname[i]).text(b)
                }
            }
        })
    }
}


function strikingBalance() {
    let houseIncomeTd = $('#houseIncome').children();
    let tallyIncomeTd = $('#tallyIncome').children();
    let expendItureTd = $('#expendIture').children();
    let lastbBalanceTd = $('#lastbBalance').children();
    for (let i = 1; i < houseIncomeTd.length; i++) {
        let houseIncomeTdNum = $(houseIncomeTd[i]).text();
        let tallyIncomeTdNum = $(tallyIncomeTd[i]).text();
        let expendItureTdNum = $(expendItureTd[i]).text();
        let Addincome = parseInt(houseIncomeTdNum) + parseInt(tallyIncomeTdNum);
        let lastbBalance =  parseInt(Addincome) - parseInt(expendItureTdNum);
        $(lastbBalanceTd[i]).text(lastbBalance)
    }
}