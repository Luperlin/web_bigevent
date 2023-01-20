$(function () {
  var form = layui.form;
  var layer = layui.layer;
  //定义加载文章分类的方法
  initCate();
  // 初始化富文本编辑器
  initEditor();
  function initCate() {
    $.ajax({
      url: "/my/article/cates",
      method: "GET",
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg("获取文章分类列表失败");
        }
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }

  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //为封面按钮绑定点击事件
  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });
  //监听coverFile的change事件,获取用户选择的文件列表
  $("#coverFile").on("change", function (e) {
    //获取到文件的列表数组
    var files = e.target.files;
    //判断用户是否选择了文件
    if (files.length === 0) {
      return;
    }
    //根据选择的文件，创建一个对应的 URL 地址
    var newImgURL = URL.createObjectURL(files[0]);
    //先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //定义文章的发布状态
  var art_state = "已发布";
  //为存为草稿按钮绑定点击事件
  $("#btnSave2").on("click", function () {
    art_state = "草稿";
  });

  //为表单绑定submit提交施加n
  $("#form-pub").on("submit", function (e) {
    //1.阻止表单的默认提交行为
    e.preventDefault();
    //2.基于form表单 快速创建FormData对象
    var fd = new FormData($(this)[0]);
    //3.通过append方法往fd中追加数据
    fd.append("state", art_state);
    //打印查看
    // fd.forEach(function (v, k) {
    //   console.log(k, v);
    // });
    //4.将封面裁剪过后的图片，输出为一个对象
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        //5.将文件对象，存储到fd中
        fd.append("cover_img", blob);
        publishArticle(fd);
      });
  });

  //定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      url: "/my/article/add",
      method: "POST",
      data: fd,
      //注意:如果想服务器提交的是FormData格式的数据
      //必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg("发表文章失败！");
        }
        layer.msg(res.message);
        //发布文章成功后跳转到文章列表页面
        location.href = "/article/art_list.html";
      },
    });
  }
});
