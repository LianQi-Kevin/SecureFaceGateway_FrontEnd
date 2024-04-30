export interface login_form {
    username: string;
    password: string;
}

export interface userInfo {
    id: number;
    username: string;
    user_id: string;
    role: "user" | "admin";
    disabled: boolean;
}

export interface dataFrameRow extends userInfo {
    avatar: string;
}