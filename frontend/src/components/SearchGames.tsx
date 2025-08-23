import {
    Box,
    Container,
    Input,
    List,
    ListItem,
    Spinner,
    VStack,
    Text,
    useOutsideClick,
    Image,
    InputGroup,
    InputLeftElement,
    Divider,
    useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/game";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const SearchGames = () => {
    const { gamesList, isLoading, fetchGames, clearGames } = useGameStore();

    const [search, setSearch] = useState("");

    const [showResults, setShowResults] = useState(false);

    const wrapperRef = useRef(null);

    // Fecha a lista ao clicar fora
    useOutsideClick({
        ref: wrapperRef,
        handler: () => setShowResults(false),
    });

    const navigate = useNavigate();

    const { setGameId } = useGameStore();

    const handleSelect = (gameId: number) => {
        setSearch("");
        setShowResults(false);
        setGameId(gameId.toString());
        navigate("/create");
    };

    useEffect(() => {
        if (search.length > 1) {
            fetchGames(search);
            setShowResults(true);
        } else {
            clearGames();
            setShowResults(false);
        }
    }, [search, fetchGames, clearGames]);

    const bgColor = useColorModeValue("white", "gray.700");

    return (
        <Container position={"relative"} minW={{ base: 200, sm: 400 }} maxW={500} ref={wrapperRef}>
            <VStack align="stretch" spacing={2}>
                <InputGroup>
                    <InputLeftElement>
                        <IoSearchSharp />
                    </InputLeftElement>
                    <Input
                        bgColor={bgColor}
                        placeholder="Buscar jogo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>

                {showResults && (
                    <Box
                        boxShadow="md"
                        borderRadius="md"
                        overflow="hidden"
                        maxH={{ sm: 200, lg: 500 }}
                        overflowY="auto"
                        zIndex="dropdown"
                        position="absolute"
                        top={10}
                        bgColor={bgColor}
                        display={"flex"}
                        w={"full"}

                    >
                        {isLoading ? (
                            <Box p={4} display={"flex"} gap={4} textAlign="center">
                                <Spinner size="sm" />
                                <Text>Buscando...</Text>
                            </Box>
                        ) : gamesList.length > 0 ? (
                            <List display={"flex"} flexDirection={"column"} w={"full"}>
                                {gamesList.map((game) => (
                                    <Box key={game.id}>
                                        <ListItem
                                            display={"flex"}
                                            alignItems={"center"}
                                            textAlign={"start"}
                                            justifyContent={"space-between"}
                                            gap={4}
                                            px={4}
                                            minH={70}
                                            _hover={{ bg: "gray.400", cursor: "pointer" }}
                                            onClick={() => handleSelect(game.id)}
                                        >
                                            <Image
                                                maxH={"85%"}
                                                maxW={70} 
                                                src={game.background_image} />

                                            <Text maxW={160} fontSize="md" >
                                                {game.name}
                                            </Text>

                                            <Text fontSize="sm" color="gray.400">
                                                {game.released}
                                            </Text>
                                        </ListItem>
                                        <Divider />
                                    </Box>
                                ))}
                            </List>
                        ) : (
                            <Box px={4} py={2}>
                                <Text>Nenhum resultado encontrado</Text>
                            </Box>
                        )}
                    </Box>
                )}
            </VStack>
        </Container>
    );
};

export default SearchGames;
