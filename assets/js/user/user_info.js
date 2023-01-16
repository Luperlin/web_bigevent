$(function () {
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称长度必须在1~6个字符之间！";
      }
    },
  });

  //调用用户基本信息函数
  initUserInfo();

  //初始化用户基本信息
  function initUserInfo() {
    $.ajax({
      url: "/my/userinfo",
      method: "GET",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户信息失败！");
        }
        // console.log(res);
        //为表单赋值
        // form.val("formUserInfo", {
        //   username: res.data.username,
        //   nickname: res.data.nickname,
        //   email: res.data.email,
        // });
        //或者
        form.val("formUserInfo", res.data);
      },
    });
  }

  //重置表单数据
  $("#btnRest").on("click", function (e) {
    e.preventDefault();
    initUserInfo();
  });
  //监听表单的提交
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    //获取表单数据
    // var userInfoData = {
    //   id: $("#form_userInfo [name=id]").val(),
    //   nickname: $("#form_userInfo [name=nickname]").val(),
    //   email: $("#form_userInfo [name=email]").val(),
    // };
    //或者直接使用$(this).serialize()
    //发起ajax请求
    $.ajax({
      url: "/my/userinfo",
      method: "POST",
      data: $(this).serialize(), // userInfoData 或者直接使用$(this).serialize()
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("修改用户信息失败！");
        }
        layer.msg("更新用户信息成功！");
        // console.log(res);
        initUserInfo();
        //调用父页面里的方法 重新渲染
        window.parent.getUserInfor();
      },
    });
  });
});
