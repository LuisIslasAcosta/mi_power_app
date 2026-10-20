import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import SideMenu from "../components/SideMenu";

const API_URL = Platform.OS === "web" 
    ? "http://localhost:3000/api" 
    : "http://10.0.2.2:3000/api";

interface UserProfile {
    id: number;
    nombre?: string;
    apellido?: string;
    matricula?: string;
    email: string;
    kind: "student" | "user";
}

export default function HomeScreen() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchMyData = async () => {
        try {
            setLoading(true);
            setError("");

            const token = await AsyncStorage.getItem("userToken");

            if (!token) {
                setError("No se proporcionó un token de autenticación.");
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_URL}/auth/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Error al obtener perfil");
            }

            const data: UserProfile = await response.json();
            setUser(data);
        } catch (err: any) {
            setError(err.message || "Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyData();
    }, []);

    const displayName = user?.nombre ? `${user.nombre} 👋` : user?.email ? `${user.email} 👋` : "Usuario 👋";

    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <TouchableOpacity onPress={() => setMenuOpen(true)}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>

                <Text style={styles.greeting}>
                    {loading ? "Cargando..." : `Hola, ${displayName}`}
                </Text>

                <Text style={styles.profile}>👤</Text>

            </View>

            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator size="large" color="#007AFF" />
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchMyData}>
                            <Text style={styles.retryText}>Reintentar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.card}>
                        <Text style={styles.title}>¡Bienvenid@!</Text>

                        {user?.nombre && (
                            <Text style={styles.infoText}>
                                <Text style={styles.bold}>Nombre:</Text> {user.nombre} {user.apellido}
                            </Text>
                        )}

                        {user?.matricula && (
                            <Text style={styles.infoText}>
                                <Text style={styles.bold}>Matrícula:</Text> {user.matricula}
                            </Text>
                        )}

                        <Text style={styles.infoText}>
                            <Text style={styles.bold}>Correo:</Text> {user?.email}
                        </Text>
                    </View>
                )}
            </View>

            <SideMenu
                visible={menuOpen}
                onClose={() => setMenuOpen(false)}
            />

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
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
    },
    menuIcon: {
        fontSize: 24,
        color: "#ffffff",
    },
    greeting: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
    },
    profile: {
        fontSize: 22,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: "100%",
        maxWidth: 500,
        backgroundColor: "#1e1e1e",
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#333",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 15,
        textAlign: "center",
    },
    infoText: {
        fontSize: 16,
        color: "#cccccc",
        marginBottom: 10,
    },
    bold: {
        fontWeight: "bold",
        color: "#ffffff",
    },
    errorContainer: {
        alignItems: "center",
    },
    errorText: {
        color: "#e74c3c",
        fontSize: 16,
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    retryText: {
        color: "#ffffff",
        fontWeight: "bold",
    },
});