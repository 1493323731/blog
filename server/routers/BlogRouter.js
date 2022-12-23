//博客表增删改查
const express = require("express");
const router = express.Router();
const { db, genid } = require("../db/DbUtils");

//添加接口
router.post("/token/add", async (req, res) => {
  let { title, categoryId, content } = req.body;
  let id = genid.NextId();
  let create_time = new Date().getTime();

  const insert_sql =
    "INSERT INTO `blog`(`id`,`title`,`category_id`,`content`,`create_time`) VALUES (?,?,?,?,?)";

  let params = [id, title, categoryId, content, create_time];

  let { err } = await db.async.run(insert_sql, params);

  if (err == null) {
    res.send({
      code: 200,
      msg: "添加成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "添加失败",
    });
  }
});

//删除接口
router.delete("/token/delete", async (req, res) => {
  let id = req.query.id;
  const delete_sql = "DELETE FROM blog WHERE `id` = ?";
  let { err } = await db.async.run(delete_sql, [id]);

  if (err == null) {
    res.send({
      code: 200,
      msg: "删除成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "删除失败",
    });
  }
});

//修改接口
router.put("/token/update", async (req, res) => {
  let { id, title, categoryId, content } = req.body;

  const update_sql =
    "UPDATE `blog` SET `title` = ?,`content` = ?,`category_id` = ? WHERE `id` = ?";
  let params = [title, content, categoryId, id];

  let { err } = await db.async.run(update_sql, params);
  if (err == null) {
    res.send({
      code: 200,
      msg: "修改成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "修改失败",
    });
  }
});

//查询接口
router.get("/search", async (req, res) => {
  let { keyword, categoryId, page, pageSize } = req.query;

  page = page == null ? 1 : page;
  pageSize = pageSize == null ? 10 : pageSize;
  categoryId = categoryId == null ? 0 : categoryId;
  keyword = keyword == null ? "" : keyword;

  let params = [];
  let whereSqls = [];

  if (categoryId != 0) {
    params.push(categoryId);
    whereSqls.push(" `category_id` = ? ");
  }
  if (keyword != "") {
    whereSqls.push("(`title` LIKE ? OR `content` LIKE ?)");
    params.push("%" + keyword + "%");
    params.push("%" + keyword + "%");
  }
  let whereSqlsStr = "";
  if (whereSqls.length > 0) {
    whereSqlsStr = " WHERE " + whereSqls.join(" AND ");
  }
  //查询分页数据
  let searchSql =
    "SELECT `id`,`category_id`,`create_time`,`title`,substr(`content`,0,50) AS `content` FROM `blog`" +
    whereSqlsStr +
    " ORDER BY `create_time` DESC LIMIT ?,?";
  let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize]); //最后两个参数代表从第几条开始和往后多少条
  //查询数据总数
  let searchCountSql = "SELECT count(*) as `count` FROM `blog`" + whereSqlsStr;
  let searchCountParams = params;

  let searchResult = await db.async.all(searchSql, searchSqlParams);
  let countResult = await db.async.all(searchCountSql, searchCountParams);

  if (searchResult.err == null && countResult.err == null) {
    res.send({
      code: 200,
      msg: "查询成功",
      data: {
        keyword,
        categoryId,
        page,
        pageSize,
        rows: searchResult.rows,
        count: countResult.rows[0].count,
      },
    });
  } else {
    res.send({
      code: 500,
      msg: "查询失败",
    });
  }
});
//获取文章接口
router.get("/detail", async (req, res) => {
  let { id } = req.query;
  let detail_sql = "SELECT * FROM `blog` WHERE `id` = ?";
  let { err, rows } = await db.async.all(detail_sql, [id]);
  if (err == null) {
    res.send({
      code: 200,
      msg: "获取成功",
      rows,
    });
  } else {
    res.send({
      code: 500,
      msg: "获取失败",
    });
  }
});
module.exports = router;
