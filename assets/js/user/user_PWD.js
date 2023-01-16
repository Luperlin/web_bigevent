$(function () {
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    //value为新密码框值
    samePwd: function (value) {
      if (value === $("[name=oldPwd]").val()) {
        return "新旧密码不能相同！";
      }
    },
    repwd: function (value) {
      if (value !== $("[name=newPwd]").val()) {
        return "新密码必须一致！！";
      }
    },
  });

  //发起ajax请求
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    // console.log("ok");
    var userPasswordData = {
      oldPwd: $("[name=oldPwd]").val(),
      newPwd: $("[name=newPwd]").val(),
    };
    $.ajax({
      url: "/my/updatepwd",
      method: "POST",
      data: userPasswordData, //$(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("修改密码失败！");
        }
        layer.msg("更新密码成功");
        //通过[0]转化为原生DOM
        $(".layui-form")[0].reset();
      },
    });
  });
});
