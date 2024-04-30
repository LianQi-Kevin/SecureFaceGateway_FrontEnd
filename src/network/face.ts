import basic_axios from "@/network/basic";


export interface faceFindResponse {
    success: boolean;
    message: string;
    username?: string;
    role?: string;
    conf?: number;
    pose?: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
}


// api/face/detect
export async function faceFind(file: File): Promise<faceFindResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return basic_axios.post('/api/face/detect', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then((res) => {
        console.debug(res)
        return res.data as faceFindResponse;
    }).catch((err) => {
        return {
            success: false,
            message: err.response.data.message
        };
    });
}

