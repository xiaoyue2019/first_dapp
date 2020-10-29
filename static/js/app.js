layui.use(['element','layer', 'jquery'], function(){
    let element = layui.element,
        layer = layui.layer,
        $ = layui.jquery;
    $(document).ready(function () {
        $("#check").on("click", function() {
            let val = $("#domain").val();
            if (val === undefined || val === null || val === ""){
                layer.msg("内容不能为空", {icon:2, shadeClose: true});
                return
            }
            let n = 0,
                timer = setInterval(function(){
                    n = n + Math.random() * 5 | 0;
                    if(n > 99){
                        n = 99;
                        clearInterval(timer);
                    }
                    element.progress('progress', n + '%');
                }, 300 + Math.random() * 1000);
            $(this).attr("disabled", "disabled");
            $(this).addClass("layui-btn-disabled");
            $.ajax({
                url: "/api/v1/check/",  // 此处填接口地址
                type: "post",
                dataType: "json",
                data: {
                    domain: val
                },
                success: function (data) {
                    if (data.status === 0){
                        element.progress('progress', '0%');
                        clearInterval(timer);
                        layer.msg(data.msg, {icon:6, shadeClose: true}, function () {
                            $("#register").removeClass("layui-btn-disabled").removeAttr("disabled");
                            $("#check").removeClass("layui-btn-disabled").removeAttr("disabled");
                        });
                    } else {
                        element.progress('progress', '0%');
                        clearInterval(timer);
                        $("#check").removeClass("layui-btn-disabled").removeAttr("disabled");
                        layer.msg(data.msg, {icon:5, shadeClose: true});
                    }
                },
                error: function () {
                    element.progress('progress', '0%');
                    $("#check").removeClass("layui-btn-disabled").removeAttr("disabled");
                    clearInterval(timer);
                    layer.msg("接口请求发生错误", {icon:2, shadeClose: true});
                }
            });
        });
        $("#register").on("click", function() {
            console.log('d');
            window.location.href="/register/?domain="+$("#domain").val();
        });
    });
});
