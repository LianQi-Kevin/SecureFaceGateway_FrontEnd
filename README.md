# SecretFaceGateway Frontend

基于 FastApi + Deepface + Vue3 + ElementPlus 的人脸识别系统前端

* [element-plus](https://element-plus.org/zh-CN/)
* [Vite](https://vitejs.dev/)
* [Vue3](https://cn.vuejs.org/guide/introduction.html)
* [Vue-Router](https://router.vuejs.org/zh/)

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