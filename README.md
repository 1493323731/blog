# blog
一个平平无奇的博客
## 项目描述
这是一个功能简单，页面简洁的博客。拥有首页、登录页、文章管理页、登陆管理页等页面，以及搜索文章、查看文章详情、登录账号、退出登录、添加文章、修改文章、删除文章、添加分类、修改分类、删除分类等功能
## 技术栈
vue3,vue route,pinia,vite,axios
## 技术实现
1.使用express搭建服务器  
2.使用sqlite3进行数据库相关操作  
3.使用uuid生成不重复的token  
4.对sqlite3的数据库操作进行promise封装  
5.使用wangEditor5富文本编辑器方便实现文件上传  
6.使用自定义中间件验证是否登录  
7.使用native-ui组件库  
8.使用app.all()配合inject使引入的依赖全局可用  
9.使用pinia进行状态管理  
10.设置请求拦截器在发送请求前添加业务
## 项目难点
1.配置wangEditor5富文本编辑器  
2.搭建服务器
## 不足
没有使用导航守卫限制路由跳转
