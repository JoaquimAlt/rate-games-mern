import { Box, Button, Image, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import type { Game } from '../store/game';
import { useNavigate } from "react-router-dom";
import { CgAddR } from "react-icons/cg";
import NotImage from "../assets/not-image.png";

interface Props {
    game: Game;
}

const GameCard = ({ game }: Props) => {

    const navigate = useNavigate();

    const handleSelect = (game: Game) => {
        navigate("/create", {
            state: {
                gameName: game.name,
                gameImage: game.background_image,
            },
        });

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

            <Button bgColor={bgColor} onClick={() => handleSelect(game)} top={2} right={2} position={"absolute"}>
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