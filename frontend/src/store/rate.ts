import { create } from "zustand";
import type IRate from "../types/Rate";

interface RateStore {
    rates: IRate[];
    setRates: (rates: IRate[]) => void;
    createRate: (newRate: IRate) => Promise<{ success: boolean; msg: string }>;
    fetchRates: () => Promise<void>;
    deleteRate: (rid: string) => Promise<{ success: boolean; msg: string }>;
    updateRate: (rid: string, updatedRate: IRate) => Promise<{ success: boolean; msg: string }>;
}

export const useRateStore = create<RateStore>((set) => ({
    rates: [],
    setRates: (rates) => set({ rates }),
    createRate: async (newRate: IRate) => {
    if (!newRate.game || !newRate.stars || !newRate.comment || !newRate.image) {
        return { success: false, msg: "Preencha todos os campos" };
    }

    const res = await fetch("/api/rates/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newRate),
    });

    const data = await res.json();
    set((state) => ({rates:[...state.rates, data.data]}));

    return { success: true, msg: "Avaliação criada com sucesso" };
    },
    fetchRates: async () => {
        const res = await fetch("/api/rates/");
        const data = await res.json();
        set({ rates: data.data });
    },
    deleteRate: async (rid: string) => {
        const res = await fetch(`/api/rates/${rid}`, {
            method: "DELETE"
        });

        const data = await res.json();
        if(!data.success) {
            return { success: false, msg: data.msg }
        }

        // update the ui without needing to refresh the page
        set((state) => ({ rates: state.rates.filter((rate) => rate._id?.toString() !== rid) }));
        return { success: true, msg: data.msg }
    },
    updateRate: async (rid: string, updatedRate: IRate) => {
        const res = await fetch(`/api/rates/${rid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedRate),
        });

        const data = await res.json();
        if(!data.success) {
            return { success: false, msg: data.msg }
        }

        // update the ui without needing to refresh the page
        set((state) => ({ rates: state.rates.map((rate) => rate._id?.toString() === rid ? data.data : rate) }));
        return { success: true, msg: data.msg }
    }
}
));
