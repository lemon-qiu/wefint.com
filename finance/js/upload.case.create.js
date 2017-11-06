//
// INSTANCE SPECIFIC METHODS
//
var UUID = function (){
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
};

var key = new UUID();
//host = $("#host").val();
signature = $("#signature").val();
callbackbody = $("#callbackbody").val();
policy = $("#policy").val();
aliyunPath = $("#aliyunPath").val();
var suf = ".png";
function set_upload_param(up) {
    new_multipart_params = {
        'key' :"1_"+key+suf,
        'policy': policy,
        'OSSAccessKeyId': "cgmXmQf2t99QeFa4",
        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
        'signature': signature,
        'callback':callbackbody,
    };

    up.setOption({
        'url':aliyunPath,
        'multipart_params': new_multipart_params
    });
}

var uploader = new plupload.Uploader({
    runtimes : 'html5,flash,silverlight,html4',
    browse_button : 'picker',
    container: document.getElementById('photos'),
    flash_swf_url : 'Moxie.swf',
    silverlight_xap_url : 'Moxie.xap',
    filters: {
        mime_types : [ //只允许上传图片和zip文件
            { title : "Image files", extensions : "jpg,png,jpeg,bmp" },
        ],
        max_file_size : '20mb', //最大只能上传20mb的文件
        prevent_duplicates : true //不允许选取重复文件
    },
    url : aliyunPath,

    init: {
        PostInit: function() {
            set_upload_param(uploader);
        },
        BeforeUpload: function(uploader,file) {
            key = UUID();
            suf = file.name.substring(file.name.lastIndexOf("."),file.name.length);
            set_upload_param(uploader);
        },
        FilesAdded: function(up, files) {
            plupload.each(files, function(file) {
                var fileName = $.trim(file.name);
                if(fileName.length>12){
                    fileName = fileName.substring(0,12)+"...";
                }
                var $li = $(
                        '<li id="'+file.id+'" style="position: relative;"  onmouseout="$(\''+'#deleteIcon'+file.id+'\').css(\''+'display'+'\','+'\'none'+'\');$(\''+'#delMsk'+file.id+'\').css(\''+'display'+'\','+'\'none'+'\');" onmousemove="$(\''+'#deleteIcon'+file.id+'\').css(\''+'display'+'\',\''+'block'+'\');$(\''+'#delMsk'+file.id+'\').css(\''+'display'+'\','+'\'block'+'\')" id="'+file.id+'"  class="u-photos">'+
                        '<div style="display: none;"  id="delMsk'+file.id+'" class="u-msk"></div>'+
                        '<div title="删除" style="display: none;cursor:pointer;right: -15px;" onclick="removePhoto(\''+file.id+'\');" id="deleteIcon'+file.id+'" class="u-del" onclick="uploader.removeFile('+file+' )"></div>'+
                        '<a id="file-'+file.id+'" href="#"></a>'+
                        '</li>'
                    ),
                    $img = $li.find('img');

                // $list为容器jQuery实例
                $("#photos").append( $li );
                !function () {
                    previewImage(file, function (imgsrc) {
                        $('#file-' + file.id).append('<img width=\'200px\' height=\'160px\'  src="' + imgsrc + '" />');
                    })
                }();
            });
        },
        UploadProgress: function(up, file) {

           
        },

        FileUploaded: function(up, file, info) {
 			var percent = $("#photos li").length - 1;
            var sPrcent = parseInt(100 / percent);

        	if(file.percent == 100){
                thisPercent += sPrcent;
            }
            if(thisPercent >= 100){
                thisPercent = 100;
            }
 
            $('#percent').text(parseInt(thisPercent)+"%");
            
            var myData = eval('(' + info.response + ')');
            set_upload_param(up);
            if(myData.rcode != "000000"){
                zwAlert("图片 "+file.name+" 已经损坏了,换一张吧.");
            }
            document.getElementById("pic").value = document.getElementById("pic").value +myData.rdata.id+ ",";
            $("#photoCount").val(parseInt($("#photoCount").val())+1);
        },
        UploadComplete: function(up, files) {
            if(!document.getElementById("pic").value || document.getElementById("pic").value == ''){
                zwAlert("照片好像上传失败了，刷新页面重新试一下吧");
                return;
            }
            if(parseInt($("#photoCount").val()) == ($("#photos li").length - 1)){
                document.getElementById("pic").value = document.getElementById("pic").value.substring(0,document.getElementById("pic").value.length-1);
                var date=new Date();
                //将date设置为7天以后的时间
                date.setTime(date.getTime()+7*24*3600*1000);
                //将两个cookie设置为7天后过期
                //将两个cookie设置为7天后过期
                document.cookie="uutype=1; expires="+date.toGMTString()+";path=/";
                $("#saveCase").submit();
            }
        },
        Error: function(up, err) {
            if(err.code == "-600"){
                zwAlert("图片 "+err.file.name+" 太大了!图片最大不能超过20M哦.");
                return;
            }else if(err.code == "-601" || err.code == "-700"){
                zwAlert("图片 "+err.file.name+" 格式不对哦,只能上传jpg,png,jpeg,bmp格式的图片");
                return;
            }
            set_upload_param(up);
            //zwAlert("图片 "+err.file.name+" 上传失败了!"+ err.response);
        }
    }
});
thisPercent = 0;
uploader.init();


function previewImage(file, callback) {//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
    if (!file || !/image\//.test(file.type)) return; //确保文件是图片
    if (file.type == 'image/bmp' || file.type == 'image/gif') {//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
        var fr = new mOxie.FileReader();
        fr.onload = function () {
            callback(fr.result);
            fr.destroy();
            fr = null;
        }
        fr.readAsDataURL(file.getSource());
    } else {
        var preloader = new mOxie.Image();
        preloader.onload = function () {
            preloader.downsize(300, 300);//先压缩一下要预览的图片,宽300，高300
            var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
            callback && callback(imgsrc); //callback传入的参数为预览图片的url
            preloader.destroy();
            preloader = null;
        };
        preloader.load(file.getSource());
    }
}
