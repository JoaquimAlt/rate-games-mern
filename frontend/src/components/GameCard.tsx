import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useGameStore, type Game } from '../store/game';
import { useNavigate } from "react-router-dom";
import ReactStars from "react-stars";

interface Props {
    game: Game;
}

const GameCard = ({ game }: Props) => {

    const navigate = useNavigate();

    const { setGameId } = useGameStore();

    const handleSelect = (gameId: number) => {
        setGameId(gameId.toString());
        navigate("/create");
    };


    return (
        <VStack>
            <Box
                w={300}
                h={260}
                color="white"
                bgImage={`linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3)), url(${game.background_image})`}
                bgSize="cover"
                bgPosition="center"
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
                gap={4}
                onClick={() => handleSelect(game.id)}
                borderRadius={5}
                cursor="pointer
            >
                <VStack alignItems={"flex-start"} p={5}>
                    <Text
                        fontWeight={"bold"}
                        noOfLines={2}
                    >
                        {game.name}
                    </Text>
                    <HStack>
                        <ReactStars
                            value={game.rating}
                            color2='red'
                            size={20}
                            edit={false}
                        />
                        <Text fontSize={12}>({game.ratings_count})</Text>
                    </HStack>
                    <Text fontSize={12} color={"gray.400"}>{game.released}</Text>
                </VStack>
            </Box>
        </VStack>
    )
}

export default GameCard
