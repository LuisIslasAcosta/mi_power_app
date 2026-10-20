import { useRouter } from "expo-router";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useLogout } from "../hooks/useLogout";

interface SideMenuProps {
    visible: boolean;
    onClose: () => void;
}

export default function SideMenu({ visible, onClose }: SideMenuProps) {
    const { logout } = useLogout();
    const router = useRouter();

    const handleLogoutPress = async () => {
        onClose();
        await logout();
    };

    const handleProfilePress = () => {
        onClose();
        router.push("/profile");
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.menuContainer}>
                            <Text style={styles.menuTitle}>Menú</Text>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={onClose}
                            >
                                <Text style={styles.menuText}>Inicio</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={handleProfilePress}
                            >
                                <Text style={styles.menuText}>Mi Perfil</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.menuItem, styles.logoutButton]}
                                onPress={handleLogoutPress}
                            >
                                <Text style={styles.logoutText}>Cerrar Sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        flexDirection: "row",
    },
    menuContainer: {
        width: 250,
        backgroundColor: "#1e1e1e",
        height: "100%",
        padding: 20,
        justifyContent: "flex-start",
    },
    menuTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 20,
    },
    menuItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#333333",
    },
    menuText: {
        fontSize: 16,
        color: "#ffffff",
    },
    logoutButton: {
        marginTop: "auto",
        borderBottomWidth: 0,
    },
    logoutText: {
        fontSize: 16,
        color: "#e74c3c",
        fontWeight: "bold",
    },
});