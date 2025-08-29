import { create } from "zustand";
import type IRate from "../types/Rate";
import { useUserStore } from "./user";
import axios from "axios";
import type IGameMostRated from "../types/GamesMostRateds";

interface RateStore {
    rates: IRate[];
    gamesMostRateds: IGameMostRated[],
    isLoadingRates: boolean;
    setRates: (rates: IRate[]) => void;
    createRate: (newRate: IRate) => Promise<{ success: boolean; msg: string }>;
    fetchRates: () => Promise<void>;
    deleteRate: (rid: string) => Promise<{ success: boolean; msg: string }>;
    updateRate: (rid: string, updatedRate: IRate) => Promise<{ success: boolean; msg: string }>;
    fetchMyRates: (order: string) => Promise<void>;
    fetchRateByGame: (gameId: string) => Promise<void>;
    fetchGamesMostRateds: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useRateStore = create<RateStore>((set) => ({
    rates: [],
    gamesMostRateds: [],
    isLoadingRates: false,
    setRates: (rates) => set({ rates }),
    createRate: async (newRate: IRate) => {
        const token = useUserStore.getState().token;
        set({ isLoadingRates: true });

        if (!newRate.game || !newRate.stars || !newRate.comment || !newRate.image) {
            set({ isLoadingRates: false });
            return { success: false, msg: "Preencha todos os campos" };
        }

        try {
            const res = await axios.post(
                `${API_URL}/api/rates`,
                newRate,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            set((state) => ({ rates: [...state.rates, res.data.data] }));
            set({ isLoadingRates: false });
            return { success: res.data.success, msg: res.data.msg };
        } catch (error: any) {
            set({ isLoadingRates: false });
            return { success: false, msg: error.response?.data?.msg || "Erro ao criar avaliação" };
        }
    },
    fetchRates: async () => {
        const token = useUserStore.getState().token;
        set({ isLoadingRates: true });

        try {
            const res = await axios.get(`${API_URL}/api/rates`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ rates: res.data.data, isLoadingRates: false });
        } catch {
            set({ isLoadingRates: false });
        }
    },
    deleteRate: async (rid: string) => {
        const token = useUserStore.getState().token;
        set({ isLoadingRates: true });

        try {
            const res = await axios.delete(`${API_URL}/api/rates/${rid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.data.success) {
                set({ isLoadingRates: false });
                return { success: false, msg: res.data.msg };
            }
            set((state) => ({
                rates: state.rates.filter((rate) => rate._id?.toString() !== rid),
                isLoadingRates: false,
            }));
            return { success: true, msg: res.data.msg };
        } catch (error: any) {
            set({ isLoadingRates: false });
            return { success: false, msg: error.response?.data?.msg || "Erro ao deletar avaliação" };
        }
    },
    updateRate: async (rid: string, updatedRate: IRate) => {
        const token = useUserStore.getState().token;
        set({ isLoadingRates: true });

        try {
            const res = await axios.put(
                `${API_URL}/api/rates/${rid}`,
                updatedRate,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!res.data.success) {
                set({ isLoadingRates: false });
                return { success: false, msg: res.data.msg };
            }
            set((state) => ({
                rates: state.rates.map((rate) =>
                    rate._id?.toString() === rid ? res.data.data : rate
                ),
                isLoadingRates: false,
            }));
            return { success: true, msg: res.data.msg };
        } catch (error: any) {
            set({ isLoadingRates: false });
            return { success: false, msg: error.response?.data?.msg || "Erro ao atualizar avaliação" };
        }
    },
    fetchMyRates: async (order: string = "recentes") => {
        const token = useUserStore.getState().token;
        set({ isLoadingRates: true });

        try {
            const res = await axios.get(`${API_URL}/api/rates/myrates?order=${order}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ rates: res.data.data, isLoadingRates: false });
        } catch (error) {
            console.log("Erro: " + error);
            set({ isLoadingRates: false });
        }
    },
    fetchRateByGame: async (gameId: string) => {
        const token = useUserStore.getState().token;

        set({ isLoadingRates: true });

        try {
            const res = await axios.get(`${API_URL}/api/rates/game`,
                {
                    params: {
                        gameId
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const fetchedRates = Array.isArray(res.data.data) ? res.data.data : [];

            set({ rates: fetchedRates, isLoadingRates: false });
        } catch (error) {
            console.log("Erro: " + error);
            set({ rates: [], isLoadingRates: false });
        }
    },
    fetchGamesMostRateds: async () => {
        set({isLoadingRates: true});

        try {
            const res = await axios.get(`${API_URL}/api/rates/games-most-rateds`);

            set({gamesMostRateds: res.data.data, isLoadingRates: false})
            
        } catch (error) {
            set({isLoadingRates: false});
        }
    }
}));