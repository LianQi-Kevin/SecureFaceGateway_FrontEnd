import {useJwt} from "@vueuse/integrations/useJwt";
import {InternalAxiosRequestConfig} from "axios";

// 请求拦截器，添加access_token
export function token_interceptor(config: InternalAxiosRequestConfig) {
    const token = localStorage.getItem("access_token");
    if (token) {
        // 校验jwt的exp
        const { payload } = useJwt(ref(token))
        if (payload.value?.exp) {
            if (payload.value.exp < Date.now() / 1000) {
                // token过期, 要求用户重新登录获取新的access_token
                localStorage.removeItem("access_token");
                localStorage.removeItem("user_info")
                return Promise.reject("token expired");
            }
        }
        // 添加access_token
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}