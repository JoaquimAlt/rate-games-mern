import { Container, VStack, Text, Box, SimpleGrid, Center, Skeleton } from "@chakra-ui/react"
import { useEffect } from "react"
import { TbStarsFilled } from "react-icons/tb";
import { Link } from "react-router-dom"
import { useRateStore } from "../store/rate"
import RateCard from "../components/RateCard"
import { SimpleCarousel } from "../components/SimpleCarousel";
import { useGameStore } from "../store/game";
import GameCard from "../components/GameCard";
import PaginationCarousel from "../components/PaginationCarousel";

export const HomePage = () => {

  const { fetchRates, rates } = useRateStore();

  const { isLoading, popularGames } = useGameStore();

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  return (
    <Container maxW={"smxl"} pb={6}>
      <VStack spacing={50}>

        <SimpleCarousel />

        {rates.length === 0
          ?
          <Text
            display={"flex"}
            gap={2}
            fontSize={18}
            fontWeight={"bold"}>
            Nenhuma avaliação encontrada {""}
            <Link to={"/create"}>
              <Text
                as={"span"}
                bgGradient={"linear(to-r, red.500, red)"}
                bgClip={"text"}
                _hover={{ color: "red.300" }}>
                Registrar avaliação
              </Text>
            </Link>
          </Text>
          :
          <Center display={"flex"} mt={{ base: 20, md: 0 }} flexDirection={"column"} gap={5}>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} gap={5}>
              <Text
                fontSize={30}
                fontWeight={"bold"}
                bgGradient={"linear(to-r, red.500, red)"}
                bgClip={"text"}
              >
                Avaliações recentes
              </Text>
              <TbStarsFilled color="red" size={30} />
            </Box>
            <SimpleGrid
              columns={{
                base: 1,
                md: 2,
                lg: 3
              }}
              spacing={8}
              w={"full"}

            >
              {rates.slice(0, 3).map((rate) => (
                <RateCard key={rate._id?.toString()} rate={rate} />
              ))}
            </SimpleGrid>
          </Center>
        }

        <Center display={"flex"} flexDirection={"column"} gap={5} marginTop={10}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"} gap={5}>
            <Text
              fontSize={30}
              fontWeight={"bold"}
              bgGradient={"linear(to-r, red.500, red)"}
              bgClip={"text"}
            >
              Melhores pelo MetaCritics
            </Text>
            <TbStarsFilled color="red" size={30} />
          </Box>

          <Box display={"flex"} alignItems={"center"} gap={6} flexDirection={"column"} justifyContent={"center"}>
            <SimpleGrid
              columns={{
                base: 1,
                md: 3,
                lg: 4
              }}
              spacing={8}
              w={"full"}
            >
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} w={300} h={280} borderRadius={5} />
                ))
                : popularGames.map((game) => (
                  <GameCard key={game.slug} game={game} />
                ))
              }
            </SimpleGrid>
            <PaginationCarousel />
          </Box>

        </Center>

      </VStack>

    </Container>
  )
}
