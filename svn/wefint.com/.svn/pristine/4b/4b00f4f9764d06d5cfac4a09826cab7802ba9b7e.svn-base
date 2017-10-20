$(function () {
    layui.use('form', function(){
        var form = layui.form;

       /* form.on('radio(radios)', function(data){
            sub_check();
        });*/

        //审核通过
        form.on('submit(checkPass)', function(data) {
            // layer.msg(JSON.stringify(data.field));
            checkPass(data.field);
            return false;
        });

        //驳回
        form.on('submit(checkReject)', function(data) {
            // layer.msg(JSON.stringify(data.field));
            checkReject(data.field);
            return false;
        });

    });

    layui.use('table', function(){
        var table = layui.table;

        //客栈注册列表
        table.render({
            elem: '#hotel-list'
            ,url: ''
            ,cols: [[
                {field: 'number',title:'#',width:80,sort: true}
                ,{field:'username', title: '姓名', width:80}
                ,{field:'idcard', title: '身份证号', width:200, sort: true}
                ,{field:'phonenum', title: '联系方式', width:200,sort: true}
                ,{field:'hotelname', title: '客栈名称', width:300}
                ,{field:'province', title: '省份', width:80}
                ,{field:'city', title: '市级', width:80}
                ,{field:'country', title: '区/县', width:150}
                ,{field:'state', title: '状态', width:150}
                ,{fixed:'right', title: '操作', width:200,toolbar: '#barDemo'}
            ]]
            ,height: 315
            ,page:true
        });

        //监听工具条
        table.on('tool(hotelTable)', function(obj){
            var data = obj.data;
            if(obj.event === 'detail'){
                layer.msg('ID：'+ data.id + ' 的查看操作');
            } else if(obj.event === 'checkLevelOne'){
                getCheckLevelOne(JSON.stringify(data));
            } else if(obj.event === 'checkLevelTwo'){
                getCheckLevelOne(JSON.stringify(data));
            }
        });

    });

    /********判断是否有错误radio*********/
    function  sub_check() {
        var radios = $('input:radio:checked');
        $.each(radios,function (i) {
            if($(radios[i]).val() == 'false'){
                $('.no-pass').removeClass('layui-btn-disabled');
                $('.pass').addClass('layui-btn-disabled');
            }else {
                $('.pass').removeClass('layui-btn-disabled');
                $('.no-pass').addClass('layui-btn-disabled');
            }
        })

    }

    /************图片查看*************/
    $('.pics').on('click',function () {
        var i = $('.pics').index(this);
        var viewer = new Viewer($('.pics')[i], {
            url: 'data-original'
        });
    })

/******************************************************************/
    //一级检查
    function getCheckLevelOne(data) {

    }

/*****************************************************************/
    //提交审核通过
    function  checkReject(data) {
        var msg = data;
        console.log(msg);
        $.ajax({
            url:'',
            method: 'post',
            data:msg,
            error: function(request) {
                window.location.href = "";
            },
            success: function(data) {
                if ("405" == data) {
                    return false;
                }
                if (data == "200") {
                    return false;
                }
            }
        })
    };

    //提交驳回
    function  checkReject(data) {
        var msg = data.desc;
        console.log(msg);
        $.ajax({
            url:'',
            method: 'post',
            data:msg,
            error: function(request) {
                window.location.href = "";
            },
            success: function(data) {
                if ("405" == data) {
                    return false;
                }
                if (data == "200") {
                    return false;
                }
            }
        })
    };

})