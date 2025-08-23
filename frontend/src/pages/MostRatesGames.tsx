import { Box, HStack, SimpleGrid, Skeleton, Text, VStack } from '@chakra-ui/react'
import { FaGamepad } from "react-icons/fa6";
import { useRateStore } from '../store/rate';
import { useEffect } from 'react';
import { MostRatedGameCard } from '../components/MostRatedGameCard';

export const MostRatesGames = () => {

    const { gamesMostRateds, fetchGamesMostRateds } = useRateStore();

    useEffect(() => {
        fetchGamesMostRateds();
    }, [])


    return (
        <VStack gap={5}>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} gap={6}>
                <Text
                    fontSize={30}
                    fontWeight={"bold"}
                    bgGradient={"linear(to-r, red.500, red)"}
                    bgClip={"text"}
                >
                    Mais avaliados do
                </Text>
                <HStack>
                    <Text fontSize={30} fontWeight={"bold"}>RateGames</Text>
                    <FaGamepad color="red" size={30} />
                </HStack>
            </Box>

            <SimpleGrid
                columns={{
                    base: 1,
                    md: 2,
                    lg: 4
                }}
                spacing={8}
                w={"full"}
            >
                {gamesMostRateds.length > 0 ?
                    gamesMostRateds.map((game) => (
                        <MostRatedGameCard key={game._id} game={game} />
                    ))
                    :
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} w={300} h={280} borderRadius={5} />
                    ))
                }
            </SimpleGrid>

        </VStack>
    )
}
