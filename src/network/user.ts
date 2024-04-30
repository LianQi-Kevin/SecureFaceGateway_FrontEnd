import basic_axios from "@/network/basic";
import {useJwt} from "@vueuse/integrations/useJwt";
import {AxiosResponse, InternalAxiosRequestConfig} from "axios";
import type {userInfo} from "@/types/user";

// 请求拦截器，添加access_token
function token_interceptor(config: InternalAxiosRequestConfig) {
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

// 获取当前用户信息
export async function getUserInfo(): Promise<userInfo> {
    basic_axios.interceptors.request.use(token_interceptor)
    return new Promise(async (resolve, reject) => {
        try {
            const userInfoResponse = await basic_axios.get("/api/user");
            console.debug(userInfoResponse.data);
            resolve(userInfoResponse.data);
        } catch (error) {
            reject(error);
        }
    });
}

// 创建用户
export async function createUser(username: string, password: string, role: "user" | "admin", faceImg: File): Promise<userInfo> {
    basic_axios.interceptors.request.use(token_interceptor)
    return new Promise(async (resolve, reject) => {
        try {
            const data = new FormData();
            data.append('username', username);
            data.append('password', password);
            data.append('role', role);
            data.append('faceIMG', faceImg);
            const response = await basic_axios.post("/api/user", data);
            console.debug(response.data);
            resolve(response.data);

            // resolve((await basic_axios.post("/api/user", data)).data);
        } catch (error) {
            reject(error);
        }
    });
}

// 删除用户
export async function deleteUser(userId: string): Promise<userInfo> {
    basic_axios.interceptors.request.use(token_interceptor)
    return new Promise(async (resolve, reject) => {
        try {
            const user: AxiosResponse<userInfo> = await basic_axios.delete(`/api/user/${userId}`);
            resolve(user.data);
        } catch (error) {
            reject(error);
        }
    });
}

// 获取当前用户头像, 返回blob url
export async function getUserAvatar(): Promise<string> {
    basic_axios.interceptors.request.use(token_interceptor)
    return new Promise(async (resolve, reject) => {
        try {
            const avatarResponse = await basic_axios.get(
                "/api/user/faceImg", {
                    responseType: 'blob'
                });
            resolve(URL.createObjectURL(avatarResponse.data));
        } catch (error) {
            reject(error);
        }
    });
}

// 根据userID获取指定的用户头像
export async function getUserAvatarById(userId: string): Promise<string> {
    basic_axios.interceptors.request.use(token_interceptor)
    return new Promise(async (resolve, reject) => {
        try {
            const avatarResponse = await basic_axios.get(
                `/api/user/faceImg/${userId}`, {
                    responseType: 'blob'
                });
            resolve(URL.createObjectURL(avatarResponse.data));
        } catch (error) {
            reject(error);
        }
    });
}

// 获取全部数据
export async function getAllUsers(): Promise<userInfo[]> {
    basic_axios.interceptors.request.use(token_interceptor)
    return new Promise(async (resolve, reject) => {
        try {
            const allUsersResponse = await basic_axios.get("/api/user/all");
            resolve(allUsersResponse.data);
        } catch (error) {
            reject(error);
        }
    });
}

// 修改用户信息
export async function updateUser(userId: string, username: string, role: "user" | "admin", faceImg: File): Promise<userInfo> {
    basic_axios.interceptors.request.use(token_interceptor)
    return new Promise(async (resolve, reject) => {
        try {
            const data = new FormData();
            data.append('username', username);
            data.append('role', role);
            data.append('faceIMG', faceImg);
            const response = await basic_axios.put(`/api/user/${userId}`, data);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });
}

// 修改密码
export async function updatePassword(userId: string, old_password: string, new_password: string): Promise<userInfo> {
    basic_axios.interceptors.request.use(token_interceptor)
    return new Promise(async (resolve, reject) => {
        try {
            const data = new FormData();
            data.append('old_password', old_password);
            data.append('new_password', new_password);
            const response: AxiosResponse<userInfo> = await basic_axios.put(`/api/user/${userId}/password`, data);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });
}