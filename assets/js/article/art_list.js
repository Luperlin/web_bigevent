$(function () {
  var form = layui.form;
  var laypage = layui.laypage;
  //定义一个查询的参数对象q
  //将来请求数据的时候将请求参数对象提交到服务器
  var q = {
    pagenum: 1, //页码值
    pagesize: 2, //	每页显示多少条数据
    cate_id: "", //文章分类的 Id
    state: "", //文章的状态，可选值有：已发布、草稿
  };

  //定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (data) {
    const dt = new Date(data);
    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());
    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());
    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  //补零函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  //获取文章列表数据
  initTable();
  initCate();
  function initTable() {
    $.ajax({
      url: "/my/article/list",
      method: "GET",
      data: q,
      success: function (res) {
        console.log(res);
        // renderPage(res.total);
        if (res.status !== 0) {
          return layui.layer.msg("获取文章列表数据失败！");
        }
        layui.layer.msg(res.message);
        //使用模版引擎渲染页面
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        //表格生成后再调用分页  传入总数据条数res.total
        renderPage(res.total);
      },
    });
  }

  //初始化文章分类的方法
  function initCate() {
    $.ajax({
      url: "/my/article/cates",
      method: "GET",
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg("获取文章分类失败");
        }
        //调用模版引擎分类的可选项
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }

  //为筛选表单绑定submit事件
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    var cate_id = $("[name]=cate_id").val();
    var state = $("[name]=state").val();
    //为查询对象 q 中对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;
    //根据筛选天骄重新渲染表格数据
    initTable();
  });

  //定义渲染分页的方法
  //传入总数据条数res.total
  function renderPage(total) {
    laypage.render({
      elem: "pageBox", //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, //每页显示几条数据
      curr: q.pagenum, //设置默认被选中的分页
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候触发  jump回调
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        //把最新的页码值赋值到q
        q.pagenum = obj.curr;

        console.log(obj.limit); //得到每页显示的条数
        //把最新的条目数赋值到q身上
        q.pagesize = obj.limit;

        //首次不执行
        if (!first) {
          //根据最新的q获取对应数据列表，并渲染表格
          initTable();
        }
      },
    });
  }

  //通过代理形式，为删除按钮绑定点击事件处理函数
  $("tobody").on("click", ".btn-delete", function () {
    //获取删除按钮的个数
    var len = $(".btn-delete").length;
    //获取当前文章的id
    var id = $(this).attr("data-id");
    //询问数据是否要删除
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        url: "/my/article/delete/" + id,
        method: "GET",
        success: function (res) {
          if (res.status !== 0) {
            return layui.layer.msg("删除文章失败！");
          }
          layui.layer.msg(res.message);
          //当前页删光了，因此当前页没数据所以流标不显示，因此需要判断当前页是否还有剩余数据
          if (len === 1) {
            //如果len=1，那么就证明删除完毕后，页面上就没有任何数据了
            //页码值最小必须
            if (q.pagenum === 1) {
              q.pagenum = 1;
            } else {
              q.pagenum = q.pagenum - 1;
            }
          }
          initTable();
        },
      });

      layer.close(index);
    });
  });
});
