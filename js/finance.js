function submitToFinance(A) {
	if(false) {
		alert("图片需要先预览，以确定您上传的文件正确！")
	}
	$.ajax({
		cache: true,
		type: "POST",
		url: SERVER_ADD_PORT + "/finance/page01",
		data: {
			"userName": getCookie("userName"),
			"password": getCookie("password"),
			"idCardNumber": A.idCardNumber,
			"phoneNumber": A.phoneNumber,
			"hotelName": A.hotelName,
			"hotelLocationDetails": A.hotelLocationDetails,
		},
		async: false,
		error: function(B) {
			alert("获取状态失败，请稍后")
		},
		success: function(C) {
			var B = JSON.parse(C);
			if(B.code == "200") {
				window.location.href = "./hexagram.html"
			}
		}
	});
	return false
}

function d(C) {
	var B;
	var A = {
		"userName": getCookie("userName"),
		"password": getCookie("password"),
		"limitPic": C.limitPic,
		"idCardPicFront": C.idCardPicFront,
		"idCardBack": C.idCardBack,
		"idCardNumber": C.idCardNumber,
		"phoneNumber": C.phoneNumber,
		"hotelName": C.hotelName,
		"hotelLocationDetails": C.hotelLocationDetails,
	};
	$.ajax({
		cache: true,
		type: "POST",
		url: SERVER_ADD_PORT + "/fileUpLoad/fileUpLoad",
		data: {
			"strFinanceSetup": JSON.stringify(A)
		},
		async: false,
		error: function(D) {
			alert("获取状态失败，请稍后")
		},
		success: function(D) {
			if("405" == D) {
				alert("提交失败！");
				return false
			}
			if(D == "200") {
				B = D;
				window.location.href = "./mainPannel.html"
			}
		}
	});
	return false
}

function doValidate() {
	var A = /^1[3|4|5|7|8]\d{9}$/;
	if(!A.test(document.forma.phoneNumber.value)) {
		alert("手机号码有误，请重填，手机号码11位数字，目前支持前两位13、14、15、16、17、18手机号码");
		document.forma.phoneNumber.focus();
		return false
	}
	return true
}

function applyMoney(C) {
	var A = doValidate();
	alert(A);
	var B = d(C);
	alert(B)
}

function uploadFile(A) {
	var B = new FormData();
	switch(A) {
		case 0:
			var C = document.getElementById("LIMITPIC");
			if(C.files[0] == undefined) {
				alert("请选择文件");
				return false
			}
			B.append("file", C.files[0]);
			B.append("fileType", "1");
			B.append("fileClass", "LIMITPIC");
			break;
		case 1:
			var C = document.getElementById("IDCARDPICFRONT");
			if(C.files[0] == undefined) {
				alert("请选择文件");
				return false
			}
			B.append("file", C.files[0]);
			B.append("fileType", "1");
			B.append("fileClass", "IDCARDPICFRONT");
			break;
		case 2:
			var C = document.getElementById("IDCARDBACK");
			if(C.files[0] == undefined) {
				alert("请选择文件");
				return false
			}
			B.append("file", C.files[0]);
			B.append("fileType", "1");
			B.append("fileClass", "IDCARDBACK");
			break;
		default:
			break
	}
	B.append("userName", getCookie("userName"));
	B.append("password", getCookie("password"));
	$.ajax({
		url: SERVER_ADD_PORT + "/fileUpLoad/fileUpLoad",
		type: "POST",
		data: B,
		cache: false,
		contentType: false,
		processData: false,
		success: function(E) {
			var D = JSON.parse(E);
			if("200" == D.code) {
				switch(A) {
					case 0:
						$("#result0").html("上传成功！");
						$("#img0").attr("src", D.msg);
						break;
					case 1:
						$("#result1").html("上传成功！");
						$("#img1").attr("src", D.msg);
						break;
					case 2:
						$("#result2").html("上传成功！");
						$("#img2").attr("src", D.msg);
						break;
					default:
						break
				}
			} else {
				switch(A) {
					case 0:
						$("#result0").html("上传成功！");
						break;
					case 1:
						$("#result1").html("上传成功！");
						break;
					case 2:
						$("#result2").html("上传成功！");
						break;
					default:
						break
				}
			}
			console.log("imgUploader upload success")
		},
		error: function() {
			$("#result").html("与服务器通信发生错误")
		}
	})
}

function postPage() {
	var A = document.getElementById("upload0");
	A.addEventListener("click", function() {
		uploadFile(0)
	}, false);
	var C = document.getElementById("upload1");
	C.addEventListener("click", function() {
		uploadFile(1)
	}, false);
	var B = document.getElementById("upload2");
	B.addEventListener("click", function() {
		uploadFile(2)
	}, false);
	$.ajax({
		cache: true,
		type: "POST",
		url: SERVER_ADD_PORT + "/finance/checkPage01",
		data: {
			"userName": getCookie("userName"),
			"password": getCookie("password"),
		},
		async: false,
		error: function(D) {
			alert("获取状态失败，请稍后")
		},
		success: function(E) {
			var D = JSON.parse(E);
			if(D.code == "600") {
				window.location.href = "./hexagram.html"
			}
		}
	})
};