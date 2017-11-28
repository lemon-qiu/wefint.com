$(function() {
    /***
     * 催款用户查看
     * layui Table
     */
    var userId  = getCookie('userName');
    layui.use('table', function () {
        var table = layui.table;
        /**
         * 还款列表
         */
        table.render({
            elem: '#loan-list'
            , id: 'id'
            ,url: getUrl(5) + '/getCollectionInfoList?userId='+ userId
            , cols: [[
                {field: 'contractNo', title: '合同号', width: 100, sort: true}
                , {field: 'valueDate', title: '起息日', width: 120, sort: true}
                , {field: 'interestDate', title: '到息日', width: 120, sort: true}
                , {field: 'paidAmt', title: '实收金额', width: 100, sort: true}
                , {field: 'repaymentPrincipal', title: '还款本金', width: 100, sort: true}
                , {field: 'informationFlowFee', title: '信息流量费', width: 120, sort: true}
                , {field: 'platformOperationFee', title: '平台操作费', width: 120, sort: true}
                , {field: 'creditCheckingFee', title: '征信审核费', width: 120, sort: true}
                , {field: 'repaymentInterest', title: '还款利息', width: 100, sort: true}
                , {field: 'total', title: '总计', width: 100, sort: true}
                , {field: 'repaymentDate', title: '还款日期', width: 120, sort: true}
                , {field: 'createTime', title: '申请时间', width: 160, sort: true}
                , {field: 'status', title: '状态', templet: '#loanStatus', width: 150}
                , {fixed: 'right', title: '操作', width: 150, toolbar: '#loanBar'}
            ]]
            , skin: 'row' //表格风格
            , even: true
            , page: true //是否显示分页
            , limits: [5, 10, 20]
            , limit: 5 //每页默认显示的数量
            , done: function(res, curr, count) {
                var datas = res.data;
                var len = datas.length;
                var valueDate,interestDate,repaymentDate;
                for(var i = 0 ;i<len;i++){
                    if(datas[i].valueDate != null && datas[i].valueDate != ''){
                        valueDate = new Date(datas[i].valueDate);
                        console.log(datas[i].valueDate)
                        $($(".layui-table td[data-field='valueDate']")[i]).children().text(valueDate.getFullYear() + '-'+ (valueDate.getMonth()+1) + '-' + valueDate.getDate());
                    }else {
                        valueDate = null;
                    }

                    if(datas[i].interestDate != null && datas[i].interestDate !=''){
                        interestDate = new Date(datas[i].interestDate);
                        $($(".layui-table td[data-field='interestDate']")[i]).children().text(interestDate.getFullYear() + '-'+ (interestDate.getMonth()+1) + '-' + interestDate.getDate());
                    }else {
                        interestDate = null;
                    }

                    if(datas[i].repaymentDate != null && datas[i].repaymentDate !=''){
                        repaymentDate = new Date(datas[i].repaymentDate);
                        $($(".layui-table td[data-field='repaymentDate']")[i]).children().text(repaymentDate.getFullYear() + '-'+ (repaymentDate.getMonth()+1) + '-' + repaymentDate.getDate());
                    }else {
                        repaymentDate = null;
                    }
                }
            }
        });


        //监听工具条
        table.on('tool(loanBar)', function (obj) {
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