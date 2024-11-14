import axios from "axios";

export class AuthService {
    
    async login({userId, password, userStatus}) {
        try {
            console.log("user", userStatus);
            const response = await axios.post(`/api/v1/${userStatus}/login`, {
                userId,
                password
            });
            return response.data;
        } catch (error) {
            console.log("login error", error);
            throw error;
        }
    }

    async getCurrentUser({userStatus}) {
        try {
            const response = await axios.get(`/api/v1/${userStatus}/currentUser`);
            return response.data;
        } catch (error) {
            console.log("getCurrentUser error", error);
            throw error;
        }
    }

    async logout(user) {
        try {
            await axios.post(`/api/v1/${user}/logout`);
        } catch (error) {
            console.log("logout error", error);
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService;
