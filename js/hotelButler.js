/**
 * @Created with fly.
 * @User: z1163764648.com
 * @Date: 2017/11/9
 * @Time: 10:14
 * @return {boolean}
 * 获取客栈基本信息
 */

function getHotel() {
    let Data = {"id": getCookie("token")};
    new ajaxHttp('get', getUrl(1) + '/sso/find', Data, () => {
        alert('用户未登录， 请重新登录')
    }, (data) => {
        $('#hotelName').val(data.content.hotelName);
        $('#phoneNumber').val(data.content.phoneNumber);
    });
    return false
}

/**
 * 添加分店的方法
 * @param E 提交表单获取到的数据
 * @returns {boolean}
 */
function submitInfo2(E) {
    let D = new Base64();
    let C = E.userName0;
    let B = E.password0;
    let Data = {
        "userName": getCookie("userName"),
        "employee": C,
        "employeePassword": B,
        "hotelName": E.hotelName,
        "phoneNumber": E.phoneNumber,
    };
    new ajaxHttp('post',getUrl(2) + '/portal/addBranch' , Data , (err)=>{
        alert('用户未登录， 请重新登录')
    },(data)=>{
        if(data.code === SUCCESSFULUSERLOGIN){
            alert('分店添加成功，请查看')
            history.go(0);
        }else if(data.code === PARAMETERCANNOTBEEMPTY){
            alert('请求的参数不能为空，请检查')
        }else if(data.code === INSUFFICIENTPRIVILEGE){
            alert('用户权限不够，请联系管理员')
        }else{
            alert(data.message)
        }
    });
}

/**
 *  查询当下客户所有分店信息
 * @returns {boolean}
 */
function getfendian() {
    let Data = {"userName": getCookie("userName")};
    new ajaxHttp('get', getUrl(2) + '/portal/getBranch', Data, (err) => {
        alert('用户没有登录，请登录')
    }, (data) => {
        console.log(data)
        if (data.code === SUCCESSFULUSERLOGIN) {
            let objs = data.content;
            for (let j = 0; j < objs.length; j++) {
                let aa =[];
                let b = new Base64();
                aa[0] = b.decode(objs[j].userName);
                aa[1] = objs[j].createTime;
                aa[2] = objs[j].phoneNumber;
                aa[3] = objs[j].hotelName;
                setData3(aa)
            }
        }else if(data.code === PARAMETERCANNOTBEEMPTY){
            alert('查询状态失败，请检查登录')
        }else if(data.code === INSUFFICIENTPRIVILEGE){
            alert('用户权限不够，请联系管理员')
        }else{
            alert('服务器错误，请稍等')
        }
    });

    return false
}

/**
 * 设置表单传送数据
 * @param A   获取到的数据
 */
function setData3(A) {
    setTable3(1, A)
}

/**
 *  将得到的数据 循环 显示到ui
 * @param F  循环数据得长度
 * @param A  显示得数据
 */
function setTable3(F, A) {
    let C = document.getElementById("fendianTable");
    let D;
    let E;
    for (let B = 0; B < F; B++) {
        D = document.createElement("tr");
        document.getElementById("fendianTable").appendChild(D);
        for (let G = 0; G < A.length; G++) {
            E = document.createElement("td");
            E.innerText = A[G];
            D.appendChild(E)
        }
        E = document.createElement("td");
        D.appendChild(E)
    }
};