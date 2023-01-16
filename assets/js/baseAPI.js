//每次调用$.get() $.post() $.ajax()的时候，会调用ajaxPrefilter函数
$.ajaxPrefilter(function (options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = "http://www.liulongbin.top:3007" + options.url;

  //统一为有权限的端口交 headers 请求头
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }

  //全局统一挂在complete回调函数
  options.complete = function (res) {
    // console.log(res);
    //再complete回调函数中，可以使用res.responseJSON拿到服务器去响应回来的数据
    if (
      res.responseJSON.status == 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      //1.强制清空token
      localStorage.removeItem("token");
      //2.强制跳转到登录页
      location.href = "/login.html";
    }
  };
});
