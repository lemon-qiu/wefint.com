var code;function createCode(){code="";var E=4;var A=document.getElementById("code");var C=new Array(0,1,2,3,4,5,6,7,8,9,"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z");for(var B=0;B<E;B++){var D=Math.floor(Math.random()*36);code+=C[D]}document.getElementById("code").value=code}function validate(){var A=document.getElementById("checkcode").value.toUpperCase();if(A.length<=0){return false}else{if(A!=code){alert("验证码错误!");createCode();document.getElementById("checkcode").value="";return false}}return true}function memberRegister(E){var D=new Base64();var C=D.encode(E.userName);var B=D.encode(E.password);var A={"userName":C,"password":B,"hotelName":E.hotelName,"phoneNumber":E.phoneNumber,"email":E.email,};$.ajax({cache:true,type:"POST",url:"http://admin.wefint.com:8080/HotelPMS/UserRegisterServlet",data:{"strUserRegister":JSON.stringify(A)},async:false,error:function(F){alert("注册失败，请稍后再试")},success:function(F){if(F=="405"){alert("内部错误，请稍后再试")}if(F=="800"){alert("用户名重复请更换！")}if(F=="200"){alert("注册成功请登陆");window.location.href="../html/login.html"}return false}})};