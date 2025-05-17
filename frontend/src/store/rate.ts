import { create } from "zustand";
import type IRate from "../types/Rate";
import { useUserStore } from "./user";

interface RateStore {
    rates: IRate[];
    setRates: (rates: IRate[]) => void;
    createRate: (newRate: IRate) => Promise<{ success: boolean; msg: string }>;
    fetchRates: () => Promise<void>;
    deleteRate: (rid: string) => Promise<{ success: boolean; msg: string }>;
    updateRate: (rid: string, updatedRate: IRate) => Promise<{ success: boolean; msg: string }>;
    fetchMyRates: () => Promise<void>;
}

export const useRateStore = create<RateStore>((set) => ({
    rates: [],
    setRates: (rates) => set({ rates }),
    createRate: async (newRate: IRate) => {
        const token = useUserStore.getState().token;

        if (!newRate.game || !newRate.stars || !newRate.comment || !newRate.image) {
            return { success: false, msg: "Preencha todos os campos" };
        }

        const res = await fetch("/api/rates", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newRate),
        });

        const data = await res.json();
        set((state) => ({ rates: [...state.rates, data.data] }));

        return { success: true, msg: "Avaliação criada com sucesso" };
    },
    fetchRates: async () => {
        const token = useUserStore.getState().token;

        const res = await fetch("/api/rates", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await res.json();
        set({ rates: data.data });
    },
    deleteRate: async (rid: string) => {
        const token = useUserStore.getState().token;
        
        const res = await fetch(`/api/rates/${rid}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        const data = await res.json();
        if (!data.success) {
            return { success: false, msg: data.msg }
        }

        // update the ui without needing to refresh the page
        set((state) => ({ rates: state.rates.filter((rate) => rate._id?.toString() !== rid) }));
        return { success: true, msg: data.msg }
    },
    updateRate: async (rid: string, updatedRate: IRate) => {
        const token = useUserStore.getState().token;

        const res = await fetch(`/api/rates/${rid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedRate),
        });

        const data = await res.json();
        if (!data.success) {
            return { success: false, msg: data.msg }
        }

        // update the ui without needing to refresh the page
        set((state) => ({ rates: state.rates.map((rate) => rate._id?.toString() === rid ? data.data : rate) }));
        return { success: true, msg: data.msg }
    },
    fetchMyRates: async () => {
        const token = useUserStore.getState().token;

        const res = await fetch("/api/rates/myrates", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await res.json();
        set({ rates: data.data });
    },
}
));
