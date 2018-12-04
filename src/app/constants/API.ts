const API_URL = 'http://localhost:3000';
export const API = {
    login: `${API_URL}/auth/login`,
    logout: `${API_URL}/auth/logout`,
    refresh: `${API_URL}/auth/refreshToken`,
};

export const WEBSOCKET_URL = 'ws://localhost:3010';
