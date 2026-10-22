import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { LoginRequest, LoginResponse, UserProfile } from "../interfaces/auth.interface";

// 🔹 Dirección base agregando la ruta de Express (/api)
const API_URL = Platform.OS === "web" 
    ? "http://localhost:3000/api" 
    : "http://10.0.2.2:3000/api";

export const loginService = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Credenciales inválidas",
      };
    }

    const token = result.accessToken ?? result.token;

    return {
      success: true,
      message: "Inicio de sesión exitoso",
      token,
      accessToken: token,
      refreshToken: result.refreshToken,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error de conexión con el servidor",
    };
  }
};

export const getMeService = async (): Promise<UserProfile | null> => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) return null;

    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: UserProfile = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getMeService:", error);
    return null;
  }
};

export const logoutService = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    if (token) {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error("Error al revocar sesión en el servidor:", error);
  } finally {
    await AsyncStorage.removeItem("userToken");
  }
  return true;
};