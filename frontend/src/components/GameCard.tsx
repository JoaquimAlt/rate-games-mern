import { Box, Button, Image, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import { useGameStore, type Game } from '../store/game';
import { useNavigate } from "react-router-dom";
import { CgAddR } from "react-icons/cg";
import NotImage from "../assets/not-image.png";

interface Props {
    game: Game;
}

const GameCard = ({ game }: Props) => {

    const navigate = useNavigate();

    const { fetchGame } = useGameStore();

    const handleSelect = async (gameId: number) => {
        await fetchGame(gameId.toString());
        navigate("/create");
    };

    const bgColor = useColorModeValue("white", "gray.800");

    return (
        <Box
            position={"relative"}
            key={game.id}
            display={"flex"}
            maxW={300}
            h={280}
            flexDirection={"column"}
            gap={2}
            alignItems={"center"}
            bgColor={bgColor}
            borderRadius={5}
            shadow={"md"}
        >

            <Button bgColor={bgColor} onClick={() => handleSelect(game.id)} top={2} right={2} position={"absolute"}>
                <CgAddR />
            </Button>

            <Image
                src={game.background_image || NotImage}
                fallback={<Spinner size={"md"} />}
                fallbackSrc={NotImage}
                alt={game.name}
                w={"full"}
                h={"60%"}
                borderTopRadius={5}
                objectFit={"cover"}
            />
            <Box display={"flex"} flexDirection={"column"} p={3} justifyContent={"space-between"} textAlign={"center"} h={"40%"}>
                <Text fontSize={16} fontWeight={"bold"}>{game.name}</Text>
                <Text fontSize={14} color={"gray.500"}>{game.released}</Text>
            </Box>
        </Box>
    )
}

export default GameCard