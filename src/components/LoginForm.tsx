import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { LoginFormProps } from "../interfaces/auth.interface";

// ====== CONFIGURACIÓN DEL BLOQUEO ======
const MAX_ATTEMPTS = 3;      // intentos permitidos antes de bloquear
const LOCK_SECONDS = 30;     // segundos de espera tras el bloqueo
// =======================================

export default function LoginForm({
    onLogin,
    loading = false,
    error = ""
}: LoginFormProps) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Mostrar/ocultar contraseña
    const [showPassword, setShowPassword] = useState(false);

    // Errores específicos
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Anti doble clic: estado (visual) + ref (sincrónico)
    const [submitting, setSubmitting] = useState(false);
    const isSubmittingRef = useRef(false);

    // Bloqueo por intentos fallidos
    const attemptsRef = useRef(0);
    const [lockedUntil, setLockedUntil] = useState<number | null>(null);
    const [secondsLeft, setSecondsLeft] = useState(0);

    const isLocked = lockedUntil !== null;
    const isBusy = loading || submitting;

    // Cuenta regresiva mientras esté bloqueado
    useEffect(() => {
        if (lockedUntil === null) return;

        const tick = () => {
            const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);

            if (remaining <= 0) {
                // Termina el bloqueo y se reinician los intentos
                setLockedUntil(null);
                setSecondsLeft(0);
                attemptsRef.current = 0;
            } else {
                setSecondsLeft(remaining);
            }
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [lockedUntil]);

    const validateUsername = (value: string) => {
        if (!value.trim()) {
            return "El usuario o correo no puede estar vacío.";
        }
        return "";
    };

    const validatePassword = (value: string) => {
        if (!value.trim()) {
            return "La contraseña no puede estar vacía.";
        }
        if (value.length < 6) {
            return "La contraseña debe tener al menos 6 caracteres.";
        }
        return "";
    };

    // Limpiar errores al escribir
    const handleUsernameChange = (text: string) => {
        setUsername(text);
        if (usernameError) setUsernameError("");
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        if (passwordError) setPasswordError("");
    };

    const handleLogin = async () => {
        // Candados: doble clic, carga del padre o bloqueo activo
        if (isSubmittingRef.current || loading || isLocked) {
            return;
        }

        const uError = validateUsername(username);
        const pError = validatePassword(password);

        setUsernameError(uError);
        setPasswordError(pError);

        if (uError || pError) {
            return;
        }

        isSubmittingRef.current = true;
        setSubmitting(true);
        attemptsRef.current += 1; // cuenta este intento

        try {
            await onLogin(username, password);
        } catch (e) {
            // El error lo maneja el padre (prop "error")
        } finally {
            isSubmittingRef.current = false;
            setSubmitting(false);

            // Si llegó al máximo y no inició sesión, se bloquea el botón
            if (attemptsRef.current >= MAX_ATTEMPTS) {
                setLockedUntil(Date.now() + LOCK_SECONDS * 1000);
            }
        }
    };

    const disabled = isBusy || isLocked;

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Iniciar sesión
            </Text>

            {/* Campo Usuario */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, !!usernameError && styles.inputError]}
                    placeholder="Usuario o correo"
                    placeholderTextColor="#a0a0a0"
                    value={username}
                    onChangeText={handleUsernameChange}
                    autoCapitalize="none"
                    editable={!disabled}
                />
                {!!usernameError && (
                    <Text style={styles.fieldError}>{usernameError}</Text>
                )}
            </View>

            {/* Campo Contraseña */}
            <View style={styles.inputContainer}>
                <View style={[styles.passwordWrapper, !!passwordError && styles.inputError]}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Contraseña"
                        placeholderTextColor="#a0a0a0"
                        value={password}
                        onChangeText={handlePasswordChange}
                        secureTextEntry={!showPassword}
                        editable={!disabled}
                    />
                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => setShowPassword(!showPassword)}
                        disabled={disabled}
                    >
                        <Text style={styles.toggleText}>
                            {showPassword ? "Ocultar" : "Mostrar"}
                        </Text>
                    </TouchableOpacity>
                </View>
                {!!passwordError && (
                    <Text style={styles.fieldError}>{passwordError}</Text>
                )}
            </View>

            {/* Error del servidor */}
            {!!error && !isLocked && (
                <Text style={styles.error}>
                    {error}
                </Text>
            )}

            {/* Aviso de bloqueo */}
            {isLocked && (
                <Text style={styles.error}>
                    Demasiados intentos. Intenta de nuevo en {secondsLeft} s.
                </Text>
            )}

            {/* Botón de login */}
            <TouchableOpacity
                style={[styles.button, disabled && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={disabled}
                activeOpacity={disabled ? 1 : 0.7}
            >
                {isBusy ? (
                    <ActivityIndicator color="#ffffff" />
                ) : isLocked ? (
                    <Text style={styles.buttonText}>Espera {secondsLeft} s</Text>
                ) : (
                    <Text style={styles.buttonText}>Iniciar sesión</Text>
                )}
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
        color: "#ffffff",
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: "#444",
        backgroundColor: "#1e1e1e",
        color: "#ffffff",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    passwordWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#444",
        backgroundColor: "#1e1e1e",
        borderRadius: 8,
    },
    passwordInput: {
        flex: 1,
        padding: 12,
        color: "#ffffff",
        fontSize: 16,
    },
    toggleButton: {
        paddingHorizontal: 15,
        justifyContent: "center",
    },
    toggleText: {
        color: "#007AFF",
        fontSize: 14,
        fontWeight: "600",
    },
    inputError: {
        borderColor: "#e74c3c",
    },
    fieldError: {
        color: "#e74c3c",
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    error: {
        color: "#e74c3c",
        marginBottom: 15,
        textAlign: "center",
        fontSize: 14,
    },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: "#555",
        opacity: 0.7,
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },
});