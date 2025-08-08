import { create } from "zustand";
import type IUser from "../types/User";
import { useRateStore } from "./rate";
import axios from "axios";

interface UserStore {
    user: IUser | null;
    emailOTP: string | null;
    isLoading: boolean;
    token: string | null;
    fetchUser: () => Promise<void>;
    login: (email: string, password: string) => Promise<{ success: boolean; msg: string }>;
    register: (username: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; msg: string }>;
    sendEmail: (email: string) => Promise<{success: boolean; msg: string}>;
    verifyOTP: (email: string, otp: string) => Promise<{success: boolean; msg: string}>;
    changePassword: (email: string, newPassword: string) => Promise<{success: boolean; msg: string}>;
    logout: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    emailOTP: null,
    isLoading: false,
    token: localStorage.getItem("token"),
    fetchUser: async () => {
        set({isLoading: true});
        const token = localStorage.getItem("token");
        await getUser(set, token!);
        set({isLoading: false});
    },
    login: async (email: string, password: string) => {
        set({isLoading: true});
        try {
            const res = await axios.post(`${API_URL}/api/users/login`, { email, password }, {
                headers: { "Content-Type": "application/json" }
            });
            localStorage.setItem("token", res.data.token);
            set({ token: res.data.token });
            await getUser(set, res.data.token);
            set({isLoading: false});
            return { success: true, msg: "Login realizado com sucesso!" };
        } catch (error: any) {
            set({isLoading: false});
            return { success: false, msg: error.response?.data?.msg || "Erro ao fazer login." };
        }
    },
    register: async (username: string, email: string, password: string, confirmPassword: string) => {
        set({isLoading: true});
        try {
            const res = await axios.post(`${API_URL}/api/users/register`, { username, email, password, confirmPassword }, {
                headers: { "Content-Type": "application/json" }
            });
            localStorage.setItem("token", res.data.token);
            set({token: res.data.token});
            await getUser(set, res.data.token);
            set({isLoading: false});
            return {success: true, msg: res.data.msg};
        } catch (error: any) {
            set({isLoading: false});
            return {success: false, msg: error.response?.data?.msg || "Erro ao registrar."};
        }
    },
    sendEmail: async (email: string) => {
      set({isLoading: true});

      try {
        const res = await axios.get(`${API_URL}/api/otp/send`, {
          params: { email }
        });
        
        set({isLoading: false});
        return {success: res.data.success, msg: res.data.msg};
        
      } catch (error: any) {
        set({isLoading: false});
        return {success: false, msg: `Erro: ${error.response?.data?.msg}`};
      }
    },
    verifyOTP: async (email: string, otp: string) => {
      set({isLoading: true});

      try {
        const res = await axios.get(`${API_URL}/api/otp/verify`, {
          params: { email, otp }
        });
        
        set({isLoading: false});
        return {success: res.data.success, msg: res.data.msg};
        
      } catch (error: any) {
        set({isLoading: false});
        return {success: false, msg: `Erro: ${error.response?.data?.msg}`};
      }
    },
    changePassword: async (email: string, newPassword: string) => {
      set({isLoading: true});

      try {
        const res = await axios.put(`${API_URL}/api/users/change-password`, { email, newPassword });
        set({isLoading: false});
        return {success: res.data.success, msg: res.data.msg};

      } catch (error: any) {
        set({isLoading: false});
        return {success: false, msg: `Erro: ${error.response?.data?.msg}`};
      }
    },
    logout: () => {
        localStorage.removeItem("token");
        set({user: null, token: "", isLoading: false});
        useRateStore.getState().setRates([]);
    },

}));

const getUser = async (set: any, token: string) => {
  if (!token) {
    localStorage.removeItem("token");
    set({ user: null, token: "" });
    return;
  }
  try {
    const res = await axios.get(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 200) {
      set({ user: res.data });
    } else {
      localStorage.removeItem("token");
      set({ user: null, token: "" });
    }
  } catch {
    localStorage.removeItem("token");
    set({ user: null, token: "" });
  }
};