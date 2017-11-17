//生成随机数
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
function set_upload_param(up)
{
    var signature = $('#signature').val(),
        callback = $('#callback').val(),
        policy = $('#policy').val(),
        key = UUID(),

        new_multipart_params = {
            'key' : key,
            'policy': policy,
            'callback':callback,
            'OSSAccessKeyId': 'LTAIxFAQ3g7BhPxF',
            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
            'signature': signature,
        };

        up.setOption({
            'url': getUrl(7),
            'multipart_params': new_multipart_params
        });

        console.log('reset uploader')
}

var imgId,imgUrl,imgArrays = [];
var uploader = new plupload.Uploader({
    runtimes: 'html5,flash,silverlight,html4',
    browse_button: 'selectfiles',
    container: document.getElementById('container'),
    flash_swf_url: 'Moxie.swf',
    silverlight_xap_url: 'Moxie.xap',
    filters: {
        mime_types: [ //只允许上传图片和zip文件
            {title: "Image files", extensions: "jpg,png,jpeg,bmp,tiff"},
        ],
        max_file_size: '20mb', //最大只能上传20mb的文件
        prevent_duplicates: true //不允许选取重复文件
    },
    url: getUrl(7),

    init: {
        PostInit: function() {
            document.getElementById('ossfile').innerHTML = '';
            window.uploadImgs = function(obj) {
                imgId =obj
                console.log(imgId);
                set_upload_param(uploader);
                uploader.start();
                return false;
            }
            /*document.getElementById('postfiles').onclick = function() {
                set_upload_param(uploader);
                uploader.start();
                return false;
            };*/
        },

        FilesAdded: function(up, files) {

        },

        UploadProgress: function(up, file) {

        },

        FileUploaded: function(up, file, info) {
            console.log('图片信息====',file,info)
            set_upload_param(up);
            var datas = JSON.parse(info.response).content;
            imgUrl = datas.name;
            /*var imgData = {
                userId:userId,
                url : imgUrl,
                type:thisType,
            };
            imgArrays.push(datas);*/
            savePhotos(datas);//公司数据库存入图片

            /**
             * 图片反显
             */
            var $li = $(
                '<li id="' + file.id + '" style="position: relative;"  onmouseout="$(\'' + '#deleteIcon' + file.id + '\').css(\'' + 'display' + '\',' + '\'none' + '\');$(\'' + '#delMsk' + file.id + '\').css(\'' + 'display' + '\',' + '\'none' + '\');" onmousemove="$(\'' + '#deleteIcon' + file.id + '\').css(\'' + 'display' + '\',\'' + 'block' + '\');$(\'' + '#delMsk' + file.id + '\').css(\'' + 'display' + '\',' + '\'block' + '\')" id="' + file.id + '"  class="u-photos">' +
                '<div style="display: none;"  id="delMsk' + file.id + '" class="u-msk"></div>' +
                '<div title="删除" style="display: none;cursor:pointer;right: 0px;position: absolute" onclick= removePhoto(`${imgUrl}`,this); id="deleteIcon' + file.id + '" class="u-del" ><i class="layui-icon" style="font-size:26px;background: #fff; ">&#x1007;</i> </div>' +
                '<a id="file-' + file.id + '" href="####"></a>' +
                '</li>'
                ),
                $img = $li.find('img');

            // $list为容器jQuery实例
            $(imgId).next().append($li);
            !function() {
                previewImage(file, function(imgsrc) {
                    $('#file-' + file.id).append('<img width=\'200px\' height=\'160px\'  src="' + imgsrc + '" />');
                })
            }();


        },

        Error: function(up, err) {
            console.log(err);
            set_upload_param(up);
            if(err.code == -602){
                layer.msg('图片重复上传了，请重试');
            }else if(err.code == -200){
                layer.msg('状态出错，请重试');
            }else{
                layer.msg('状态出错，请重试');
            }
        }
    }
});
uploader.init();

/**
 * 删除图片
 * @param obj 图片url
 * @param thisItem 点击的当前对象
 */
function removePhoto(obj,thisItem) {
    console.log(obj);
    var data = {
        url:obj,
    }
    var jsontext = JSON.stringify(data);
    $.ajax({//本地删除成功
        url: getUrl(4)+"/deletePmsPicByUrl",
        method: 'post',
        contentType: 'application/json;charset=utf-8',
        headers: {'wefinttoken': getCookie('token')},
        dataType: 'json',
        data:jsontext,
        error: function(result) {
            alert("删除失败，请重试。");
        },
        success: function(result) {
            $.ajax({//OSS删除成功
                url: getUrl(6)+"/upload/delete",
                method: 'post',
                contentType: 'application/json;charset=utf-8',
                headers: {'wefinttoken': getCookie('token')},
                dataType: 'json',
                data:jsontext,
                error:function(result) {
                    alert("删除失败，请重试！");
                },
                success:function() {
                    $(thisItem).parent('li').remove();
                }
            });
        }
    });
}


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
