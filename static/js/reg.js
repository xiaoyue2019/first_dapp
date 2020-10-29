layui.use(['jquery', 'layer'], function () {
    const abi=[
        {
          "inputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "string",
              "name": "domain",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "add",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "boo",
              "type": "bool"
            }
          ],
          "name": "view_domain",
          "type": "event"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "string",
              "name": "_domain",
              "type": "string"
            }
          ],
          "name": "give_my_domain",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "address",
              "name": "_add",
              "type": "address"
            }
          ],
          "name": "trans",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
    const addresss = '0x96CED57AE4917D845581bf70B4Cf4A7a1127cDb7'
    function getCookie(name) {
        var prefix = name + "="
        var start = document.cookie.indexOf(prefix)
     
        if (start == -1) {
            return null;
        }
     
        var end = document.cookie.indexOf(";", start + prefix.length)
        if (end == -1) {
            end = document.cookie.length;
        }
     
        var value = document.cookie.substring(start + prefix.length, end)
        return unescape(value);
    }

    if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
          window.ethereum.enable();
        } catch (error) {
          console.error("User denied account access")
        }
      }
    else if (window.web3) {
        web3Provider = window.web3.currentProvider;
        }
      else {
        web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      }
      web3 = new Web3(web3Provider);

    let $ = layui.jquery,
    layer = layui.layer;
    
    $(document).ready(function () {
        $("#check").on("click", function () {
            web3.eth.getAccounts().then(function (value) {
                con = new web3.eth.Contract(abi,'0x3BCbD316417017EA6105Fa09a1760412D3200ebB',{gas:25000,gasPrice:'41000000000'}) 
                con.methods.give_my_domain('bb').send({from:value[0],value:web3.utils.toWei('0.01','ether')},(error,res)=>{
                    console.log(error)
                    console.log(res)
                    _hash = res
                    $.ajax({
                        url: "/api/v1/register/", // 此处填接口地址
                        type: "get",
                        dataType: "json",
                        data: {
                            hash: _hash
                        },
                        success: function (data) {
                            if (data.status === 0){
                                $("#msg").remove();
                                $("#func1").append(`
                                    <span class="msg" style="color: #00FF00" id="msg">
                                        <i class="layui-icon ok">&#xe605;</i>
                                        注册成功！可以使用新域名地址进行接收转账了！
                                    </span>
                                `);
                                // setTimeout(function () {
                                //     $("#msg").remove();
                                //     $("#check").removeClass("layui-btn-disabled").removeAttr("disabled");
                                // }, 60 * 1000);
                            } else {
                                $("#msg").remove();
                                $("#func1").append(`
                                    <span class="msg" style="color: red" id="msg">
                                        <i class="layui-icon fail">&#x1006;</i>
                                        注册失败！请联系微信:balala-eth！
                                    </span>
                                `);
                                // setTimeout(function () {
                                //     $("#msg").remove();
                                //     $("#check").removeClass("layui-btn-disabled").removeAttr("disabled");
                                // }, 60 * 1000);
                            }
                        },
                        error: function () {
                            $("#msg").remove();
                        }
                    });
                })
            })
            $("#func1").append(`
                <span class="msg" style="color: red" id="msg">
                    <i class="layui-icon loading layui-anim layui-anim-rotate layui-anim-loop">&#xe63e;</i>
                    注册流程中……(需要三分钟分钟左右，请不要关闭浏览器!)
                </span>
            `);
            // $(this).addClass("layui-btn-disabled").attr("disabled", "");
        });
        $("#submit").on("click", function () {
            $("#func2").append(`
                <span class="msg" style="color: red" id="msg2">
                    <i class="layui-icon loading layui-anim layui-anim-rotate layui-anim-loop">&#xe63e;</i>
                    注册流程中……(需要三分钟分钟左右，请不要关闭浏览器!)
                </span>
            `);
            $.ajax({
                url: "/api/v1/token_register/",
                type: "post",
                dataType: "json",
                data: {
                    address: $("#key").val()
                },
                success: function (data) {
                    if (data.status === 0){
                        $("#msg2").remove();
                        $("#func2").append(`
                            <span class="msg" style="color: #00FF00" id="msg2">
                                <i class="layui-icon ok">&#xe605;</i>
                                注册成功！可以使用新域名地址进行接收转账了！
                            </span>
                        `);
                        // setTimeout(function () {
                        //     $("#msg").remove();
                        //     $("#check").removeClass("layui-btn-disabled").removeAttr("disabled");
                        // }, 60 * 1000);
                    } else {
                        $("#msg2").remove();
                        $("#func2").append(`
                            <span class="msg" style="color: red" id="msg2">
                                <i class="layui-icon fail">&#x1006;</i>
                                注册失败！请联系微信:balala-eth！
                            </span>
                        `);
                        // setTimeout(function () {
                        //     $("#msg").remove();
                        //     $("#check").removeClass("layui-btn-disabled").removeAttr("disabled");
                        // }, 60 * 1000);
                    }
                },
                error: function () {
                    $("#msg").remove();
                    layer.msg("接口请求发生错误", {icon:2, shadeClose: true});
                }
            });
            
        });
    });
});