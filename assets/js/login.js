$(function () {
  //点击 去注册账号 的连接
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });

  //点击 去登录 的连接
  $("#link_login").on("click", function () {
    $(".reg-box").hide();
    $(".login-box").show();
  });

  //从layui中获取form对象
  var form = layui.form;
  var layer = layui.layer;
  //通过form.verify函数自定义校验规则
  form.verify({
    //自定义了一个叫pwd的校验规则
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    //校验两次密码是否一致
    repwd: function (value) {
      //通过形参拿到的是确认密码框中的内容
      //还需要拿到密码框中单内容
      var pwd = $(".reg-box [name=password]").val();
      if (pwd != value) {
        return "两次密码不一致";
      }
    },
  });

  //监听注册表单的提交事件
  $("#form_reg").on("submit", function (e) {
    //阻止默认提交的行为
    e.preventDefault();
    var loginData = {
      username: $("#form_reg [name=username]").val(),
      password: $("#form_reg [name=password]").val(),
    };
    //发起ajax的post请求 $.post(url,data,function(){})
    $.post("/api/reguser", loginData, function (res) {
      if (res.status != 0) {
        return layer.msg(res.message);
      }
      layer.msg("注册成功,请登录");
    });
    //清空表单
    $("#form_reg [name=username]").val("");
    $("#form_reg [name=password]").val("");
    $("#form_reg [name=repassword]").val("");
    $("#link_login").click();
  });

  //监听登录表单的提交事件
  $("#form_login").submit(function (e) {
    //阻止默认提交的行为
    e.preventDefault();
    $.ajax({
      url: "/api/login",
      method: "POST",
      //快速获取表单中的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) {
          return layer.msg("登录失败");
        }
        layer.msg("登录成功");
        //将登录成功得到的 token值 保存到 localStorage
        localStorage.setItem("token", res.token);
        // console.log(res.token);
        //跳转到后台主页
        location.href = "/index.html";
      },
    });
  });
});
