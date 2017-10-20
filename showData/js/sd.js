$(function () {
    $.ajax({
        url:'https://free-api.heweather.com/v5/weather?city=chengdu&key=3157ca77f63341bba3325711a1ff15a9',
        method:'get'
    }).success(function(result){
        result.HeWeather5.map(function(data){
            console.log(data);
            var aqi = data.aqi;
            var tqBasic = data.basic;//基本信息
            var daily_forecast = data.daily_forecast;//7-10天天气预报
            var hourly_forecast =data.hourly_forecast;
            var now = data.now;//实时天气
            var suggestion = data.suggestion;

            console.log(daily_forecast);
            var th_html,td_html;
            /*基本信息表*/
            $('#tq-basic thead tr').empty();
            $('#tq-basic tbody').empty();
            $(tqBasic).each(function(commentIndex,comment){
                //获得本地时间
                var tq_update_loc;
                $(comment.update).each(function (index, value ) {
                    tq_update_loc = value.loc;
                });
                //列表内容
                td_html+=`<tr><td>${commentIndex+1}</td><td>${comment.city}</td><td>${comment.cnty}</td><td>${tq_update_loc}</td></tr>`;
            });
            //表头
            th_html+= '<th>#</th><th>城市</th><th>国家</th><th>日期</th>';
            $('#tq-basic thead tr').html(th_html);
            $('#tq-basic tbody').html(td_html);

            /*实时天气*/
            th_html = '';
            td_html = '';
            $('#tq-now thead tr').empty();
            $('#tq-now tbody').empty();
            $(now).each(function (commentIndex,comment) {
                //天气状况
                var txt,code;
                var obj = comment.cond;
                $.each(obj,function(){
                    txt= obj.txt;
                    code=obj.code;
                })
                //风力
                var wind;
                $.each(comment.wind,function(){
                    wind = comment.wind.dir+' '+comment.wind.sc+'级 风速'+comment.wind.spd;
                })
                td_html+=`<tr><td>${commentIndex+1}</td><td>${txt}</td><td>${comment.tmp}</td><td><img src="img/${code}.png"></td><td>${comment.hum}</td><td>${wind}</td></tr>`;
            })
            th_html+='<th>#</th><th>天气</th><th>温度</th><th>图标</th><th>湿度</th><th>风力</th>';
            $('#tq-now thead tr').html(th_html);
            $('#tq-now tbody').html(td_html);

            /*7-10天天气预报*/
            th_html = '';
            td_html = '';
            //var array_td_html=[];
            $('#daily-forecast thead tr').empty();
            $('#daily-forecast tbody').empty();
            $(daily_forecast).each(function(commentIndex,comment){
                var tmp;;
                //温度
                $.each(comment.tmp,function () {
                    tmp = comment.tmp.min+'℃ -'+comment.tmp.max+'℃';
                });
                //天气状况
                var txt_d,txt_n,code_d;
                var obj = comment.cond;
                $.each(obj,function(){
                    code_d = obj.code_d;
                    txt_d = obj.txt_d;
                    txt_n = obj.txt_n;
                })
                //风力
                var wind;
                $.each(comment.wind,function(){
                    wind = comment.wind.dir+' '+comment.wind.sc+'级 风速'+comment.wind.spd;
                })
                //列表内容
                td_html+=`<tr><td>${commentIndex+1}</td><td>${tmp}</td><td>${txt_d}</td><td>${txt_n}</td><td><img src="img/${code_d}.png"></td><td>${comment.hum}%</td><td>${wind}</td><td>${comment.date}</td></tr>`;
                /*var str = `<tr><td>${commentIndex+1}</td><td>${tmp}</td><td>${txt_d}</td><td>${txt_n}</td><td><img src="img/${code_d}.png"></td><td>${comment.hum}%</td><td>${wind}</td><td>${comment.date}</td></tr>`;
                array_td_html.push(str);*/
            });
            //表头;
            th_html+=`<th class="ds">#<span class="caret"></span></th><th class="ds">温度</th><th>白天</th><th>夜间</th><th>图标</th><th class="ds">湿度</th><th>风力</th><th class="px">日期</th>`;
            $('#daily-forecast thead tr').html(th_html);
            $('#daily-forecast tbody').html(td_html);
            //排序
            px(array_td_html);
        });
    })

    function dataSort(){
        $.on('click','th',function(){
            var table = $(this).parents('table').eq(0);
            var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));

        })

        function comparer(index){

        }
    }

})
