import { create } from "zustand";
import type IUser from "../types/User";
import { useRateStore } from "./rate";

interface UserStore {
    user: IUser | null;
    token: string | null;
    fetchUser: () => Promise<void>;
    login: (email: string, password: string) => Promise<{ success: boolean; msg: string }>;
    register: (username: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; msg: string }>;
    logout: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    token: localStorage.getItem("token"),
    fetchUser: async () => {
        const token = localStorage.getItem("token");
        await getUser(set, token!);
    },
    login: async (email: string, password: string) => {
        const res = await fetch(`${API_URL}/api/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("token", data.token);
            set({ token: data.token });
            await getUser(set, data.token);
            return { success: true, msg: "Login realizado com sucesso!" };
        }

        return { success: false, msg: data.msg };
    },
    register: async (username: string, email: string, password: string, confirmPassword: string) => {
        const res = await fetch(`${API_URL}/api/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password, confirmPassword }),
        });
            
        const data = await res.json();
        if(res.ok){
            localStorage.setItem("token", data.token)
            set({token: data.token});
            await getUser(set, data.token);
            return {success: true, msg: data.msg};
        }

        return {success: false, msg: data.msg};
    },
    logout: () => {
        localStorage.removeItem("token");
        set({user: null, token: ""});
        useRateStore.getState().setRates([]);
    },

}));

const getUser = async (set: any, token: string) => {
  try {
    const res = await fetch(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      set({ user: data });
      console.log("User data:", data);
    } else {
      set({ user: null });
    }
  } catch {
    set({ user: null });
  }
};