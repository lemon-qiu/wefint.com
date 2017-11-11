//--------------------------------------------------------------------------- 
function loadDate() {
    // alert("dsahdsajk");
    var user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
    };
    var reArray = new Array();
    var aa = new Array();
    var bb = new Array();
    // alert(JSON.stringify(user));
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/SelectRoomServlet",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectRoomServlet",
        data: {
            "strRoomType": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误");
        },
        success: function(data) {
            // alert(data);
            reArray = data.split(",");
            // alert("reArray.length=" + reArray.length)
            for (var i = 0; i < reArray.length / 2; i++) {
                aa[i] = reArray[i * 2];
                bb[i] = reArray[i * 2 + 1];
            }
            roomType(aa, bb);
        }
    });
}

function roomType(aa, bb) {
    var myChart = echarts.init(document.getElementById('roomType'));
    var option = {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
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
            data: aa,
            axisTick: {
                alignWithLabel: true
            }
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: '房间数量',
            type: 'bar',
            barWidth: '60%',
            data: bb
        }]
    };
    myChart.setOption(option);
}
//-----------------------------------------------------------------
//额外花销
//汇总收入和支出
function expendSearch(data) {
    //收入金额
    var aa = loadDateExSpend(data);
    //收入时间
    var aatime = loadDateExSpendTime(data);
    //支出金额
    var bb = loadDateExSpend2(data);
    //支出时间
    var bbtime = loadDateExSpendTime2(data);
    // console.log(aa);
    // console.log(aatime);
    // console.log(bb);
    // console.log(bbtime);
    ExSpend(aa, aatime, bb, bbtime);
}
//收入金额
function loadDateExSpend(data) {
    var user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    // alert("收入金额");
    // alert(JSON.stringify(user));
    var a = new Array();
    $.ajax({
        cache: true,
        type: "POST",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectCountingBookServlet",
        url: getUrl() + "/HotelPMS/SelectCountingBookServlet",
        data: {
            "strCountBook": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后");
        },
        success: function(data) {
            // alert("收入:" + data);
            aa = data.split(",");
            return aa;
        }
    });
    return aa;
}
//收入 时间
function loadDateExSpendTime(data) {
    var user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    // alert("收入时间");
    // alert(JSON.stringify(user));
    // var reArray = new Array();
    $.ajax({
        cache: true,
        type: "POST",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectCountingBookDateServlet",
        url: getUrl() + "/HotelPMS/SelectCountingBookDateServlet",
        data: {
            "strSelectCountingBookDate": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后");
        },
        success: function(data) {
            // alert("收入时间:" + data);
            aatime = data.split(",");
            return aatime;
        }
    });
    return aatime;
}

//支出金额
function loadDateExSpend2(data) {
    var user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    // alert("支出金额");
    // alert(JSON.stringify(user));
    $.ajax({
        cache: true,
        type: "POST",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectCountingBookPayServlet",
        url: getUrl() + "/HotelPMS/SelectCountingBookPayServlet",
        data: {
            "strCountBookPay": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后");
        },
        success: function(data) {
            // alert("支出金额:" + data);
            bb = data.split(",");
            return bb;
        }
    });
    return bb;
}
//支出时间
function loadDateExSpendTime2(data) {
    var user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    // alert("支出时间");
    // alert(JSON.stringify(user));
    $.ajax({
        cache: true,
        type: "POST",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectCountingBookPayDateServlet",
        url: getUrl() + "/HotelPMS/SelectCountingBookPayDateServlet",
        data: {
            "strSelectCountingBookPayDate": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后");
        },
        success: function(data) {
            // alert("支出时间:" + data);
            bbtime = data.split(",");
            return bbtime;
        }
    });
    return bbtime;

}

function ExSpend(aa, aatime, bb, bbtime) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('ExSpend'));
    // 指定图表的配置项和数据
    var colors = ['#5793f3', '#d14a61', '#675bba'];
    var option = {
        color: colors,
        tooltip: {
            trigger: 'none',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['收入', '支出']
        },
        grid: {
            top: 70,
            bottom: 50
        },
        xAxis: [{
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            axisLine: {
                onZero: false,
                lineStyle: {
                    color: colors[1]
                }
            },
            axisPointer: {
                label: {
                    formatter: function(params) {
                        return '收入  ' + params.value +
                            (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                    }
                }
            },
            data: aatime,
        }, {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            axisLine: {
                onZero: false,
                lineStyle: {
                    color: colors[0]
                }
            },
            axisPointer: {
                label: {
                    formatter: function(params) {
                        return '支出  ' + params.value +
                            (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                    }
                }
            },
            data: bbtime,
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: '收入',
            type: 'line',
            xAxisIndex: 1,
            smooth: true,
            data: aa
        }, {
            name: '支出',
            type: 'line',
            smooth: true,
            data: bb
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
//===================================================================================
//售出过夜和出售过夜率
function NsVsratesSearch(data) {
    //每天卖出的房间个数及对应的时间
    var aa = loadDateNsVsRates(data);
    var a = new Array();
    var b = new Array();
    for (var i = 0; i < aa.length / 2; i++) {
        a[i] = aa[i * 2];
        b[i] = aa[i * 2 + 1];
    }
    // console.log(a);
    // console.log(b);
    //卖出房间的总数
    var bb = loadDateNsVsRates1(data);
    var e = Number(bb);
    // alert("e是" + typeof e);
    //算比值
    var c = new Array();
    for (var j = 0; j < b.length; j++) {
        c[j] = (Number(b[j]) / e).toFixed(2);
    }
    // console.log(c);
    NsVsRates(a, b, c);

}
//每天卖出的房间个数及对应的时间
function loadDateNsVsRates(data) {
    var user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    // alert(JSON.stringify(user));
    // var reArray = new Array();
    // var aa = new Array();
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/SelectRoomSaleServlet",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectRoomSaleServlet",
        data: {
            "strRoomSale": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后");
        },
        success: function(data) {
          //  alert("每天房间:" + data);
            aa = data.split(",");
            //  alert(aa+"数量");
            return aa;
        }
    });
    return aa;
}
//这段时间内卖出的所有的房间的个数
function loadDateNsVsRates1(data) {
    var user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    // alert(JSON.stringify(user));
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/SelectRoomAllSaleServlet",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectRoomAllSaleServlet",
        data: {
            "strAllRoomSale": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后");
        },
        success: function(data) {
           // alert("卖出房间的总个数:" + data);
            // bb = data.split(",");
            // alert(bb+"所有数量");
            bb = data;
            return bb;
        }
    });
    return bb;
}
//售出过夜vs出售过夜率
function NsVsRates(a, b, c) {
    // alert("aaaaaa"+aa);
    // alert("bbbbbb"+bb);
    var myChart = echarts.init(document.getElementById('NsVsRates'));
    var option = {
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
        // toolbox: {
        //     feature: {
        //         saveAsImage: {}
        //     }
        // },
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
    var user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    var reArray = new Array();
    var cc = new Array();
    var dd = new Array();
    // alert(JSON.stringify(user));
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/SelectBuyServlet",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectBuyServlet",
        data: {
            "strSelectBuy": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后");
        },
        success: function(data) {
            // alert("data是" + data);
            reArray = data.split(",");

            // alert(reArray.length)
            for (var i = 0; i < reArray.length / 2; i++) {
                cc[i] = reArray[i * 2];
                dd[i] = reArray[i * 2 + 1];
            }
            // alert("ccccc" + typeof cc);
            // alert("dddd" + typeof dd);
            var ff = ((cc / dd) * 100).toFixed(2);
            stayRates(ff);
        }
    });
}
//入住期率
function stayRates(ff) {
    // alert("入住期率cc是" + cc);
    // alert("入住期率dd是" + dd);
    var myChart = echarts.init(document.getElementById('stayRates'));
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
                { value: 100, name: '卖出房间总数' },
                { value: ff, name: '入住期率' },
            ]
        }]
    };
    myChart.setOption(option);
}

//========================================================================
//购买率
// function loadPurRatesDate() {
//     var reArray1 = buyPow();
//     var reArray2 = buyPowSum();
//     var a = new Array();
//     var b = new Array();
//     var d = new Array();
//     var e = new Array();
//     for (var i = 0; i < reArray1.length / 2; i++) {
//         a[i] = aa[i * 2];
//         b[i] = aa[i * 2 + 1];
//     }
//     for (var i = 0; i < reArray2.length / 2; i++) {
//         d[i] = bb[i * 2];
//         e[i] = bb[i * 2 + 1];
//     }
//     alert("a是" + a);
//     alert("b是" + b);
//     alert("d是" + d);
//     alert("e是" + e);
//     purRates(a, b, d, e);
// }
function purRatesSearch(data) {
    var aa = buyPow(data);
    var bb = buyPowSum(data);
    console.log(aa);
    console.log(bb);
    var cc = new Array();
    var dd = new Array();

    for (var i = 0; i < bb.length / 2; i++) {
        cc[i] = bb[i * 2];
        dd[i] = bb[i * 2 + 1];
    }
    //console.log(cc);
    //console.log(dd);

    //算除法
    var ee = new Array();
    for (var i = 0; i < dd.length; i++) {
        ee[i] = (Number(dd[i]) / Number(aa)).toFixed(2);
    }
    console.log(ee);
   // alert("cc的类型是:" + typeof cc)
    purRates(cc, ee);

}
//该时间段内售出的总房间数
function buyPow(data) {
    var user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/SelectOccupancyServlet",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectOccupancyServlet",
        data: {
            "strSelectOccupancy": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后");
        },
        success: function(data) {
           // alert("该时间段内售出的总房间数:" + data)
            aa = data;
            return aa
        }
    });
    return aa
}
//该段时间内所有的房间以及卖出的数量
function buyPowSum(data) {
    var user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/SelectRoomSaleServlet",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectRoomSaleServlet",
        data: {
            "strRoomSale": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后");
        },
        success: function(data) {
           // alert("该段时间内所有的房间以及卖出的数量:" + data);
            bb = data.split(",");
            // for (var i = 0; i < reArray.length / 2; i++) {
            //     cc[i] = reArray[i * 2];
            //     dd[i] = reArray[i * 2 + 1];
            // }
            return bb
        }
    });
    return bb
}
// function loadPurRatesDate() {
//     // alert("dsahdsajk");
//     var user = {
//         "userName": getCookie('userName'),
//         "password": getCookie('password'),
//         // "userName": "998",
//         // "password": "password",
//     };
//     var reArray = new Array();
//     var cc = new Array();
//     // alert(JSON.stringify(user));
//     $.ajax({
//         cache: true,
//         type: "POST",
//         //  url: getUrl() + "/HotelPMS/SelectBuyServlet",
//         url: "http://localhost:8080/HotelPMS/SelectBuyServlet",
//         data: {
//             "strSelectBuy": JSON.stringify(user)
//         },
//         async: false,
//         error: function(request) {
//             alert("数据错误，请稍后");
//         },
//         success: function(data) {
//             // alert(data);
//             cc = data.split(",");
//             purRates(cc);
//         }
//     });
// }



// 购买率
function purRates(cc, ee) {
   // alert("购买率" + cc + "购买率" + ee);
    var myChart = echarts.init(document.getElementById('purRates'));
    // var data = [
    //     [

    //         [ee[0], ee[1], ee[2]],
    //         [ee[0], ee[1], ee[2]],
    //         // [cc[0], cc[1], cc[2]],

    //         // [ee, cc, 321773631, 'China', 2017],
    //         // [ee, cc, 321773631, 'China', 2017],
    //         // [ee, cc, 321773631, 'China', 2017],
    //         // [ee, cc, 321773631, 'China', 2017]

    //     ]
    // ];

    var option = {
        backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
            offset: 0,
            color: '#f7f8fa'
        }, {
            offset: 1,
            color: '#cdd0d5'
        }]),
        title: {
            text: '购买率'
        },
        legend: {
            right: 10,
            data: ['2017']
        },
        xAxis: {

            type: 'category',
            data: cc,
            axisTick: {
                alignWithLabel: true
            }
            // splitLine: {
            //     lineStyle: {
            //         data: [cc[0], cc[1], cc[2]],
            //         // type: 'dashed'
            //     }
            // }
        },
        yAxis: {
            type: 'value',
            // splitLine: {
            //     lineStyle: {
            //         type: 'dashed'
            //     }
            // },
            scale: true
        },
        series: [{
                // name: '2017',
                data: ee,
                type: 'scatter',
                symbolSize: function(data) {
                    return Math.sqrt(data[2]) * 20;
                },
                label: {
                    emphasis: {
                        show: true,
                        formatter: function(param) {
                            return param.data[3];
                        },
                        position: 'top'
                    }
                },
                itemStyle: {
                    normal: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(120, 36, 50, 0.5)',
                        shadowOffsetY: 5,
                        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                            offset: 0,
                            color: 'rgb(251, 118, 123)'
                        }, {
                            offset: 1,
                            color: 'rgb(204, 46, 72)'
                        }])
                    }
                }
            },
            // {
            //     name: '',
            //     data: data[1],
            //     type: 'scatter',
            //     symbolSize: function(data) {
            //         return Math.sqrt(data[2]) / 5e2;
            //     },
            //     label: {
            //         emphasis: {
            //             show: true,
            //             formatter: function(param) {
            //                 return param.data[3];
            //             },
            //             position: 'top'
            //         }
            //     },
            //     itemStyle: {
            //         normal: {
            //             shadowBlur: 10,
            //             shadowColor: 'rgba(25, 100, 150, 0.5)',
            //             shadowOffsetY: 5,
            //             color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
            //                 offset: 0,
            //                 color: 'rgb(129, 227, 238)'
            //             }, {
            //                 offset: 1,
            //                 color: 'rgb(25, 183, 207)'
            //             }])
            //         }
            //     }
            // }
        ]
    };
    myChart.setOption(option);
}
//-------------------------------------------------------------------------------------------------------
//客户来源饼图
// function loadComstomSourceDateMain() {
//     var aa = loadComstomSourceDate();
//     var bb = loadComstomSourceDate2();
//     comstomSource(aa, bb);
// }
function clientSource(data) {
    var aa = loadComstomSourceDate(data);
    var bb = loadComstomSourceDate2(data);
    comstomSource(aa, bb);
}

function loadComstomSourceDate(data) {
    // alert("开始1");
    var user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    var reArray = new Array();
    var aa = new Array();
    // alert(JSON.stringify(user));
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/SelectClientSourceServlet",
        // url: "http://10.168.10.190:8080/HotelPMS/SelectClientSourceServlet",
        data: {
            "strClientSource": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后");
        },
        success: function(data) {
            // alert("aaaaaaa" + data);
            aa = data;
            // alert("所有客户来源"+aa);
        }
    });
    return aa;
}

function loadComstomSourceDate2(data) {
    // alert("开始b");
    var user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    var reArray = new Array();
    var bb = new Array();
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
    var myChart = echarts.init(document.getElementById('comstomSource'));
    var option = {
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
                value: aa,
                name: '所有客户来源'
            }, {
                value: aa - bb,
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
    //计算天数差的函数，通用  
    var a = data.a;
    var b = data.b;
    //alert(a)
    //alert(b)
        //函数
    var aa = loadMostBadResult(data);
    var bb = loadMostBadResult1(data);
    var cc = loadMostBadResult2(data);
    // var chooseDate = aa;
    // chooseDate.substring(0,3);
    var myDate = new Date();
    myDate.setFullYear(a.substring(0, 4), a.substring(5, 7), a.substring(8, 10));
    var myDate1 = new Date();
    myDate1.setFullYear(b.substring(0, 4), b.substring(5, 7), b.substring(8, 10));
    var day = Date.parse(myDate1) - Date.parse(myDate);
    var days = (day / (1000 * 60 * 60 * 24)) + 1;
    // alert(days);
    if (days <= 7) {
       // alert("我是7天");
      //  alert("aa是" + aa);
        var head = "一";
        var dd = new Array();
        var ee = new Array();
        for (var i = 0; i < aa.length / 2; i++) {
            dd[i] = aa[i * 2];
            ee[i] = aa[i * 2 + 1];
        }
        // console.log(head);
        // console.log(dd);
        // console.log(ee);
        worthWNM(head, dd, ee);
    } else if (days > 7 && days <= 31) {
       // alert("我是30天");
        var head = new Array();
        var dd = new Array();
        var ee = new Array();
        for (var i = 0; i < bb.length / 3; i++) {
            head[i] = bb[i * 3];
            dd[i] = bb[i * 3 + 1];
            ee[i] = bb[i * 3 + 2];
        }
        //==============================================
        // function removeDuplicatedItem3(head) {
        //     var ret = [];

        //     head.forEach(function(e, i, head) {
        //         if (head.indexOf(e) === i) {
        //             ret.push(e);
        //         }
        //     });

        //     return ret;
        // }
        // let arr = [1, 2, 3, 3];
        let arr = head;
        let resultarr = [...new Set(arr)];
        //console.log(resultarr); //[1,2,3]
        // let head = resultarr;
        //==============================================
        // console.log(head);
        //console.log(dd);
        //console.log(ee);
        worthWNM(resultarr, dd, ee);
    } else {
       // alert("我是按月算");
        var head = new Array();
        var dd = new Array();
        var ee = new Array();
        for (var i = 0; i < cc.length / 3; i++) {
            head[i] = cc[i * 3];
            dd[i] = cc[i * 3 + 1];
            ee[i] = cc[i * 3 + 2];
        }
        let arr = head;
        let resultarr = [...new Set(arr)];
        //console.log(resultarr); //[1,2,3]
        // console.log(head);
        //console.log(dd);
        //console.log(ee);
        worthWNM(resultarr, dd, ee);
    }
}
//七天 按天显示数据
function loadMostBadResult(data) {
    var user = {
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
    var user = {
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
    var user = {
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
function worthWNM(resultarr, dd, ee) {
    // console.log(head);
    // console.log(dd);
    // console.log(ee);
    var myChart = echarts.init(document.getElementById('worthWNM'));
    // 基于准备好的dom，初始化echarts实例
    // 指定图表的配置项和数据
    var hours = dd;
    // ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
    //     '7a', '8a', '9a', '10a', '11a',
    //     '12p', '1p', '2p', '3p', '4p', '5p',
    //     '6p', '7p', '8p', '9p', '10p', '11p'
    // ];
    var days = resultarr;
    // ['Saturday', 'Friday', 'Thursday',
    //     'Wednesday', 'Tuesday', 'Monday', 'Sunday'
    // ];

    var data = ee;
    // [
    //     [0, 0, 5],
    //     [0, 1, 1],
    //     [0, 2, 0],
    //     [0, 3, 0],
    //     [0, 4, 0],
    //     [0, 5, 0],
    //     [0, 6, 0],
    //     [0, 7, 0],
    //     [0, 8, 0],
    //     [0, 9, 0],
    //     [0, 10, 0],
    //     [0, 11, 2],
    //     [0, 12, 4],
    //     [0, 13, 1],
    //     [0, 14, 1],
    //     [0, 15, 3],
    //     [0, 16, 4],
    //     [0, 17, 6],
    //     [0, 18, 4],
    //     [0, 19, 4],
    //     [0, 20, 3],
    //     [0, 21, 3],
    //     [0, 22, 2],
    //     [0, 23, 5],

    //     [1, 0, 7],
    //     [1, 1, 0],
    //     [1, 2, 0],
    //     [1, 3, 0],
    //     [1, 4, 0],
    //     [1, 5, 0],
    //     [1, 6, 0],
    //     [1, 7, 0],
    //     [1, 8, 0],
    //     [1, 9, 0],
    //     [1, 10, 5],
    //     [1, 11, 2],
    //     [1, 12, 2],
    //     [1, 13, 6],
    //     [1, 14, 9],
    //     [1, 15, 11],
    //     [1, 16, 6],
    //     [1, 17, 7],
    //     [1, 18, 8],
    //     [1, 19, 12],
    //     [1, 20, 5],
    //     [1, 21, 5],
    //     [1, 22, 7],
    //     [1, 23, 2],

    //     [2, 0, 1],
    //     [2, 1, 1],
    //     [2, 2, 0],
    //     [2, 3, 0],
    //     [2, 4, 0],
    //     [2, 5, 0],
    //     [2, 6, 0],
    //     [2, 7, 0],
    //     [2, 8, 0],
    //     [2, 9, 0],
    //     [2, 10, 3],
    //     [2, 11, 2],
    //     [2, 12, 1],
    //     [2, 13, 9],
    //     [2, 14, 8],
    //     [2, 15, 10],
    //     [2, 16, 6],
    //     [2, 17, 5],
    //     [2, 18, 5],
    //     [2, 19, 5],
    //     [2, 20, 7],
    //     [2, 21, 4],
    //     [2, 22, 2],
    //     [2, 23, 4],

    //     [3, 0, 7],
    //     [3, 1, 3],
    //     [3, 2, 0],
    //     [3, 3, 0],
    //     [3, 4, 0],
    //     [3, 5, 0],
    //     [3, 6, 0],
    //     [3, 7, 0],
    //     [3, 8, 1],
    //     [3, 9, 0],
    //     [3, 10, 5],
    //     [3, 11, 4],
    //     [3, 12, 7],
    //     [3, 13, 14],
    //     [3, 14, 13],
    //     [3, 15, 12],
    //     [3, 16, 9],
    //     [3, 17, 5],
    //     [3, 18, 5],
    //     [3, 19, 10],
    //     [3, 20, 6],
    //     [3, 21, 4],
    //     [3, 22, 4],
    //     [3, 23, 1],

    //     [4, 0, 1],
    //     [4, 1, 3],
    //     [4, 2, 0],
    //     [4, 3, 0],
    //     [4, 4, 0],
    //     [4, 5, 1],
    //     [4, 6, 0],
    //     [4, 7, 0],
    //     [4, 8, 0],
    //     [4, 9, 2],
    //     [4, 10, 4],
    //     [4, 11, 4],
    //     [4, 12, 2],
    //     [4, 13, 4],
    //     [4, 14, 4],
    //     [4, 15, 14],
    //     [4, 16, 12],
    //     [4, 17, 1],
    //     [4, 18, 8],
    //     [4, 19, 5],
    //     [4, 20, 3],
    //     [4, 21, 7],
    //     [4, 22, 3],
    //     [4, 23, 0],

    //     [5, 0, 2],
    //     [5, 1, 1],
    //     [5, 2, 0],
    //     [5, 3, 3],
    //     [5, 4, 0],
    //     [5, 5, 0],
    //     [5, 6, 0],
    //     [5, 7, 0],
    //     [5, 8, 2],
    //     [5, 9, 0],
    //     [5, 10, 4],
    //     [5, 11, 1],
    //     [5, 12, 5],
    //     [5, 13, 10],
    //     [5, 14, 5],
    //     [5, 15, 7],
    //     [5, 16, 11],
    //     [5, 17, 6],
    //     [5, 18, 0],
    //     [5, 19, 5],
    //     [5, 20, 3],
    //     [5, 21, 4],
    //     [5, 22, 2],
    //     [5, 23, 0],

    //     [6, 0, 1],
    //     [6, 1, 0],
    //     [6, 2, 0],
    //     [6, 3, 0],
    //     [6, 4, 0],
    //     [6, 5, 0],
    //     [6, 6, 0],
    //     [6, 7, 0],
    //     [6, 8, 0],
    //     [6, 9, 0],
    //     [6, 10, 1],
    //     [6, 11, 0],
    //     [6, 12, 2],
    //     [6, 13, 1],
    //     [6, 14, 3],
    //     [6, 15, 4],
    //     [6, 16, 0],
    //     [6, 17, 0],
    //     [6, 18, 0],
    //     [6, 19, 0],
    //     [6, 20, 1],
    //     [6, 21, 2],
    //     [6, 22, 2],
    //     [6, 23, 6]
    // ];

    var option = {
        tooltip: {
            position: 'top'
        },
        title: [],
        singleAxis: [],
        series: []
    };

    echarts.util.each(days, function(day, idx) {
        option.title.push({
            textBaseline: 'middle',
            top: (idx + 0.5) * 100 / 7 + '%',
            text: day
        });
        option.singleAxis.push({
            left: 150,
            type: 'category',
            boundaryGap: false,
            data: dd, //
            top: (idx * 100 / 7 + 5) + '%',
            height: (100 / 7 - 10) + '%',
            axisLabel: {
                interval: 2
            }
        });
        option.series.push({
            singleAxisIndex: idx,
            coordinateSystem: 'singleAxis',
            type: 'scatter',
            data: ee, //
            symbolSize: function(dataItem) {
                return dataItem[0] * 6;
            }
        });
    });

    // echarts.util.each(data, function(dataItem) {
    //     option.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
    // });
    myChart.setOption(option);
}




//---------------------------------------------------
//将aa,bb,cc放在一起
function accountBookPay(data) {
    var aa = loadDatewholeVspure(data);
    var bb = loadDatewholeVspure1(data);
    var cc = loadDatewholeVspure2(data);
    var f = Number(aa);
    var g = Number(bb);
    var h = Number(cc);
    var d = f + g;
    var e = f + g - h;
    // alert("dddddd" + d + "eeee" + e);
    // alert("d的类型是：" + typeof d)
    wholeVspure(d, e);

}

//房间总收入
function loadDatewholeVspure(data) {
    // alert("我是第一个函数")
    var user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    var reArray = new Array();
    var aa = new Array();
    //   alert(JSON.stringify(user));
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/EditSumBillServlet",
        // url: "http://10.168.10.190:8080/HotelPMS/EditSumBillServlet",
        data: {
            "strEditSumBill": JSON.stringify(user)
        },
        async: false,
        error: function(request) {
            alert("数据错误，请稍后");
        },
        success: function(data) {
            // alert(data);
            aa = data;
            // alert("所有客户来源aa" + aa);
        }
    });
    return aa;
}



//小账本总收入
function loadDatewholeVspure1(data) {
    // alert("开始1");
    var user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    var reArray = new Array();
    var aa = new Array();
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
    var user = {
        "userName": getCookie('userName'),
        "password": getCookie('password'),
        "a": data.a,
        "b": data.b,
    };
    var reArray = new Array();
    var aa = new Array();
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
    var myChart = echarts.init(document.getElementById('wholeVspure'));
    var option = {
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
                name: '总利润'
            }, {
                value: e,
                name: '净利润'
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