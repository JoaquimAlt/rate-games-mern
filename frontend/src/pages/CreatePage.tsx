import { useEffect, useState } from "react"
import type IRate from "../types/Rate"
import { Box, Button, Container, Divider, HStack, Heading, Text, Textarea, VStack, useColorModeValue, useToast } from "@chakra-ui/react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { RateStars } from "../components/RateStars";
import { useRateStore } from "../store/rate";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user";
import SearchGames from "../components/SearchGames";
import { useGameStore } from "../store/game";
import RateExpanded from "../components/RateExpanded";
import { TbStarsFilled } from "react-icons/tb";
import ReactStars from "react-stars";

export const CreatePage = () => {

  const { game, fetchGame, gameId } = useGameStore();

  const { token, user , fetchUser} = useUserStore();

  const { createRate, isLoadingRates, fetchRateByGame, rates } = useRateStore();

  const toast = useToast();

  const navigate = useNavigate();

  const image_not_found = import.meta.env.VITE_NOT_FOUND_IMG;

  const mediaRates = rates.reduce(
    (acc: number, rate: IRate) => {
      return (acc + rate.stars);
    }, 0) / rates.length;

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
    }
  }, [token, navigate]);


  const [newRate, setNewRate] = useState<IRate>({
    game: game?.name || "",
    stars: 0,
    comment: "",
    image: game?.background_image || image_not_found,
    user: user?._id,
    gameId: game?.id?.toString() || ""
  }
  );

  const handleStarsChange = (stars: number) => {
    setNewRate({ ...newRate, stars });
  };

  // Buscar jogo quando o gameId mudar
  useEffect(() => {
    if (gameId) {
      fetchGame(gameId);
    }
  }, [gameId, fetchGame]);

  // Atualizar rate e buscar avaliações quando o game mudar
  useEffect(() => {
    if (game) {
      setNewRate((prev) => ({
        ...prev,
        game: game.name,
        image: game.background_image || image_not_found,
        gameId: game.id.toString(),
        user: user?._id
      }));

      fetchRateByGame(game.id.toString());
      fetchUser();
    }
  }, [game, fetchRateByGame]);

  const handleAddRate = async () => {
    const { success, msg } = await createRate(newRate);

    toast({
      title: success ? "Avaliação criada com sucesso!" : "Erro ao criar avaliação",
      description: msg,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    })

    if (success) {
      navigate("/");
      setNewRate({
        game: "",
        image: "",
        comment: "",
        stars: 0,
        user: user?._id,
        gameId: ""
      });
    }
  };

  const bgInputs = useColorModeValue("gray.100", "blackAlpha.300");
  const scrollbarStyles = {
    '&::-webkit-scrollbar': { width: '4px' },
    '&::-webkit-scrollbar-thumb': { bg: 'whiteAlpha.400', borderRadius: 'full' },
  }

  return (
    <Container display={"flex"} flexDirection={"column"} gap={"50px"} maxW={"1200px"} pb={6}>
      <VStack gap={8}>
        <Heading as={"h1"} size={"lg"} textAlign={"center"} mt={10} >
          Fazer nova avaliação
        </Heading>

        <Box
          w="full"
          rounded="lg"
          shadow="md"
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          minH="500px"
          overflow="hidden"
        >
          <Box
            w={{ base: "100%", md: "50%" }}
            p={8}
            color="white"
            bgImage={`linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3)), url(${game?.background_image_additional})`}
            bgSize="cover"
            bgPosition="center"
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            gap={4}
          >
            <Box>
              <Text>{game?.released}</Text>
              <Heading size="xl">{game?.name}</Heading>
            </Box>
            <HStack display={game !== null && game?.genres.length > 0 ? "flex" : "none"}>
              {game?.genres.map(genre => (
                <Text key={genre.id}
                  bgColor={"red"}
                  rounded={"lg"}
                  paddingInline={3}
                  fontSize="md"
                  fontWeight="bold">
                  {genre.name}
                </Text>
              ))}
            </HStack>

            <Box
              fontSize="sm"
              maxH="180px"
              overflowY="auto"
              sx={scrollbarStyles}
            >
              {game === null
                ?
                <Text whiteSpace="pre-wrap">
                  Selecione um jogo para avaliar.
                </Text>
                :
                <Text whiteSpace="pre-wrap">
                  {game?.description_raw || "Sem descrição disponível para este jogo."}
                </Text>
              }

            </Box>
          </Box>

          <Box
            w={{ base: "100%", md: "50%" }}
            p={8}
            bg={useColorModeValue("white", "gray.800")}
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            gap={6}
          >
            <VStack w="full" h={"full"} justifyContent={"space-between"}>

              {game === null && <SearchGames />}

              <RateStars rating={newRate.stars} onRate={handleStarsChange} />

              <VStack position={"relative"} w={"full"}>
                <Textarea
                  placeholder="Comente sobre o jogo..."
                  name="comment"
                  value={newRate.comment}
                  onChange={(e) => setNewRate({ ...newRate, comment: e.target.value })}
                  bg={bgInputs}
                  maxLength={500}
                  h={"300px"}
                  resize={"none"}
                />
                <Text as={"p"} fontSize={"xs"} color={"gray.500"} position={"absolute"} bottom={1} right={2}>
                  {newRate.comment.length}/500
                </Text>
              </VStack>

              <Button
                isDisabled={isLoadingRates}
                isLoading={isLoadingRates}
                w="full"
                bgColor="red"
                color="white"
                onClick={handleAddRate}
              >
                Enviar Avaliação
              </Button>
            </VStack>
          </Box>
        </Box>

      </VStack>

      {game !== null && game.ratings.length > 0 &&
        <VStack>
          <HStack marginBottom={5}>
            <Text
              fontSize={25}
              fontWeight={"bold"}
            >
              Números da comunidade
            </Text>
            <TbStarsFilled color="red" size={30} />
          </HStack>
          <Divider />
          <Box display={"flex"} flexDirection={{base: "column", md: "row"}} p={8} w={"full"} gap={{base: 20, md: 40}} alignItems={{base: "center", md: "flex-start"}} justifyContent={"center"}>
            <VStack>
              <Text>
                Avalições no RAWG.io
              </Text>
              <Divider />
              <HStack alignItems={"flex-end"}>
                <VStack marginBottom={10}>
                  <Text>5</Text>
                  <ReactStars 
                    size={18}
                    value={5}
                    color1="gray"
                    color2="red"
                    edit={false}
                  />
                </VStack>
                {Array.isArray(game?.ratings) && game.ratings.length > 0 && (
                  <VStack h="220px" justifyContent={"flex-end"} alignItems={"center"}>
                    <ResponsiveContainer minWidth={250} width={300} height="100%">
                      <BarChart
                        data={[...game.ratings].sort((a, b) => b.id - a.id)}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                        layout="horizontal"
                        barSize={700}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis
                          dataKey="id"
                        />
                        <Tooltip />
                        <Bar dataKey="count" fill="red" radius={[5, 5, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </VStack>
                )}
                <VStack marginBottom={10}>
                  <Text>1</Text>
                  <ReactStars 
                    size={18}
                    value={1}
                    color1="gray"
                    color2="red"
                    edit={false}
                  />
                </VStack>
              </HStack>
            </VStack>

            <VStack alignItems={"start"} width={300}>
              <VStack w={"full"}>
                <Text >
                  Médias de Estrela
                </Text>
                <Divider />
              </VStack>

              <HStack w={"full"} justifyContent={"space-between"}>
                <Text fontWeight={"bold"}>
                  RateGames
                </Text>
                <HStack gap={1}>
                  <Text>{mediaRates.toFixed(1)}</Text>
                  <ReactStars 

                    size={20}
                    value={mediaRates}
                    color1="gray"
                    color2="red"
                    edit={false}
                  />
                </HStack>
              </HStack>

              <HStack w={"full"} justifyContent={"space-between"}>
                <Text fontWeight={"bold"}>
                  Rawg.io
                </Text>
                <HStack alignItems={"center"} gap={1}>
                  <Text>{game.rating.toFixed(1)}</Text>
                  <ReactStars 
                    size={20}
                    value={game.rating}
                    color1="gray"
                    color2="red"
                    edit={false}
                  />
                </HStack>

              </HStack>

            </VStack>
          </Box>
        </VStack>
      }
      <Box>
        {rates.length !== 0 &&
          <Box>
            <Box display={"flex"} justifyContent={"center"} alignItems={"baseline"} gap={2} fontSize={25} marginBottom={10}>
              <Text fontWeight={"bold"}>Avalições no</Text>
              <Text
                fontWeight={"bold"}
                bgGradient={"linear(to-r, red.500, red)"}
                bgClip={"text"}
              >
                RateGames
              </Text>
              <TbStarsFilled color="red" size={30} />
            </Box>
            <Divider marginBottom={10} />
          </Box>
        }

        {rates.map((rate) => (
          <Box paddingBlock={4} key={rate._id?.toString()}>
            <RateExpanded rate={rate} />
            <Divider />
          </Box>
        ))}
      </Box>
    </Container>
  );
}
