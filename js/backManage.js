function getMess(){var JsonData={"userName":getCookie("userName"),"password":getCookie("password"),};$.ajax({cache:true,type:"POST",url:"http: //10.168.10.190:8080/HotelPMS/RoomSelectServlet",data:{"strSelectRoom":JSON.stringify(JsonData)},async:false,error:function(request){alert("获取状态失败，请稍后")},success:function(data){var objs=eval(data);for(var j=0;j<objs.length;j++){var aa=new Array();aa[0]=objs[j].userName;aa[1]=objs[j].hotelName;aa[2]=objs[j].email;aa[3]=objs[j].roomNumber;aa[4]=objs[j].kezhandizhi;setData(aa)}}});return false};