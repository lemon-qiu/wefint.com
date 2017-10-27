var code;
function createCode() {
	code = "";
	var E = 4;
	var A = document.getElementById("code");
	var C = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E",
			"F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R",
			"S", "T", "U", "V", "W", "X", "Y", "Z");
	for (var B = 0; B < E; B++) {
		var D = Math.floor(Math.random() * 36);
		code += C[D]
	}
	document.getElementById("code").value = code
}
function validate() {
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
}
function memberLogin(E) {
	var D = new Base64();
	var C = D.encode(E.userName);
	var B = D.encode(E.password);
	var A = {
		"userName" : C,
		"password" : B,
	};
	$.ajax({
		cache : true,
		type : "POST",
		async : true,// 同步执行
		url : getUrl() + "/HotelPMS/UserLoginServlet",
		data : {
			"strUserLogin" : JSON.stringify(A)
		},
		async : false,
		error : function(F) {
			alert("faild")
		},
		success : function(F) {
			if ("405" == F) {
				alert("用户名或者密码不正确！");
				return false
			}
			if (F == "200") {
				setCookie("userName", C, 7);
				setCookie("password", B, 7);
				
				$.ajax({
					url : getUrl() + "/HotelPMS/UserLoginManageServlet",
					type : 'post', // IE必须加上post
					dataType : 'text',
					timeout : 1000 * 60,
					async : true,// 同步执行
					data : {
						username : C
					},
					success : function(result) {
						if(result=='405'){
							alert('系统错误');
						}
						if(result=='1'){
							setCookie('loginRole',result);
							window.location.href = "../finance/html/salesList.html";
							return;
						}else if(result=='2'){
							setCookie('loginRole',result);
							window.location.href = "../finance/html/riskControlList.html";
							return;
						}else{
							window.location.href = "./mainPannel.html";
						}
					},
					error : function(request, status, e) {
						alert(status);
						alert('系统错误');
					}
				});

				return false
			}
		}
	});
	return false
};