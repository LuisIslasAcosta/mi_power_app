import {
    StyleSheet,
    View
} from "react-native";

import { useRouter } from "expo-router";
import LoginForm from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";
import { LoginRequest } from "../interfaces/auth.interface";

export default function LoginScreen() {

    const router = useRouter();

    const {
        login,
        loading,
        error
    } = useLogin();

    const handleLogin = async (
        data: LoginRequest
    ) => {

        const success = await login(data);

        if (success) {
            router.replace("/home");
        }
    };

    return (
        <View style={styles.container}>

            <LoginForm
                onLogin={(
                    email,
                    password
                ) =>
                    handleLogin({
                        email,
                        password
                    })
                }
                loading={loading}
                error={error}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
});