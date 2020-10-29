layui.use(['jquery'], function () {
    let $ = layui.jquery;
    $(document).ready(function () {
        $("#check").on("click", function () {
            $("#func1").append(`
                <span class="msg" style="color: red" id="msg">
                    <i class="layui-icon loading layui-anim layui-anim-rotate layui-anim-loop">&#xe63e;</i>
                    正在注册中……(需要一分钟左右请不要关闭浏览器!)
                </span>
            `);
            $(this).addClass("layui-btn-disabled").attr("disabled", "");
            $.ajax({
                url: "http://127.0.0.1:8000/api/v1/register/",
                type: "get",
                dataType: "json",
                success: function (data) {
                    if (data.status === 0){
                        $("#msg").remove();
                        $("#func1").append(`
                            <span class="msg" style="color: #00FF00" id="msg">
                                <i class="layui-icon ok">&#xe605;</i>
                                注册成功！<a href="https://cnmf.net.cn/index.php/archives/185/">点击此处去学习基本使用</a>
                            </span>
                        `);
                        setTimeout(function () {
                            $("#msg").remove();
                            $("#check").removeClass("layui-btn-disabled").removeAttr("disabled");
                        }, 60 * 1000);
                    } else {
                        $("#msg").remove();
                        $("#func1").append(`
                            <span class="msg" style="color: red" id="msg">
                                <i class="layui-icon fail">&#x1006;</i>
                                调用合约失败！请联系微信：balala-eth
                            </span>
                        `);
                        setTimeout(function () {
                            $("#msg").remove();
                            $("#check").removeClass("layui-btn-disabled").removeAttr("disabled");
                        }, 60 * 1000);
                    }
                },
                error: function () {
                    $("#msg").remove();
                }
            });
        });
        $("#submit").on("click", function () {
            console.log(token) //it's token
            // what can i do
        });
    });
});