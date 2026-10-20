import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function SettingsScreen() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
           
            await AsyncStorage.multiRemove(["token", "user"]);
        } catch (e) {
            console.error("Error al cerrar sesión", e);
        } finally {
            router.replace("/"); 
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.back}>←</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Configuración</Text>
            </View>

            <View style={styles.options}>
                <Text style={styles.optionText}>ⓘ  Información de la app</Text>
                <Text style={styles.optionText}>⚙  Preferencias</Text>
                <Text style={styles.optionText}>🔔  Notificaciones</Text>
                <Text style={styles.optionText}>🔒  Privacidad</Text>
                <Text style={styles.optionText}>❓  Ayuda y soporte</Text>
            </View>

            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                <Text style={styles.logoutText}>🚪  Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
    },
    back: {
        fontSize: 24,
        color: "#ffffff",
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#ffffff",
    },
    options: {
        gap: 15,
        marginBottom: 40,
    },
    optionText: {
        fontSize: 16,
        color: "#ffffff",
    },
    logout: {
        backgroundColor: "#e74c3c",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    logoutText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },
});