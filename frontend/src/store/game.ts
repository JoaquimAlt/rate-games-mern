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
    ratings: { id: number, count: number, percent: number }[]
    ratings_count: number
}

interface GameStore {
    gameId: string;
    game: Game | null;
    gamesList: Game[];
    popularGames: Game[];
    isLoading: boolean;
    fetchGames: (query: string) => Promise<void>;
    fetchGame: (id: string) => Promise<void>;
    fetchPopularGames: (page: string) => Promise<void>;
    setGameId: (gameId: string) => void;
    clearGames: () => void;
}

const KEY_RAWG = import.meta.env.VITE_KEY_RAWG;

export const useGameStore = create<GameStore>((set) => ({
    gameId: "",
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

            set({ gamesList: res.data.results, isLoading: false });

        } catch (error) {
            console.error("Error fetching games:", error);
            set({ gamesList: [], isLoading: false });
        }
    },
    fetchPopularGames: async (page: string) => {
        set({ isLoading: true });

        try {
            const res = await axios.get(
                `https://api.rawg.io/api/games?key=${KEY_RAWG}&page=${page}&page_size=4&ordering=-metacritic`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );

            set({ popularGames: res.data.results, isLoading: false });

        } catch (error) {
            console.error("Error fetching games:", error);
            set({ popularGames: [], isLoading: false });
        }
    },
    fetchGame: async (id: string) => {
        if (!id) return;

        set((state) => {
            if (state.game && state.game.id.toString() === id) {
                return {}; // Já temos o jogo carregado, não faz nada
            }
            return { isLoading: true };
        });

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
    setGameId: (gameId: string) => {
        set({ gameId: gameId });
    },
    clearGames: () => {
        set({ gamesList: [], game: null })
    },
}))