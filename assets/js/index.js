$(function () {
  //调用getUserInfor获取用户基本信息
  getUserInfor();
  //退出功能
  var layer = layui.layer;
  $("#btnLogout").on("click", function () {
    // console.log("ok");
    //提示用户是否确认退出
    layer.confirm(
      "确定退出登录？",
      { icon: 3, title: "提示" },
      function (index) {
        // console.log("ok");
        //1.清空本地存储中单token
        localStorage.removeItem("token");
        //2.重现跳转到登录页
        location.href = "/login.html";
        //官方携带的关闭对应弹出层
        layer.close(index);
      }
    );
  });
});

//获取用户的基本信息
function getUserInfor() {
  $.ajax({
    url: "/my/userinfo",
    method: "GET",
    //headers请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },
    success: function (res) {
      //   console.log(res);
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败！");
      }
      //调用 renderAvatar函数渲染用户头像
      renderAvatar(res.data);
    },
    //不论成功还是失败都会调用complete回调函数
    // complete: function (res) {
    //   console.log(res);
    //   //再complete回调函数中，可以使用res.responseJSON拿到服务器去响应回来的数据
    //   if (
    //     res.responseJSON.status == 1 &&
    //     res.responseJSON.message === "身份认证失败！"
    //   ) {
    //     //1.强制清空token
    //     localStorage.removeItem("token");
    //     //2.强制跳转到登录页
    //     location.href = "/login.html";
    //   }
    // },
  });
}
//渲染用户头像的函数
function renderAvatar(user) {
  //1.获取用户名称
  var name = user.nickname || user.username;
  //2.设置欢迎的文本
  $("#welcome").html(`欢迎 ${name}`);
  //3.按需渲染用户头像
  if (user.user_pic !== null) {
    //3.1渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    //3.2渲染文本头像
    $(".layui-nav-img").hide();
    var firstName = name[0].toUpperCase();
    $(".text-avatar").html(firstName).show();
  }
}
