import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { LoginRequest } from "../interfaces/auth.interface";
import { loginService } from "../services/auth.service";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (data: LoginRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError("");

      const response = await loginService(data);

      if (!response.success) {
        setError(response.message);
        return false;
      }

      if (response.token) {
        await AsyncStorage.setItem("userToken", response.token);
        return true;
      } else {
        setError("El servidor no proporcionó un token válido.");
        return false;
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
};