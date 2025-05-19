import { create } from "zustand";
import type IRate from "../types/Rate";
import { useUserStore } from "./user";

interface RateStore {
    rates: IRate[];
    isLoading: boolean;
    setRates: (rates: IRate[]) => void;
    createRate: (newRate: IRate) => Promise<{ success: boolean; msg: string }>;
    fetchRates: () => Promise<void>;
    deleteRate: (rid: string) => Promise<{ success: boolean; msg: string }>;
    updateRate: (rid: string, updatedRate: IRate) => Promise<{ success: boolean; msg: string }>;
    fetchMyRates: (order: string) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useRateStore = create<RateStore>((set) => ({
    rates: [],
    isLoading: false,
    setRates: (rates) => set({ rates }),
    createRate: async (newRate: IRate) => {
        const token = useUserStore.getState().token;
        set({isLoading: true});

        if (!newRate.game || !newRate.stars || !newRate.comment || !newRate.image) {
            set({isLoading: false});
            return { success: false, msg: "Preencha todos os campos" };
        }

        const res = await fetch(`${API_URL}/api/rates`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newRate),
        });

        const data = await res.json();
        set((state) => ({ rates: [...state.rates, data.data] }));
        set({isLoading: false});
        return { success: data.success, msg: data.msg };
    },
    fetchRates: async () => {
        const token = useUserStore.getState().token;
        set({isLoading: true});

        const res = await fetch(`${API_URL}/api/rates`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await res.json();
        set({ rates: data.data, isLoading: false });
    },
    deleteRate: async (rid: string) => {
        const token = useUserStore.getState().token;
        set({isLoading: true});
        
        const res = await fetch(`${API_URL}/api/rates/${rid}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        const data = await res.json();
        if (!data.success) {
            set({isLoading: false});
            return { success: false, msg: data.msg }
        }

        // update the ui without needing to refresh the page
        set((state) => ({ rates: state.rates.filter((rate) => rate._id?.toString() !== rid), isLoading: false }));
        return { success: true, msg: data.msg }
    },
    updateRate: async (rid: string, updatedRate: IRate) => {
        const token = useUserStore.getState().token;
        set({isLoading: true});

        const res = await fetch(`${API_URL}/api/rates/${rid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedRate),
        });

        const data = await res.json();
        if (!data.success) {
            set({isLoading: false});
            return { success: false, msg: data.msg }
        }

        // update the ui without needing to refresh the page
        set((state) => ({ rates: state.rates.map((rate) => rate._id?.toString() === rid ? data.data : rate), isLoading: false }));
        return { success: true, msg: data.msg }
    },
    fetchMyRates: async (order: string = "recentes") => {
        const token = useUserStore.getState().token;
        set({isLoading: true});

        const res = await fetch(`${API_URL}/api/rates/myrates?order=${order}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await res.json();
        set({ rates: data.data, isLoading: false});
    },
}
));
