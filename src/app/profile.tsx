import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { UserProfile } from "../interfaces/auth.interface";
import { getMeService } from "../services/auth.service";

type DecodedTokenPayload = Partial<UserProfile> & {
    sub?: string;
    email?: string;
    nombre?: string;
    apellido?: string;
    kind?: string;
};

const decodeJwtPayload = (token: string): DecodedTokenPayload | null => {
    try {
        const parts = token.split(".");
        if (parts.length < 2) return null;

        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
        const binary = atob(padded);
        const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
        const json = new TextDecoder().decode(bytes);

        return JSON.parse(json) as DecodedTokenPayload;
    } catch (error) {
        return null;
    }
};

export default function ProfileScreen() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            try {
                const me = await getMeService();

                if (me && active) {
                    setProfile(me);
                    return;
                }

                const token = await AsyncStorage.getItem("userToken");
                if (!token) {
                    if (active) setProfile(null);
                    return;
                }

                const payload = decodeJwtPayload(token);
                if (!payload || !payload.email) {
                    if (active) setProfile(null);
                    return;
                }

                if (active) {
                    setProfile({
                        id: Number(payload.id ?? payload.sub ?? 0),
                        email: payload.email,
                        nombre: payload.nombre,
                        apellido: payload.apellido,
                        kind: payload.kind === "student" ? "student" : "user",
                    });
                }
            } catch (error) {
                if (active) setProfile(null);
            } finally {
                if (active) setLoading(false);
            }
        };

        loadProfile();

        return () => {
            active = false;
        };
    }, []);

    const displayName = profile?.nombre
        ? `${profile.nombre}${profile.apellido ? ` ${profile.apellido}` : ""}`
        : profile?.email?.split("@")[0] || "Usuario";

    const initials = displayName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("") || "U";

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.back}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4dabf7" />
                    <Text style={styles.loadingText}>Cargando perfil...</Text>
                </View>
            ) : !profile ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No hay una sesión activa.</Text>
                </View>
            ) : (
                <>
                    <View style={styles.profile}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{initials}</Text>
                        </View>

                        <Text style={styles.name}>{displayName}</Text>
                        <Text style={styles.email}>{profile.email}</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.label}>Nombre</Text>
                        <Text style={styles.value}>{displayName}</Text>

                        <Text style={styles.label}>Correo</Text>
                        <Text style={styles.value}>{profile.email}</Text>

                        
                    </View>
                </>
            )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        color: "#dfe3e8",
        marginTop: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        color: "#ffffff",
        fontSize: 16,
    },
    profile: {
        alignItems: "center",
        marginBottom: 30,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#ffffff",
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        color: "#a0a0a0",
    },
    card: {
        backgroundColor: "#1e1e1e",
        borderRadius: 14,
        padding: 18,
        borderWidth: 1,
        borderColor: "#2f2f2f",
    },
    label: {
        fontSize: 13,
        color: "#8ab4f8",
        marginTop: 10,
        marginBottom: 4,
        fontWeight: "600",
    },
    value: {
        fontSize: 17,
        color: "#ffffff",
        marginBottom: 10,
    },
});