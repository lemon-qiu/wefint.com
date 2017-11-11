(function() {
		downloadFile = function (){
	        let frame = $("<iframe style='display: none;'/>");
	        frame.appendTo($("body")).attr({ "src":  "http://localhost:20000/getZipFile", "display": "block" });
	        setTimeout(function () {
	            frame.remove();
	        }, 3000);
	    }


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
            ready: function(date){ //监听日期被切换
                console.log(date)
            	// createMainTable(date,30);
              }
        });
    });

    function getDays(year,month){
        let dayCount;
        let now = new Date(year,month, 0);
        dayCount = now.getDate();
        return dayCount;
	}

    /**
	 *创建主界面表格数据
	 * @param curDate 当前日期
	 * @param n 天数
     */
    function createMainTable(curDate,n){
    	let tableDiv = '';
    	let dayDiv = '';
    	let inputDiv = '';
    	let year = curDate.year;
 	    let month = curDate.month;
    	let date = curDate.date;
    	let startDate = year+"-"+month+"-"+date;
    	let endDate = addNDays(new Date(year+"/"+month+"/"+date),n);
    	let allDates = betweenDates(startDate,endDate);
    	let dates = allDates.split(",");
    	tableDiv += "<tr>";
    	dayDiv += "<tr>";
    	for(let i = 0;i < n;i++){
    		let dd= dates[i];
    		tableDiv +="<td style='border:1px solid #fff;background-color:#20a464;color:#fff;'>"+dd+"</td>";
    		let tranD='';
    		let d =  new   Date(dd.replace(/-/g,   "/"));
    		if(d.getDay()==1){
    			tranD="星期一";
    		}else if(d.getDay()==2){
    			tranD="星期二";
    		}else if(d.getDay()==3){
    			tranD="星期三";
    		}else if(d.getDay()==4){
    			tranD="星期四";
    		}else if(d.getDay()==5){
    			tranD="星期五";
    		}else if(d.getDay()==6){
    			tranD="星期六";
    		}else if(d.getDay()==0){
    			tranD="星期日";
    		}
    		dayDiv+="<td style='border:1px solid #fff;background-color:#20a464;color:#fff;'>"+tranD+"</td>";
    		inputDiv +="<td style='border:1px solid #ccc;color:#000;'>&nbsp;</td>";
    	}
    	tableDiv +="</tr>";
    	dayDiv += "</tr>";

    	 let sumDiv ='';
    	 let trDiv = '';
    	 for(let i = 0; i < data.length; i++){
    		 console.log(data.length);
 	    	let inputDiv='';
    		 for(let j=0;j<n;j++){
    			let txt = '&nbsp;';
    			console.log(data[i]);

    		   	inputDiv +="<td style='border:1px solid #ccc;color:#000;' onclick='getColumnDetail(this)'>"+txt+"</td>";
    		 }
    		 trDiv = "<tr>" + inputDiv + "</tr>";
    		 sumDiv += trDiv;
    	 }

    	$("#table2").html(tableDiv+dayDiv+sumDiv);


    }
    /**function createMainTable(dateObj){
    	let tableDiv = '';
    	let dayDiv = '';
    	let inputDiv = '';
	    let year = dateObj.year;
	    let month = dateObj.month;
		let days =  getDays(year,month);
    	tableDiv += "<tr>";
    	dayDiv += "<tr>";
    	inputDiv += "<tr>";
   	    let day = dateObj.date;
    	for(let i=0;i<days-day+1;i++){
    		 let dd = day+i;
 		    let dateValue = year + "-" + month + "-" + dd;
    		tableDiv +="<td style='border:1px solid #fff;background-color:#20a464;color:#fff;'>"+dateValue+"</td>";
    		inputDiv +="<td style='border:1px solid #ccc;color:#000;'>&nbsp;</td>";
    		let tranD='';
    		let d =  new   Date(dateValue.replace(/-/g,   "/"));
    		if(d.getDay()==1){
    			tranD="星期一";
    		}else if(d.getDay()==2){
    			tranD="星期二";
    		}else if(d.getDay()==3){
    			tranD="星期三";
    		}else if(d.getDay()==4){
    			tranD="星期四";
    		}else if(d.getDay()==5){
    			tranD="星期五";
    		}else if(d.getDay()==6){
    			tranD="星期六";
    		}else if(d.getDay()==0){
    			tranD="星期日";
    		}
    		dayDiv+="<td style='border:1px solid #fff;background-color:#20a464;color:#fff;'>"+tranD+"</td>";
    	}
    		tableDiv +="</tr>";
    		dayDiv+="</tr>";
    		inputDiv += "</tr>";

    		 let sumDiv ='';
	    	 for(let i=0;i<2;i++){
	    		 sumDiv+=inputDiv;
	    	 }

	    	$("#table2").html(tableDiv+dayDiv+sumDiv);
    }**/
 })()


/**
 * 计算传入日期N天后的日期
 * @param date 传入日期
 * @param n 天数
 * @returns 返回N天后日期
 */
	function addNDays(date,n){
    let time=date.getTime();
    let newTime=time+n*24*60*60*1000;
    let d = new Date(newTime);
    let year = d.getFullYear();
    let monthValue = d.getMonth()+1;
	let dateValue = d.getDate();
	let month = monthValue<10?"0"+monthValue:monthValue;
	let date =dateValue<10?"0"+dateValue:dateValue;
    return year+"-"+month+"-"+date;
	}



	/**
	 * 获取日期段内的所有日期(yyyy-MM-dd)
	 * @param begin 开始日期
	 * @param end 结束日期
	 * @returns 返回所有日期
	 */
    function betweenDates(begin, end)
    {
    let ab = begin.split("-");
    let ae = end.split("-");
    let db = new Date();
    db.setFullYear(ab[0], ab[1]-1, ab[2]);
    let de = new Date();
    de.setFullYear(ae[0], ae[1]-1, ae[2]);
    let a = [];
    for (let i = 0,temp = db;temp < de;i++)
    {
    a[i] = GetDate(temp);
    temp.setTime(temp.getTime() + 24*60*60*1000);
    }
    a[i] = GetDate(de);
    return a.join();
    }
    //返回1900-01-01格式的字符串
    function GetDate(d)
    {
    	let monthValue = d.getMonth()+1;
    	let dateValue = d.getDate();
    	let month = monthValue < 10? "0" + monthValue : monthValue;
    	let date = dateValue < 10 ? "0" + dateValue : dateValue;
    	return d.getFullYear() + "-" + month + "-" + date;
    }
  /*  let dates = betweenDates("2009-12-31", "2010-01-31");
    alert(dates.split(",")[2]);*/
    //document.write(betweenDates("2009-12-31", "2010-01-31"));


	/*$.ajax({
		url : getUrl(2) + '/roomStatus/checkinInfo',
		type : 'get', // IE必须加上post
		dataType : 'json',
		timeout : 1000 * 60,
		async : true,// 同步执行
		data : {
			userName:userName,
			hasStayDate:hasStayDate
		},
		success : function(result) {

		}

	})*/

    	initPanel();

	    function initPanel(){
	        let data = {
	                "userName": getCookie("userName"),
	                "hasStayDate": dateToString(new Date()),
	            };
	            ajaxHttp("GET", getUrl(2) + "/roomStatus/findAll", data, function(C) {
	                alert("查询失败，请联系管理员")
	            }, function(data) {
	            	let code = data.code;
	            	let content = data.content;
	                createLeftTable(content);
	    	        initMainTable(content,30);

	            });


	    }

	    function createLeftTable(data){//循环返回参数返显数据
	    	let tableDiv = '';
	    	tableDiv += "<tr><td style='background-color:#20a488;color:#fff'>房间名</td><td style='background-color:#20a488;color:#fff';>房间号</td></tr>";
	    	for(let i=0;i<data.length;i++){
	    		tableDiv += "<tr><td style='background-color:#F0FFF0;color:#000;border-color:#ccc'>"+data[i].roomName+"</td><td style='background-color:#F0FFF0;color:#000;border-color:#ccc'>"+data[i].roomNumber+"</td></tr>";
	    	}
	    	$("#table1").html(tableDiv);
	    }

	    /**
	     * 获取传入年月对应所有天数
	     * @param year 年
	     * @param month 月
	     * @returns 天数
	     */
	    function getInitDays(year,month){
	        let dayCount;
	        let now = new Date(year,month, 0);
	        dayCount = now.getDate();
	        return dayCount;
	    }

	    function getData(index){
	    	let obj = $("#table1 tr");
	    	for(let i=0;i<2;i++){

	    		alert(obj[index+1].cells[i].innerHTML);//获取房间名称和编号
	    	}
	    }

	    /**
	     * 日期转字符串
	     * @param curDate 当前日期
	     * @returns 返回字符串
	     */
	    function dateToString(curDate){
	    	let year = curDate.getFullYear();
	        let monthValue = curDate.getMonth() + 1;
	    	let dateValue = curDate.getDate();
	    	let month = monthValue < 10 ? "0" + monthValue : monthValue;
	    	let date = dateValue < 10 ? "0" + dateValue : dateValue;
	    	return year + "-" + month + "-" + date;
	    }

	    /**
	     * 初始化N天的数据
	     * @param n 天数
	     * @returns 加载到mainTable
	     */
	    function initMainTable(data,n){
			let userName = getCookie("userName");
	    	let curDate = new Date();
	      	let startDate = dateToString(curDate);
	    	let endDate = addNDays(curDate,n);
	    	let allDates = betweenDates(startDate,endDate);
	    	let dates = allDates.split(",");
	    	let tableDiv = '';
	    	let dayDiv='';
	    	tableDiv += "<tr>";
	    	dayDiv += "<tr>";
	    	for(let i = 0; i < n; i++){
	    		let dd = dates[i];
	    		tableDiv += "<td style='border:1px solid #fff;background-color:#49A761;color:#fff;'>" + dd + "</td>";
	    		let tranD = '';
	    		let d = new Date(dd.replace(/-/g,"/"));
	    		if(d.getDay() == 1){
	    			tranD = "星期一";
	    		}else if(d.getDay() == 2){
	    			tranD = "星期二";
	    		}else if(d.getDay()==3){
	    			tranD = "星期三";
	    		}else if(d.getDay() == 4){
	    			tranD = "星期四";
	    		}else if(d.getDay() == 5){
	    			tranD = "星期五";
	    		}else if(d.getDay() == 6){
	    			tranD = "星期六";
	    		}else if(d.getDay() == 0){
	    			tranD = "星期日";
	    		}
	    		dayDiv+="<td style='border:1px solid #fff;background-color:#49A761;color:#fff;'>"+tranD+"</td>";

	    	}
	    	tableDiv += "</tr>";
	    	dayDiv += "</tr>";

	    	 let sumDiv ='';



	    	 for(let i = 0; i < data.length; i++){
				 let inputDiv='';
				 let trDiv = '';
	 	    	//if(typeof(data[i])=='object'){
	 	    		 for(let j=0;j<n;j++){
	 	    			let txt = '&nbsp;';
	 	    			let copyId = '';
						 let dateStr = dates[i];
						 console.log(dateStr+"================");
					 if(typeof(data[i])=='object'){
						 if(data[i].hotelCheckinInfoList[j]){
							 if(data[i].hotelCheckinInfoList[j].clientType=='1'){
								 txt = '已入住';
								 copyId = data[i].hotelCheckinInfoList[j].copyId;

							 }else if(data[i].hotelCheckinInfoList[j].clientType=='2'){
								 txt= '已预定';
							 }
						 }else{
							 txt = '&nbsp;';
						 }

						 }


	 	    		   	inputDiv +="<td style='border:1px solid #ccc;color:#000;' onclick='getColumnDetail(this,\""+copyId+"\")'>"+txt+"</td>";
	 	    		 }

	 	    	//}
				 trDiv = "<tr>" + inputDiv + "</tr>";
				 sumDiv += trDiv;
	    	 }
	    	$("#table2").html(tableDiv + dayDiv + sumDiv);
	    }


	    function getColumnDetail(obj,copyId) {
			let tdTxt = obj.innerHTML;
			if (tdTxt == "已预定") {
				layer.open({
					type: 1,
					area: ["950px", "500px"],
					content: '<div><iframe src="./booking.html" width="950px" height="450px" scrolling="no" frameborder="0"name="framelayer"> </iframe></div>'
				})
			} else if (tdTxt == "已入住") {
					let index = layer.confirm('已入住', {
						btn: ['入住'] //按钮
					}, function(){
						layer.close(index);
                        layer.open({
                            type: 1,
                            area: ["950px", "500px"],
                            content: '<div><iframe src="./checkin.html?copyId='+copyId+'" width="950px" height="450px" scrolling="no" frameborder="0"name="framelayer"> </iframe></div>'
                        });
					});
			} else {
					layer.open({
						type: 1,
						area: ["950px", "500px"],
						content: '<div><iframe src="./hotelStatusSetupLayer.html" width="950px" height="450px" scrolling="no" frameborder="0"name="framelayer"> </iframe></div>'
					})
				}
	  /*      setCookie("Date", A.id);
	        setCookie("roomNumber", A.parentNode.id);*/

	    }

	    /**
	     * 初始化加载主界面表格数据
	     */
	   /* function initMainTable(){
	    	let tableDiv = '';
	    	let dayDiv='';
	    	let inputDiv='';
	    	let dateObj = new Date();
		    let year = dateObj.getFullYear();
		    let month = dateObj.getMonth() + 1;
			let days =  getInitDays(year,month);

	    	tableDiv += "<tr>";
	    	dayDiv += "<tr>";

	    	let dd = dateObj.getDate();
	    	for(let i=0;i<days-dd+1;i++){
	    		let day = dd+i;
	 		    let dateValue = year + "-" + month + "-" + day;
	    		tableDiv +="<td style='border:1px solid #fff;background-color:#20a464;color:#fff;'>"+dateValue+"</td>";
	    		inputDiv +="<td style='border:1px solid #ccc;color:#000;'>&nbsp;</td>";

	    		let d =  new   Date(dateValue.replace(/-/g,   "/"));
	    		if(d.getDay()==1){
	    			tranD="星期一";
	    		}else if(d.getDay()==2){
	    			tranD="星期二";
	    		}else if(d.getDay()==3){
	    			tranD="星期三";
	    		}else if(d.getDay()==4){
	    			tranD="星期四";
	    		}else if(d.getDay()==5){
	    			tranD="星期五";
	    		}else if(d.getDay()==6){
	    			tranD="星期六";
	    		}else if(d.getDay()==0){
	    			tranD="星期日";
	    		}
	    		dayDiv+="<td style='border:1px solid #fff;background-color:#20a464;color:#fff;'>"+tranD+"</td>";
	    	}
	    	tableDiv +="</tr>";

	    	dayDiv += "</tr>";


	    	 let sumDiv ='';
	    	 let trDiv = '';
	    	 for(let i=0;i<2;i++){
	    		 trDiv="<tr onclick='getData("+i+")'>"+inputDiv+"</tr>";
	    		 sumDiv+=trDiv;
	    	 }
	    	console.log(sumDiv);
	    	$("#table2").html(tableDiv+dayDiv+sumDiv);
	    }*/


/*function getRooms() {
    let JsonData = {"userName": getCookie("userName"), "password": getCookie("password"),};
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/RoomSelectServlet",
        data: {"strSelectRoom": JSON.stringify(JsonData)},
        async: false,
        error: function (request) {
            alert("获取状态失败，请稍后")
        },
        success: function (data) {
            let obj = JSON.parse(data);
            let objs = eval(data);
            for (let j = 0; j < objs.length; j++) {
                let aa = new Array();
                aa[0] = objs[j].roomName;
                aa[1] = objs[j].roomNumber;
                setLeft(aa);
                let now = new Date();
                let year = now.getFullYear();
                let month = now.getMonth() + 1;
                let day = now.getDate();
                let nowNowDate = year + "-" + month + "-" + day;
                setTable0(1, getStatus(getCookie("userName"), getCookie("password"), aa[1], nowNowDate), aa[1], getData(nowNowDate))
            }
        }
    });
    return false
}
function setLeft(A) {
    setLeftTable(1, A)
}
function setLeftTable(F, A) {
    let C = document.getElementById("table1");
    let D;
    let E;
    for (let B = 0; B < F; B++) {
        D = document.createElement("tr");
        document.getElementById("table1").appendChild(D);
        for (let G = 0; G < A.length; G++) {
            E = document.createElement("td");
            E.innerText = A[G];
            D.appendChild(E)
        }
        D.appendChild(E)
    }
}
function setTable0(I, B, E, C) {
    let H = document.getElementById("table2");
    let G;
    let D;
    for (let F = 0; F < I; F++) {
        G = document.createElement("tr");
        document.getElementById("table2").appendChild(G);
        G.id = E;
        for (let E = 0; E < B.length; E++) {
            D = document.createElement("td");
            D.onclick = function () {
                getColumnDetail(this)
            };
            D.id = C[E];
            let A = new Array();
            A = B[E].split("-");
            if (A[0] == "1") {
                D.innerText = "已预定\n" + A[1];
                D.bgColor = "#ccc"
            } else {
                if (A[0] == "2") {
                    D.innerText = "已入住\n" + A[1];
                    D.bgColor = "#5FB878"
                }
            }
            G.appendChild(D)
        }
        G.appendChild(D)
    }
}
function m(A) {
    layui.laydate(A)
}
layui.use("laydate", function () {
    let A = layui.laydate
});
function getColumnDetail(A) {
    setCookie("Date", A.id);
    setCookie("roomNumber", A.parentNode.id);
    let B = new Array();
    B = A.innerHTML.split("<br>");
    if (B[0] == "已预定") {
        layer.open({
            type: 1,
            area: ["950px", "500px"],
            content: '<div><iframe src="./booking.html" width="950px" height="450px" scrolling="no" frameborder="0"name="framelayer"> </iframe></div>'
        })
    } else {
        if (B[0] == "已入住") {
            layer.open({
                type: 1,
                area: ["950px", "500px"],
                content: '<div><iframe src="./checkin.html" width="950px" height="450px" scrolling="no" frameborder="0"name="framelayer"> </iframe></div>'
            });
            alert("已入住")
        } else {
            layer.open({
                type: 1,
                area: ["950px", "500px"],
                content: '<div><iframe src="./hotelStatusSetupLayer.html" width="950px" height="450px" scrolling="no" frameborder="0"name="framelayer"> </iframe></div>'
            })
        }
    }
}
function setTable(F, A) {
    let C = document.getElementById("table2");
    let D;
    let E;
    for (let B = 0; B < F; B++) {
        D = document.createElement("tr");
        document.getElementById("table2").appendChild(D);
        for (let G = 0; G < A.length; G++) {
            E = document.createElement("td");
            E.onclick = function () {
                getColumnDetail(this)
            };
            E.innerText = A[G];
            D.appendChild(E)
        }
    }
}
function setTableHeader(F, A) {
    let C = document.getElementById("table2");
    C.innerHTML = "";
    let D;
    let E;
    for (let B = 0; B < F; B++) {
        D = document.createElement("tr");
        document.getElementById("table2").appendChild(D);
        for (let G = 0; G < A.length; G++) {
            E = document.createElement("td");
            E.innerText = A[G];
            D.appendChild(E)
        }
    }
}
function setTableHeaderAuto() {
    let E = new Array();
    for (let A = 0; A < 31; A++) {
        let F = new Date();
        let G = new Array("日", "一", "二", "三", "四", "五", "六");
        F.setDate(F.getDate() + A);
        let B = F.getMonth() + 1;
        let D = F.getDate();
        let C = F.getDay();
        E[A] = B + "-" + D + "-" + G[C]
    }
    setTableHeader(1, E)
}
function getData(A) {
    let B = new Array();
    for (let F = 0; F < 31; F++) {
        let C = new Date(A);
        let E = new Array("日", "一", "二", "三", "四", "五", "六");
        C.setDate(C.getDate() + F);
        let H = C.getFullYear();
        let D = C.getMonth() + 1;
        let G = C.getDate();
        let I = C.getDay();
        B[F] = H + "-" + D + "-" + G
    }
    return B
}
function setData(A) {
    let B = new Array();
    for (let F = 0; F < 31; F++) {
        let C = new Date(A);
        let E = new Array("日", "一", "二", "三", "四", "五", "六");
        C.setDate(C.getDate() + F);
        let D = C.getMonth() + 1;
        let G = C.getDate();
        let H = C.getDay();
        B[F] = D + "-" + G + "-" + E[H]
    }
    setTableHeader(1, B)
}
function getPreMonth(K) {
    let G = K.split("-");
    let F = G[0];
    let B = G[1];
    let C = G[2];
    let A = new Date(F, B, 0);
    A = A.getDate();
    let I = F;
    let E = parseInt(B) - 1;
    if (E == 0) {
        I = parseInt(I) - 1;
        E = 12
    }
    let J = C;
    let D = new Date(I, E, 0);
    D = D.getDate();
    if (J > D) {
        J = D
    }
    if (E < 10) {
        E = "0" + E
    }
    let H = I + "-" + E + "-" + J;
    return H
}
function getNextMonth(K) {
    let G = K.split("-");
    let F = G[0];
    let B = G[1];
    let C = G[2];
    let A = new Date(F, B, 0);
    A = A.getDate();
    let I = F;
    let E = parseInt(B) + 1;
    if (E == 13) {
        I = parseInt(I) + 1;
        E = 1
    }
    let J = C;
    let D = new Date(I, E, 0);
    D = D.getDate();
    if (J > D) {
        J = D
    }
    if (E < 10) {
        E = "0" + E
    }
    let H = I + "-" + E + "-" + J;
    return H
}
function getNowDate() {
    let F = new Date();
    let D = F.getFullYear();
    let C = F.getMonth() + 1;
    let B = F.getDate();
    let E = D + "-" + C + "-" + B;
    let A = document.getElementById("nowTimeChoose");
    A.value = E
}
function leftChoose() {
    let A = document.getElementById("nowTimeChoose");
    A.value = getPreMonth(A.value);
    setData(A.value);
    buttonGetRooms(A.value)
}
function nowTimeChoose(B) {
    let A = document.getElementById("nowTimeChoose");
    setData(A.value);
    buttonGetRooms(A.value)
}
function rightChoose() {
    let A = document.getElementById("nowTimeChoose");
    A.value = getNextMonth(A.value);
    setData(A.value);
    buttonGetRooms(A.value)
}
function getStatus(D, A, E, B) {
    let C = {"userName": D, "password": A, "roomNumber": E, "hasStayDate": B,};
    let F = new Array();
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/EditSelectServlet",
        data: {"strSelectEdit": JSON.stringify(C)},
        async: false,
        error: function (G) {
            alert("获取状态失败，请稍后")
        },
        success: function (G) {
            F = G.split(", ");
            return F
        }
    });
    return F
}
function buttonGetRooms(inDate) {
    let JsonData = {"userName": getCookie("userName"), "password": getCookie("password"),};
    $.ajax({
        cache: true,
        type: "POST",
        url: getUrl() + "/HotelPMS/RoomSelectServlet",
        data: {"strSelectRoom": JSON.stringify(JsonData)},
        async: false,
        error: function (request) {
            alert("获取状态失败，请稍后")
        },
        success: function (data) {
            let obj = JSON.parse(data);
            let objs = eval(data);
            for (let j = 0; j < objs.length; j++) {
                let aa = new Array();
                aa[0] = objs[j].roomName;
                aa[1] = objs[j].roomNumber;
                setTable0(1, getStatus(getCookie("userName"), getCookie("password"), aa[1], inDate), aa[1], getData(inDate))
            }
        }
    });
    return false
};*/

