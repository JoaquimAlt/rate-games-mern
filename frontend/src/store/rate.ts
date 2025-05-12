import { create } from "zustand";
import type IRate from "../types/Rate";

interface RateStore {
    rates: IRate[];
    setRates: (rates: IRate[]) => void;
    createRate: (newRate: IRate) => Promise<{ success: boolean; msg: string }>;
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
    }
}
));
