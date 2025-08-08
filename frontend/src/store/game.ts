import { create } from "zustand";
import axios from "axios";

export interface Game {
    id: number;
    name: string;
    background_image: string;
    background_image_additional: string;
    slug: string;
    released: string;
    description_raw: string;
    genres: { id: number; name: string }[];
    rating: number,
    ratings: {id: number, count: number, percent: number} []
}

interface GameStore {
    game: Game | null;
    gamesList: Game[];
    popularGames: Game[];
    isLoading: boolean;
    fetchGames: (query: string) => Promise<void>;
    fetchGame: (id: string) => Promise<void>;
    fetchPopularGames: (page: string) => Promise<void>;
    clearGames: () => void;
}

const KEY_RAWG = import.meta.env.VITE_KEY_RAWG;

export const useGameStore = create<GameStore>((set) => ({
    game: null,
    gamesList: [],
    popularGames: [],
    isLoading: false,
    fetchGames: async (query: string) => {
        if (!query || query.length < 2) return;

        set({ isLoading: true });

        try {
            const res = await axios.get(
                `https://api.rawg.io/api/games?search=${query}&key=${KEY_RAWG}`
            );

            set({gamesList: res.data.results, isLoading: false});

        } catch (error) {
            console.error("Error fetching games:", error);
            set({ gamesList: [], isLoading: false });
        }
    },
    fetchPopularGames: async (page: string) => {
        set({ isLoading: true });

        try {
            const res = await axios.get(
                `https://api.rawg.io/api/games?key=${KEY_RAWG}&page=${page}&page_size=8&ordering=-metacritic`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );

            set({popularGames: res.data.results, isLoading: false});

        } catch (error) {
            console.error("Error fetching games:", error);
            set({ popularGames: [], isLoading: false });
        }
    },
    fetchGame: async (id: string) => {
        set({isLoading: true});

        try {
            const res = await axios.get(
                `https://api.rawg.io/api/games/${id}?key=${KEY_RAWG}`
            );

            set({ game: res.data, isLoading: false });

        } catch (error) {
            console.error("Error fetching game:", error);
            set({ game: null, isLoading: false });
        }
    },
    clearGames: () => {
        set({ gamesList: [], game: null })
    },
}))