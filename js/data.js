/**
 * @Created with fly.
 * @User: z1163764648.com
 * @Date: 2017/11/14
 * @Time: 11:05
 */

function loadDate() {
    let Data = {
        "userName": getCookie('userName'),
    };
    let type = [];
    let number = [];
    new ajaxHttp('get', getUrl(2) + '/hotelData/findHotelRoomCount', Data, (err) => {
        alert('系统故障，正在维护中，请稍后', err)
    }, (data) => {
        if (data.code === SUCCESSFULUSERLOGIN) {
            let Jsdata = data.content;
            for (let i = 0; i < Jsdata.length; i++) {
                type.push(Jsdata[i].roomType);
                number.push(Jsdata[i].total);
                roomType(type, number);
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

function roomType(type, number) {
    let myChart = echarts.init(document.getElementById('roomType'));
    let option = {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: type,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                // type : 'category',
                // data : ['10','20','30','40'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        series: [
            {
                name: '直接访问',
                type: 'bar',
                barWidth: '40%',
                data: number,
            },

        ],
        label: {
            normal: {
                show: true,
                position: 'top',
                formatter: '{c}'
            }
        },
        itemStyle: {
            normal: {

                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(17, 168,171, 1)'
                }, {
                    offset: 1,
                    color: 'rgba(17, 168,171, 0.1)'
                }]),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
            }
        }
    };
    myChart.setOption(option);
}

//-----------------------------------------------------------------
//额外花销
//汇总收入和支出
function expendSearch(data) {
    let Data = {
        userName: getCookie('userName'),
        startDate: data.startDate,
        endDate: data.endDate,
    };
    console.log(Data)
    let date = [];
    let income = [];
    let expend = [];
    new ajaxHttp('get', getUrl(2) + '/hotelData/findExtraExpenses', Data, (err) => {
        alert('系统故障，正在维护中，请稍后', err)
    }, (data) => {
        if (data.code === SUCCESSFULUSERLOGIN) {
            let Jsdata = data.content;
            for (let i = 0; i < Jsdata.length; i++) {
                let DataArr = Jsdata[i].split(',')
                date.push(DataArr[0]);
                income.push(DataArr[1]);
                expend.push(DataArr[2]);
            }
            ExSpend(date, income, expend)
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

function ExSpend(date, income, expend) {
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('ExSpend'));
    // 指定图表的配置项和数据
    let option = {
        title: {
            text: '收入与支出分析表',
            // subtext: '纯属虚构'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['收入', '支出']
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {},
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date,
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [
            {
                name: '收入',
                type: 'line',
                data: income,
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name: '支出',
                type: 'line',
                data: expend,
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//售出过夜和出售过夜率
function NsVsratesSearch(data) {
    //每天卖出的房间个数及对应的时间
    let Data = {
        userName: getCookie('userName'),
        startDate: data.nsVsratesStartDay,
        endDate: data.nsVsratesEndDay,
    };
    // NsVsRates(['2017-01-05','2017-01-08'],['5','2','3'],['50','40','20'])
    new ajaxHttp('get', getUrl(2) + '/hotelData/findSoldRate', Data, (err) => {
        alert('系统故障，正在维护中，请稍后', err)
    }, (data) => {
        let date = [];
        let dateNumber = [];
        let occupancyRate = [];
        if (data.code === SUCCESSFULUSERLOGIN) {
            let Jsdata = data.content;
            for (let i = 0; i < Jsdata.length; i++) {
                let DataArr = Jsdata[i].split(',')
                date.push(DataArr[0]);
                dateNumber.push(DataArr[1]);
                occupancyRate.push(DataArr[2]);
            }
            NsVsRates(date, dateNumber, occupancyRate)
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


//售出过夜vs出售过夜率
function NsVsRates(a, b, c) {
    let myChart = echarts.init(document.getElementById('NsVsRates'));
    let option = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['售出过夜', '出售过夜率']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: a
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: '售出过夜',
            type: 'line',
            stack: '总量',
            areaStyle: {
                normal: {}
            },
            data: b
        }, {
            name: '出售过夜率',
            type: 'line',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            areaStyle: {
                normal: {}
            },
            data: c
        }]
    };
    myChart.setOption(option);
}

//========================================================================
//入住期率柱状图
function loadStayRatesDate(data) {
    // alert("入住期率founction");
    let Data = {
        userName: getCookie('userName'),
        startDate: data.RatesStartDay,
        endDate: data.RatesEndDay,
    };
    new ajaxHttp('get', getUrl(2) + '/hotelData/findOccupancyRate', Data, (err) => {
        alert('系统故障，正在维护中，请稍后', err)
    }, (data) => {
        let dataArr = [];
        let dateNumber = '';
        let occupancyRate = '';
        let occupancyRateNumber = '';
        if (data.code === SUCCESSFULUSERLOGIN) {
            let Jsdata = data.content;
            dataArr = Jsdata.split(',');
            dateNumber = parseInt(dataArr[0]);
            occupancyRate = parseInt(dataArr[1]);
            occupancyRateNumber = dateNumber / occupancyRate;
            stayRates(parseInt(occupancyRateNumber))

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

//入住期率
function stayRates(ff) {
    // alert("入住期率cc是" + cc);
    // alert("入住期率dd是" + dd);
    let myChart = echarts.init(document.getElementById('stayRates'));
    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [{
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [
                {value: 100, name: '卖出房间总数'},
                {value: ff, name: '入住期率'},
            ]
        }]
    };
    myChart.setOption(option);
}

//========================================================================
//购买率
function purRatesSearch(data) {
    let Data = {
        userName: getCookie('userName'),
        startDate: data.purRatesStartDay,
        endDate: data.purRatesEndDay,
    };
    // purRates(['5','3','4'],['2','0','9'])
    new ajaxHttp('get', getUrl(2) + '/hotelData/findPurchaseRate', Data, (err) => {
        alert('系统故障，正在维护中，请稍后', err)
    }, (data) => {
        let dataArr = [];

        if (data.code === SUCCESSFULUSERLOGIN) {
            let Jsdata = data.content;
            dataArr = Jsdata.split(',');
            purRates(parseInt(dataArr[1]) - 1)
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

// 购买率
function purRates(data) {
    // alert("购买率" + cc + "购买率" + ee);
    let myChart = echarts.init(document.getElementById('purRates'));
    let option = {
        "title": {
            "text": '购买率',
            "top": '85%',
            "left": '45%',
            "textStyle": {
                "fontSize": 28,
                "fontWeight": "bold",
                "color": "#bcbfff"
            }
        },
        "tooltip": {
            "trigger": 'item',
            "formatter": "{a} : ({d}%)"
        },
        "series": [{
            "name": "购买率",
            "center": [
                "50%",
                "50%"
            ],
            "radius": [
                "49%",
                "50%"
            ],
            "clockWise": false,
            "hoverAnimation": false,
            "type": "pie",
            "data": [{
                "value": 1,
                "name": "",
                "label": {
                    "normal": {
                        "show": true,
                        "formatter": '{d} %',
                        "textStyle": {
                            "fontSize": 28,
                            "fontWeight": "bold"
                        },
                        "position": "center"
                    }
                },
                "labelLine": {
                    "show": false
                },
                "itemStyle": {
                    "normal": {
                        "color": "#5886f0",
                        "borderColor": new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00a2ff'
                        }, {
                            offset: 1,
                            color: '#70ffac'
                        }]),
                        "borderWidth": 25
                    },
                    "emphasis": {
                        "color": "#5886f0",
                        "borderColor": new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#85b6b2'
                        }, {
                            offset: 1,
                            color: '#6d4f8d'
                        }]),
                        "borderWidth": 25
                    }
                },
            }, {
                "name": " ",
                "value": data,
                "itemStyle": {
                    "normal": {
                        "label": {
                            "show": false
                        },
                        "labelLine": {
                            "show": false
                        },
                        "color": 'rgba(0,0,0,0)',
                        "borderColor": 'rgba(0,0,0,0)',
                        "borderWidth": 0
                    },
                    "emphasis": {
                        "color": 'rgba(0,0,0,0)',
                        "borderColor": 'rgba(0,0,0,0)',
                        "borderWidth": 0
                    }
                }
            }]
        }, {
            "name": "购买率",
            "center": [
                "50%",
                "50%"
            ],
            "radius": [
                "59%",
                "60%"
            ],
            "clockWise": false,
            "hoverAnimation": false,
            "type": "pie",
            "data": [{
                "value": 1,
                "name": "",
                "label": {
                    "normal": {
                        "show": true,
                        "formatter": '{d} %',
                        "textStyle": {
                            "fontSize": 28,
                            "fontWeight": "bold"
                        },
                        "position": "center"
                    }
                },
                "labelLine": {
                    "show": false
                },
                "itemStyle": {
                    "normal": {
                        "color": "#5886f0",
                        "borderColor": new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00a2ff'
                        }, {
                            offset: 1,
                            color: '#70ffac'
                        }]),
                        "borderWidth": 1
                    },
                    "emphasis": {
                        "color": "#5886f0",
                        "borderColor": new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#85b6b2'
                        }, {
                            offset: 1,
                            color: '#6d4f8d'
                        }]),
                        "borderWidth": 1
                    }
                },
            }, {
                "name": " ",
                "value": data,
                "itemStyle": {
                    "normal": {
                        "label": {
                            "show": false
                        },
                        "labelLine": {
                            "show": false
                        },
                        "color": 'rgba(0,0,0,0)',
                        "borderColor": 'rgba(0,0,0,0)',
                        "borderWidth": 0
                    },
                    "emphasis": {
                        "color": 'rgba(0,0,0,0)',
                        "borderColor": 'rgba(0,0,0,0)',
                        "borderWidth": 0
                    }
                }
            }]
        }]
    };
    myChart.setOption(option);
}

//-------------------------------------------------------------------------------------------------------
//客户来源饼图

function clientSource(data) {
    let Data = {
        userName: getCookie('userName'),
        startDate: data.clientSourceStartDay,
        endDate: data.clientSourceEndDay,
    };

    new ajaxHttp('get', getUrl(2) + '/hotelData/findPurchaseRate', Data, (err) => {
        alert('系统故障，正在维护中，请稍后', err)
    }, (data) => {
        let dateArr = '';
        let dateNumber = 0;
        let occupancyRate = 0;
        if (data.code === SUCCESSFULUSERLOGIN) {
            let Jsdata = data.content;
            dateArr = Jsdata.split(',');
            dateNumber = parseInt(dateArr[0]);
            occupancyRate = parseInt(dateArr[1]);

            comstomSource(dateNumber, occupancyRate)
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

function loadComstomSourceDate2(data) {
    // alert("开始b");
    let user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    let reArray = new Array();
    let bb = new Array();
    // alert(JSON.stringify(user));
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/SelectClientSourceServlet2",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectClientSourceServlet2",
        data: {
            "strClientSource2": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后");
        },
        success: function(data) {
            // alert("bbbbbbbbbbb" + data);
            bb = data;
            // alert("所有客户来源"+bb);
        }
    });
    return bb;
}


function comstomSource(aa, bb) {
    let myChart = echarts.init(document.getElementById('comstomSource'));
    let option = {
        backgroundColor: '#2c343c',

        title: {
            text: '客户来源饼形图',
            left: 'center',
            top: 20,
            textStyle: {
                color: 'white'
            }
        },

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['red', 'green'],

        visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
                colorLightness: [0, 1]
            }
        },
        series: [{
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [{
                value: aa-bb,
                name: '所有客户来源'
            }, {
                value: bb,
                name: 'OTA客户来源'
            }].sort(function(a, b) {
                return a.value - b.value;
            }),
            roseType: 'radius',
            label: {
                normal: {
                    textStyle: {
                        color: '#5FB878'
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                }
            },
            itemStyle: {
                normal: {
                    color: '#c23531',
                    shadowBlur: 200,
                    shadowColor: '#1E9FFF'
                },
                emphasis: {
                    color: 'red',
                }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function(idx) {
                return Math.random() * 200;
            }
        }]
    };

    myChart.setOption(option);
}

//------------------------------------------------------------------------------
function mostBad(data) {
    let Data = {
        userName: getCookie('userName'),
        startDate: data.mostBadStartDay,
        endDate: data.mostBadEndDay,
    };
    new ajaxHttp('get', getUrl(2) + '/hotelData/findMonthsSaleDetails', Data, (err) => {
        alert('系统故障，正在维护中，请稍后', err)
    }, (data) => {
        let dateArr = [];
        let dateNumber = [];
        let dateArr2 = [];
        let dateNumber2 = [];
        if (data.code === SUCCESSFULUSERLOGIN) {
            let Jsdata = data.content;
            for (let i = 0; i < Jsdata.length; i++) {
                let DataArr = Jsdata[i].split(',')
                dateArr.push(DataArr[0]);
                dateNumber.push(DataArr[1]);
            }
            new ajaxHttp('get', getUrl(2) + '/hotelData/findWeeksSaleDetails', Data, (err) => {
                alert('系统故障，正在维护中，请稍后', err)
            }, (data) => {
                if (data.code === SUCCESSFULUSERLOGIN) {
                    let Jsdata = data.content;
                    for (let i = 0; i < Jsdata.length; i++) {
                        let DataArr = Jsdata[i].split(',')
                        dateArr2.push(DataArr[0]);
                        dateNumber2.push(DataArr[1]);
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
            });
            worthWNM(dateArr, dateNumber);
            worthWNM2(dateArr2, dateNumber2)
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

//七天 按天显示数据
function loadMostBadResult(data) {
    let user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    //alert(JSON.stringify(user));
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/SelectWorstWeekServlet",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectWorstWeekServlet",
        data: {
            "strSelectWorstWeek": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后");
        },
        success: function(data) {
            //alert("aaaaaaa" + data);
            aa = data.split(",");
            return aa;
        }
    });
    return aa;
}

//一月 按周显示数据
function loadMostBadResult1(data) {
    let user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    //alert(JSON.stringify(user));
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/SelectWorstMonthServlet",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectWorstMonthServlet",
        data: {
            "strSelectWorstMonth": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后");
        },
        success: function(data) {
            //alert("bbbbb:" + data);
            bb = data.split(",");
            return bb;
        }
    });
    return bb;

}

//一年 按月显示数据
function loadMostBadResult2(data) {
    let user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    // alert(JSON.stringify(user));
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/SelectWorstYearServlet",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectWorstYearServlet",
        data: {
            "strSelectWorstYear": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后");
        },
        success: function(data) {
            // alert("ccccc" + data);
            cc = data.split(",");
            return cc;
        }
    });
    return cc;
}

//

function worthWNM(date, number) {
    let myChart = echarts.init(document.getElementById('worthWNM'));
    let option = {
        backgroundColor: '#394056',
        title: {
            text: '最差的月',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 16,
                color: '#F1F1F3'
            },
            left: '6%'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#57617B'
                }
            }
        },
        legend: {
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            data: ['最差的月'],
            right: '4%',
            textStyle: {
                fontSize: 12,
                color: '#F1F1F3'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#57617B'
                }
            },
            data: date,
        }, {
            axisPointer: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#57617B'
                }
            },
            axisTick: {
                show: false
            },

            position: 'bottom',
            offset: 20,
            data: ['', '', '', '', '', '', '', '', '', '', {
                value: '',
                textStyle: {
                    align: 'left'
                }
            }, '']
        }],
        yAxis: [{
            type: 'value',
            name: '单位（%）',
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#57617B'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 14
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#57617B'
                }
            }
        }],
        series: [{
            name: '房间售出数量',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(137, 189, 27, 0.3)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(137, 189, 27, 0)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(137,189,27)',
                    borderColor: 'rgba(137,189,2,0.27)',
                    borderWidth: 12

                }
            },
            data: number,
        }]
    };
    myChart.setOption(option);
}

function worthWNM2(date, number) {
    let myChart = echarts.init(document.getElementById('worthWNM2'));
    let option = {
        backgroundColor: '#394056',
        title: {
            text: '最差的周',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 16,
                color: '#F1F1F3'
            },
            left: '6%'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#57617B'
                }
            }
        },
        legend: {
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            data: ['最差的周'],
            right: '4%',
            textStyle: {
                fontSize: 12,
                color: '#F1F1F3'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#57617B'
                }
            },
            data: date,
        }, {
            axisPointer: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#57617B'
                }
            },
            axisTick: {
                show: false
            },

            position: 'bottom',
            offset: 20,
            data: ['', '', '', '', '', '', '', '', '', '', {
                value: '',
                textStyle: {
                    align: 'left'
                }
            }, '']
        }],
        yAxis: [{
            type: 'value',
            name: '单位（%）',
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#57617B'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 14
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#57617B'
                }
            }
        }],
        series: [{
            name: '房间售出数量',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(137, 189, 27, 0.3)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(137, 189, 27, 0)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(137,189,27)',
                    borderColor: 'rgba(137,189,2,0.27)',
                    borderWidth: 12

                }
            },
            data: number,
        }]
    };
    myChart.setOption(option);
}

//---------------------------------------------------
//将aa,bb,cc放在一起
function accountBookPay(data) {

    let Data = {
        userName: getCookie('userName'),
        startDate: data.accountBookPayStartDay,
        endDate: data.accountBookPayEndDay,
    };

    new ajaxHttp('get', getUrl(2) + '/hotelData/findProfitComparison', Data, (err) => {
        alert('系统故障，正在维护中，请稍后', err)
    }, (data) => {
        let dateArr = [];
        let incomeNumber = 0;
        let outNumber = 0;
        let houseaccount = 0;
        if (data.code === SUCCESSFULUSERLOGIN) {
            let Jsdata = data.content;
            dateArr = Jsdata.split(',');
            houseaccount = dateArr[0];
            incomeNumber = dateArr[1];
            outNumber = dateArr[2];
            let e= parseInt(houseaccount) +  parseInt(incomeNumber);
            let d= e - parseInt(outNumber)
            wholeVspure(d, e)
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


//     let aa = loadDatewholeVspure(data);
//     let bb = loadDatewholeVspure1(data);
//     let cc = loadDatewholeVspure2(data);
//     let f = Number(aa);
//     let g = Number(bb);
//     let h = Number(cc);
//     let d = f + g;
//     let e = f + g - h;
//     // alert("dddddd" + d + "eeee" + e);
//     // alert("d的类型是：" + typeof d)
//     wholeVspure(d, e);
//
// }
//
// //房间总收入
// function loadDatewholeVspure(data) {
//     // alert("我是第一个函数")
//     let user = {
//         "userName": getCookie('userName'),
//         "password": getCookie('password'),
//         "a": data.a,
//         "b": data.b,
//     };
//     let reArray = new Array();
//     let aa = new Array();
//     //   alert(JSON.stringify(user));
//     $.ajax({
//         cache: true,
//         type: "POST",
//         url: getUrl() + "/HotelPMS/EditSumBillServlet",
//         // url: "http://10.168.10.190:8080/HotelPMS/EditSumBillServlet",
//         data: {
//             "strEditSumBill": JSON.stringify(user)
//         },
//         async: false,
//         error: function(request) {
//             alert("数据错误，请稍后");
//         },
//         success: function(data) {
//             // alert(data);
//             aa = data;
//             // alert("所有客户来源aa" + aa);
//         }
//     });
//     return aa;
}


//小账本总收入
function loadDatewholeVspure1(data) {
    // alert("开始1");
    let user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    let reArray = new Array();
    let aa = new Array();
    // alert(JSON.stringify(user));
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/SelectCountingBookAllServlet",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectCountingBookAllServlet",
        data: {
            "strSelectCountingBookAll": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后 ");
        },
        success: function(data) {
            // alert(data);
            bb = data;
            // alert("所有客户来源bb" + bb);
        }
    });
    return bb;
}


//小账本总支出
function loadDatewholeVspure2(data) {
    // alert("开始2");
    let user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    let reArray = new Array();
    let aa = new Array();
    // alert(JSON.stringify(user));
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/SelectCountingBookPayAllServlet",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectCountingBookPayAllServlet",
        data: {
            "strSelectCountingBookPayAll": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后");
        },
        success: function(data) {
            // alert(data);
            cc = data;
            // alert("所有客户来源cc" + cc);
        }
    });
    return cc;
}


//账本花销折线图
function wholeVspure(d, e) {
    let myChart = echarts.init(document.getElementById('wholeVspure'));
    let option = {
        title: {
            text: '总利润vs净利润',
            subtext: '',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['总利润', '净利润']
        },
        series: [{
            name: '利润',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [{
                value: d,
                name: '净利润'
            }, {
                value: e,
                name: '总利润'
            },],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    myChart.setOption(option);
}

function getNowTime() {
    let time = new Date();
    let allInput = $('input');
    let allButton = $('button');
    for(let i = 0 ; i < allInput.length;i++){
        $(allInput[i]).val(fmtDate(time))
    }
    for(let j = 0 ; j<allButton.length;j++){
        // $(allButton[j]).click()
    }
}

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