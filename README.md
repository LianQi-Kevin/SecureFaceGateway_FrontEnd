# SecretFaceGateway Frontend

基于 FastApi + Deepface + Vue3 + ElementPlus 的人脸识别系统前端

* [element-plus](https://element-plus.org/zh-CN/)
* [Vite](https://vitejs.dev/)
* [Vue3](https://cn.vuejs.org/guide/introduction.html)
* [Vue-Router](https://router.vuejs.org/zh/)

### TODO

- [x] 添加人脸识别功能
- [x] 添加人脸注册功能
- [x] 添加后台数据管理系统
- [x] 添加预约请假系统
- [ ] 基于i18n的国际化支持
- [ ] 使用基于[face-api.js](https://github.com/justadudewhohacks/face-api.js)的人脸识别功能，从后端移除deepface人脸识别

预约请假系统

1. 需要普通用户登陆后创建请假请求
2. 需要管理员账户查看请假批复
3. 需要普通用户查看请假批复
4. 需要管理员账户查看请假记录

---

### install electron && electron-builder

> 详参: [添加 Electron 和 electron-builder 到现有 Vite 项目](https://blog.csdn.net/liuliu123456790/article/details/135902415)

1. 设置代理

    ```shell
    $env:ELECTRON_GET_USE_PROXY=1
    $env:GLOBAL_AGENT_HTTP_PROXY='http://127.0.0.1:52539'
    $env:GLOBAL_AGENT_HTTPS_PROXY='http://127.0.0.1:52539'
    ```

2. 安装 electron 和 electron-builder

    ```shell
    npm install --verbose electron electron-builder --save-dev
    ```