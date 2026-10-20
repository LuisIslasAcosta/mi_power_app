import { useRouter } from "expo-router";
import { logoutService } from "../services/auth.service";

export const useLogout = () => {
    const router = useRouter();

    const logout = async () => {
        await logoutService();
        router.replace("/");
    };

    return {
        logout,
    };
};