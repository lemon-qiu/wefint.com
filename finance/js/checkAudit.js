$(function() {
    /***
     * 第三方列表页面显示
     * layui Table
     */
    layui.use('table', function () {
        var table = layui.table;

        //客栈注册列表
        table.render({
            elem: '#audit-list'
            , id: 'id'
            , url: getUrl(5)+'/getMerchantInfoList?approveStatus=5'
            , cols: [[
                {field: 'id', title: '#', width: 80, sort: true}
                , {field: 'userName', title: '姓名', width: 200, sort: true}
                , {field: 'certNo', title: '身份证号', width: 200, sort: true}
                , {field: 'mobile', title: '联系方式', width: 200, sort: true}
                , {field: 'motelName', title: '客栈名称', width: 300, sort: true}
                , {field: 'motelProviceName', title: '省份', width: 80, sort: true}
                , {field: 'motelCityName', title: '市级', width: 80, sort: true}
                , {field: 'motelAreaName', title: '区/县', width: 150, sort: true}
                , {field: 'approveStatus', title: '状态', templet: '#status', width: 150}
                , {fixed: 'right', title: '操作', width: 200, toolbar: '#barDemo'}
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
            if (obj.event == 'detail') {
                getDetail(data);
            } else if (obj.event == 'checkLevelOne') {
                getCheckLevelOne(data);
            } else if (obj.event == 'checkLevelTwo') {
                getCheckLevelTwo(data);
            } else if(obj.event=='hasBeenLend'){
                getHasBeenLend(data);
            }
        });
    });
})