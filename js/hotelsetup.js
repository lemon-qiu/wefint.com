/**
 * @Created with fly.
 * @User: z1163764648.com
 * @Date: 2017/11/6
 * @Time: 20:31
 */
layui.use(['laydate', 'form', 'layedit', 'jquery'], function() {
    let laydate = layui.laydate
        , form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit;
});

/**
 * 获取房间得信息
 * @returns {boolean}
 */
function getMes() {
    let Data = {"userName": getCookie("userName")};
    new ajaxHttp("get", getUrl(3) + "/portal/findHotelInfo", Data, function(request) {
        alert("获取状态失败，请稍后")
    }, function(data) {
        let b = new Base64();
        if (data.code === SUCCESSFULUSERLOGIN) {
            let objs = eval(data.content);
            $('#userName').val(b.decode(objs.userName));
            $('#createTime').val(objs.createTime);
            $('#phoneNumber').val(objs.phoneNumber);
            $('#email').val(objs.email);
            $('#hotelName').val(objs.hotelName);
            $('#hotelGrade').val(objs.hotelGrade);
            if (objs.loginRoleLevel === '1')
                $('#loginRoleLevel').val(objs.loginRoleLevel);
        } else if (data.code === DATAALREADYEXISTS) {
            alert('业务数据已经存在')
        } else if (data.code === INSUFFICIENTPRIVILEGE) {

            alert("权限不够，请联系管理员！");
        } else {
            alert('系统故障,请刷新浏览器')
        }
    });
    return false
}


/**
 * 添加客栈员工的方法
 * @param E 添加客栈房间得对象
 * @returns {boolean}
 */
function employeeManage(E) {
    let D = new Base64();
    let C = E.userName0;
    let B = E.password0;
    let Data = {
        "userName": getCookie("userName"),
        "employee": C,
        "employeePassword": B,
        "registerName": E.registerName,
        "phoneNumber": E.phoneNumber,
        "loginRole": E.loginRole,
    };
    new ajaxHttp("POST", getUrl(3) + "/portal/registerEmployee", Data, function(F) {
        alert("获取状态失败，请稍后")
    }, function(data) {
        if (data.code === SUCCESSFULUSERLOGIN) {
            alert("添加成功");
            reload();
            return false
        } else if (data.code === PARAMETERCANNOTBEEMPTY) {
            alert("请将资料填写完整");
        } else if (data.code === INSUFFICIENTPRIVILEGE) {
            alert('权限不够，请联系管理员！')
        } else {
            alert('系统错误，请刷新浏览器')
        }
    });
    return false
}


/**
 * 查询房间得方法
 * @returns {boolean}
 */
function getRooms() {
    let Data = {"userName": getCookie('userName')};

    if (getCookie('token')) {
        new ajaxHttp("get", getUrl(3) + "/hotel_room/findroom", Data, function(request) {
            alert("获取状态失败，请稍后")
        }, function(data) {
            if (data.code === SUCCESSFULUSERLOGIN) {
                let objs = eval(data.content);
                for (let j = 0; j < objs.length; j++) {
                    let hotel_room = []; // 房间数组
                    hotel_room[0] = objs[j].roomType;
                    hotel_room[1] = objs[j].roomName;
                    hotel_room[2] = objs[j].roomNumber;
                    hotel_room[3] = objs[j].roomInitalPrice;
                    hotel_room[4] = objs[j].roomSpecialDatePrice;
                    setData(hotel_room)
                }
            }

        });
    }
    return false
}

/**
 *
 * @param A  传入对象 调用方法 显示到界面
 */
function setData(A) {
    setTable(1, A)
}

/**
 *
 * @param F  循环的长度
 * @param A  需要循环的对象
 */
function setTable(F, A) {
    let C = document.getElementById("houseStatusTable");
    let D;
    let E;
    for (let B = 0; B < F; B++) {
        D = document.createElement("tr");
        document.getElementById("houseStatusTable").appendChild(D);
        for (let G = 0; G < A.length; G++) {
            E = document.createElement("td");
            E.innerText = A[G];
            D.appendChild(E)
        }
        E = document.createElement("td");
        E.innerHTML = '<input type=\'button\' value="删除" onclick="deleteRooms(this)" class="layui-btn layui-btn-primary"/>' +
            '<input type=\'button\' value="修改" onclick="ChangeRooms(this)" class="layui-btn layui-btn-primary"/>';
        D.appendChild(E)
    }
}

/**
 *
 *
 * @returns {boolean}
 * @constructor
 * 修该房间的方法
 */
function ChangeRooms(obj) {
    let text = $(obj).parent().parent().children();
    for (let i = 0; i < text.length - 1; i++) $($('#modal input')[i]).val($(text[i]).text())
    layer.open({
        title: '修改房间信息',
        type: 1,
        area: ['600px', '400px'],
        btn: ['确认', '取消'],
        yes: function() {
            let Data = {
                "userName": getCookie("userName"),
                "roomType": $('#roomType').val(),
                "roomName": $('#roomName').val(),
                "roomNumber": $('#roomNumber').val(),
                "roomInitalPrice": $('#roomInitalPrice').val(),
                "roomSpecialDatePrice": $('#roomSpecialDatePrice').val()
            };
            new ajaxHttp('post', getUrl(3) + "/hotel_room/updateroom", Data, function() {
                alert("获取状态失败，请稍后")
            }, function(data) {
                if (data.code === SUCCESSFULUSERLOGIN) {
                    alert("添加成功");
                    location.reload()
                    return false
                } else {
                    alert("房间号冲突，请更换");
                }
            })
        },
        content: $('#modal')
    });
}

/**
 * @param B   传入表单的对象
 * @returns {boolean}
 * 添加个房间得方法
 */
function insertRooms(B) {
    let Data = {
        "userName": getCookie("userName"),
        "roomType": B.roomType,
        "roomName": B.roomName,
        "roomNumber": B.roomNumber,
        "roomInitalPrice": B.roomInitalPrice,
        "roomSpecialDatePrice": B.roomSpecialDatePrice
    };
    new ajaxHttp("POST", getUrl(3) + "/hotel_room/addroom", Data, function(C) {
        alert("添加失败，请联系管理员")
    }, function(data) {
        if (data.code === SUCCESSFULUSERLOGIN) {
            alert("添加成功");
            reload();
            return false
        } else {
            alert("房间号冲突，请更换");
        }
    });
    return false
}


/**
 *  删除房间的放发
 * @param E  传入需要 需要删除的房间的节点
 * @returns {boolean}
 */
function deleteRooms(E) {
    if (confirm("确认删除吗", function() {
            let C = E.parentNode.parentNode;
            let B = [];
            for (let A = 0; A < C.cells.length; A++) {
                B[A] = C.cells[A].innerHTML
            }
            let Data = {"userName": getCookie("userName"), "roomNumber": B[2]};
            new ajaxHttp("POST", getUrl(3) + "/hotel_room/deleteroom", Data, function(F) {
                alert("获取状态失败，请稍后")
            }, function(F) {
                location.reload()
            });
            return false
        })) {
    } else {
        return
    }

}

/**
 *  获取佣金的方法
 * @returns {boolean}
 */
function getCommisionMes() {
    let Data = {"userName": getCookie("userName")};
    new ajaxHttp("get", getUrl(3) + "/compensasen/find", Data, function(request) {
        alert("获取状态失败，请稍后")
    }, function(data) {
        if (data.code === SUCCESSFULUSERLOGIN) if (data.content.compensasenQuNaErSolid === '') {
            $("#compensasenQuNaErSolid").val('0');
            $("#compensasenXieChengSolid").val('0');
            $("#compensasenFeiZhuSolid").val('0');
            $("#compensasenYiLongSolid").val('0')
        } else {
            let objs = eval(data.content);
            $("#compensasenQuNaErSolid").val(objs.compensasenQuNaErSolid);
            $("#compensasenXieChengSolid").val(objs.compensasenXieChengSolid);
            $("#compensasenFeiZhuSolid").val(objs.compensasenFeiZhuSolid);
            $("#compensasenYiLongSolid").val(objs.compensasenYiLongSolid)
            if ($("#compensasenYiLongSolid").val() != '') {
                $('#form2').hide();
            } else {
                $('#form2').show();
            }
        }

    });
    return false
}

/**
 * 修改佣金的方法
 * @param B  传入修改的表单
 * @returns {boolean}
 */
function changeCommision(B) {
    let Data = {
        "userName": getCookie("userName"),
        "compensasenFeiZhuSolid": B.compensasenFeiZhuSolid,
        "compensasenYiLongSolid": B.compensasenYiLongSolid,
        "compensasenXieChengSolid": B.compensasenXieChengSolid,
        "compensasenQuNaErSolid": B.compensasenQuNaErSolid,
    };
    new ajaxHttp("POST", getUrl(3) + "/compensasen/update", Data, function(C) {
        alert("添加失败，请联系管理员")
    }, function(data) {
        if (data.code === SUCCESSFULUSERLOGIN) {
            alert("修改成功");
            reload();
        } else if (data.code === PARAMETERCANNOTBEEMPTY) {
            alert('请把选项添加完毕在提交');
        } else if (data.code === INSUFFICIENTPRIVILEGE) {
            alert('用户权限不够，请联系管理员！');
        }
    });
    return false
}


/**
 * 添加佣金得方法
 * @param B  添加佣金得参数
 * @returns {boolean}
 */
function form2(B) {
    let Data = {
        "userName": getCookie("userName"),
        "compensasenFeiZhuSolid": B.compensasenFeiZhuSolid,
        "compensasenYiLongSolid": B.compensasenYiLongSolid,
        "compensasenXieChengSolid": B.compensasenXieChengSolid,
        "compensasenQuNaErSolid": B.compensasenQuNaErSolid,
    };
    if (Data.compensasenFeiZhuSolid === '' && Data.compensasenYiLongSolid === '' && Data.compensasenXieChengSolid === '' && Data.compensasenQuNaErSolid === '') {

        new ajaxHttp("POST", getUrl(3) + "/compensasen/add", Data, function(C) {
            alert("添加失败，请联系管理员")
        }, function(data) {
            if (data.code === SUCCESSFULUSERLOGIN) {
                alert("添加成功");
                reload();
                return false
            } else if (data.code === PARAMETERCANNOTBEEMPTY) {
                alert('请把选项添加完毕在提交');
                return false
            } else if (data.code === INSUFFICIENTPRIVILEGE) {
                alert('用户权限不够，请联系管理员！');
                return false
            } else {
                alert('系统错误,请刷新浏览器');
                return false
            }

        });
        return false
    } else {
        alert('佣金已经添加完毕，不能再添加。 如需更改，请点击修改按钮')
    }
}


/**
 *  获取员工的方法
 * @returns {boolean}
 */
function getEmployee() {
    // let b = new Base64();
    let Data = {"userName": getCookie('userName')};

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
    return false;
}

function setData2(A) {
    setTable2(1, A)
}

/**
 * 工作人员得返现
 * @param F 循环对象的长度
 * @param A 需要写入到ui得数据
 */
function setTable2(F, A) {
    let C = document.getElementById("employeeTable");
    let D;
    let E;
    for (let B = 0; B < F; B++) {
        D = document.createElement("tr");
        document.getElementById("employeeTable").appendChild(D);
        for (let G = 0; G < A.length; G++) {
            E = document.createElement("td");
            E.innerText = A[G];
            D.appendChild(E)
        }
        E = document.createElement("td");
        D.appendChild(E)
    }
};

