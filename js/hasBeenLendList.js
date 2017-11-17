$(function() {
    /***
     * 催款用户查看
     * layui Table
     */
    layui.use('table', function () {
        var table = layui.table;
        //已放款列表
        table.render({
            elem: '#audit-list'
            , id: 'id'
            , url: getUrl(5)+'/getMerchantInfoList?approveStatus=5'
            , cols: [[
                {field: 'id', title: '#', width: 80, sort: true}
                , {field: 'userName', title: '姓名', width: 200, sort: true}
                , {field: 'certNo', title: '身份证号', width: 200, sort: true}
                , {field: 'mobile', title: '贷款金额', width: 200, sort: true}
                , {field: 'motelName', title: '可贷款余额', width: 300, sort: true}
                , {field: 'approveStatus', title: '状态', templet: '#status', width: 150}
                , {fixed: 'right', title: '操作', width: 300, toolbar: '#barDemo'}
            ]]
            , height: 315
            , skin: 'row' //表格风格
            , even: true
            , page: true //是否显示分页
            , limits: [5, 10, 20]
            , limit: 5 //每页默认显示的数量
        });


        //监听工具条
        table.on('tool(auditTable)', function (obj) {
            var data = obj.data;
            if (obj.event == 'download') {
                getDownload(data);
            }
        });
    });

    /**
     * 下载文件
     * @param rows
     */
    function getDownload(rows) {
        // var frame = $("<iframe style='display: none;'/>");
        // frame.appendTo($("body")).attr({ "src":  getUrl(5)+"/downloadZipFile/" + rows.userId, "display": "block" });
        // setTimeout(function () {
        //     frame.remove();
        // }, 200);
        console.log(111);
        $.ajax({
            method:'GET',
            url:getUrl(5)+"/downloadZipFile/" + rows.userId,
            error:function(result) {
                alert('下载失败');
            },
            success:function(result) {
                console.log(222);
                window.open(getUrl(5)+"/downloadZipFile/" + rows.userId,'false');
            }
        })
    }

})