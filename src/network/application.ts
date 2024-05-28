import basic_axios from "@/network/basic";
import {token_interceptor} from "@/network/interceptor";
import {AxiosResponse} from "axios";

export interface LeaveApplicationRequest {
    task_id: string;
    user_id: string;
    reason: string;
    start_time: number;
    end_time: number;
}

export interface LeaveApplicationResponse extends LeaveApplicationRequest{
    create_time: number;
    status: string;
    reply_manager: string;
}

// 请假申请
export async function leaveApplication(data: LeaveApplicationRequest): Promise<any> {
    basic_axios.interceptors.request.use(token_interceptor)
    return new Promise(async (resolve, reject) => {
        try {
            const formData = new FormData();
            formData.append('task_id', data.task_id);
            formData.append('user_id', data.user_id);
            formData.append('reason', data.reason);
            formData.append('start_time', data.start_time.toString());
            formData.append('end_time', data.end_time.toString());
            const response: AxiosResponse = await basic_axios.post('/api/app/leave', formData);
            console.debug(response.data);
            resolve(response.data);
        } catch (error) {
            console.error('Error applying for leave:', error);
            reject(error);
        }
    });
}

// 获取当前用户的请假申请
export async function getMyLeaveApplications(): Promise<LeaveApplicationResponse[]> {
    basic_axios.interceptors.request.use(token_interceptor)
    return new Promise(async (resolve, reject) => {
        try {
            const response: AxiosResponse = await basic_axios.get('/api/app/leave/');
            console.debug(response.data);
            resolve(response.data);
        } catch (error) {
            console.error('Error getting my leave applications:', error);
            reject(error);
        }
    });
}

// 获取全部请假申请
export async function getLeaveApplications(): Promise<LeaveApplicationResponse[]> {
    basic_axios.interceptors.request.use(token_interceptor)
    return new Promise(async (resolve, reject) => {
        try {
            const response: AxiosResponse = await basic_axios.get('/api/app/leave/all');
            console.debug(response.data);
            resolve(response.data);
        } catch (error) {
            console.error('Error getting leave applications:', error);
            reject(error);
        }
    });
}

// 根据task_id修改请假申请状态
export async function updateLeaveApplicationStatus(task_id: string, status: string): Promise<LeaveApplicationResponse> {
    basic_axios.interceptors.request.use(token_interceptor)
    return new Promise(async (resolve, reject) => {
        try {
            const formData = new FormData();
            formData.append('task_id', task_id);
            formData.append('status', status);
            const response: AxiosResponse = await basic_axios.put('/api/app/leave/', formData);
            console.debug(response.data);
            resolve(response.data);
        } catch (error) {
            console.error('Error updating leave application status:', error);
            reject(error);
        }
    });
}