$(function () {
  var layer = layui.layer;
  var form = layui.form;
  //获取文章分类列表
  initArtCateList();
  function initArtCateList() {
    $.ajax({
      url: "/my/article/cates",
      method: "GET",
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg("获取文章分类列表失败");
        }
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
      },
    });
  }

  //为添加类别按钮添加点击事件
  var indexAdd = null;
  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialong-add").html(),
    });
  });

  //通过代理的形式，为form-add表单绑定submit事件
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    // console.log("ok");
    var dataAdd = {
      name: $("#form-add [name=name]").val(),
      alias: $("#form-add [name=alias]").val(),
    };
    // console.log(dataAdd);
    $.ajax({
      url: "/my/article/addcates",
      method: "POST",
      data: dataAdd, //$(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.statys !== 0) {
          return layer.msg("新增文章分类失败！");
        }
        initArtCateList();
        layer.msg(res.message);
        layer.close(indexAdd);
      },
    });
  });

  //通过代理的形式，为btn-edit按钮绑定点击事件
  var indexEdit = null;
  $("tbody").on("click", ".btn-edit", function (e) {
    // e.preventDefault();
    // console.log("ok");
    //弹出一个修改文章信息的层
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialong-edit").html(),
    });
    var id = $(this).attr("data-id");
    // console.log(id);
    //发起请求获取对应分类数据
    $.ajax({
      url: "/my/article/cates/" + id,
      method: "GET",
      success: function (res) {
        // console.log(res);
        form.val("form-edit", res.data);
      },
    });
  });

  //通过代理的形式，为修改分类的表单绑定submit事件
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    // var dataEdit = {
    //   Id: $("#form-edit [name=Id]").val(),
    //   name: $("#form-edit [name=name]").val(),
    //   alias: $("#form-edit [name=alias]").val(),
    // };
    // console.log(dataEdit);
    $.ajax({
      url: "/my/article/updatecate",
      method: "POST",
      data: $(this).serialize(), //dataEdit, //$(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg("更新分类信息失败！");
        }
        layer.msg("更新分类信息成功！");
        layer.close(indexEdit);
        initArtCateList();
      },
    });
  });

  //通过代理的形式，为btn-delete按钮绑定点击事件
  //var indexDelete = null;
  $("tbody").on("click", ".btn-delete", function () {
    var id = $(this).attr("data-id");
    layer.confirm("确认删除", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        url: "/my/article/deletecate/" + id,
        method: "GET",
        success: function (res) {
          if (res.status !== 0) {
            console.log(res);
            return layer.msg("删除文章分类失败！");
          }
          layer.msg("删除文章分类成功！");
          layer.close(index);
        },
      });
    });
  });
});
