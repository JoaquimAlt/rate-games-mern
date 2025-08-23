import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import type IGameMostRated from '../types/GamesMostRateds'
import ReactStars from 'react-stars';
import { useGameStore } from '../store/game';
import { useNavigate } from 'react-router-dom';

interface Props {
    game: IGameMostRated
}

export const MostRatedGameCard = ({ game }: Props) => {

    const navigate = useNavigate();

    const { setGameId } = useGameStore();

    const handleSelect = (gameId: string) => {
        setGameId(gameId);
        navigate("/create");
    };

    return (
        <VStack>
            <Box
                w={300}
                h={260}
                color="white"
                bgImage={`linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3)), url(${game.image})`}
                bgSize="cover"
                bgPosition="center"
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
                gap={4}
                borderRadius={5}
                onClick={() => handleSelect(game._id)}
                cursor={"pointer"}
            >
                <VStack alignItems={"flex-start"} p={5}>
                    <Text
                        fontWeight={"bold"}
                        noOfLines={2}
                    >
                        {game.game}
                    </Text>
                    <HStack>
                        <ReactStars
                            value={game.stars}
                            color2='red'
                            size={20}
                            edit={false}
                        />
                        <Text fontSize={12}>({game.count})</Text>
                    </HStack>
                </VStack>
            </Box>
        </VStack>
    )
}
