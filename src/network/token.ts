import basic_axios from "@/network/basic";
import { useStorage } from '@vueuse/core'

interface TokenResponse {
    access_token: string;
    token_type: string;
}

export async function getAccessToken(username: string, password: string): Promise<TokenResponse> {
  try {
    const data = new FormData();
    data.append('username', username);
    data.append('password', password);
    data.append('grant_type', 'password');

    const response = await basic_axios.post('/api/token', data, {
      headers: {
        'Content-Type': 'x-www-form-urlencoded',
      },
    });

    // 写入sessionStorage
    useStorage('access_token', response.data.access_token);

    return response.data.access_token

  } catch (error) {
    console.error(error);
    throw error;
  }
}

