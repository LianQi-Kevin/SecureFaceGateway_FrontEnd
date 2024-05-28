import basic_axios from "@/network/basic";
import {AxiosResponse} from "axios";
import type {userInfo} from "@/types/user";
import {token_interceptor} from "@/network/interceptor";



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

// 使用user_id获取用户信息
export async function getUserById(userId: string): Promise<userInfo> {
    basic_axios.interceptors.request.use(token_interceptor)
    return new Promise(async (resolve, reject) => {
        try {
            const userResponse = await basic_axios.get(`/api/user/${userId}`);
            resolve(userResponse.data);
        } catch (error) {
            reject(error);
        }
    });
}