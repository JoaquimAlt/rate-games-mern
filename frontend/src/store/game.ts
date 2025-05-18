import { create } from "zustand";

export interface Game {
    id: number;
    name: string;
    background_image: string;
    slug: string;
    released: string;
}

interface GameStore {
    gamesList: Game[];
    popularGames: Game[];
    isLoading: boolean;
    fetchGames: (query: string) => Promise<void>;
    fetchPopularGames: (page: string) => Promise<void>;
    clearGames: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
    gamesList: [],
    popularGames: [],
    isLoading: false,
    fetchGames: async (query: string) => {
        if (!query || query.length < 2) return;

        set({ isLoading: true });

        try {
            const res = await fetch(
                `https://api.rawg.io/api/games?search=${query}&key=f48ca301d7374b368bb4628d33a7b682`
            );

            const data = await res.json();

            set({gamesList: data.results, isLoading: false});

        } catch (error) {
            console.error("Error fetching games:", error);
            set({ gamesList: [], isLoading: false });
        }
    },
    fetchPopularGames: async (page: string) => {
        set({ isLoading: true });

        try {
            const res = await fetch(
                `https://api.rawg.io/api/games?key=f48ca301d7374b368bb4628d33a7b682&page=${page}&page_size=8&ordering=-metacritic`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );

            const data = await res.json();

            set({popularGames: data.results, isLoading: false});

        } catch (error) {
            console.error("Error fetching games:", error);
            set({ popularGames: [], isLoading: false });
        }
    },
    clearGames: () => {
        set({ gamesList: [] })
    },
}))