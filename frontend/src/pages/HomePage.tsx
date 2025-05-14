import { Container, VStack, Text, Box, SimpleGrid, Center } from "@chakra-ui/react"
import { useEffect } from "react"
import { FaStar } from "react-icons/fa"
import { Link } from "react-router-dom"
import { useRateStore } from "../store/rate"
import RateCard from "../components/RateCard"

export const HomePage = () => {

  const { fetchRates, rates } = useRateStore();

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  console.log("Rates:", rates);

  return (
    <Container maxW={"smxl"} py={12}>
      <VStack spacing={4}>
        <Box display={"flex"} alignItems={"center"} gap={5}>
          <Text
            fontSize={30}
            fontWeight={"bold"}
            bgGradient={"linear(to-r, red.500, red)"}
            bgClip={"text"}
          >
            Suas avaliações
          </Text>
          <FaStar color="red" size={30} />
        </Box>

        <Center>
        <SimpleGrid
          marginTop={6}
          columns={{
            base: 1,
            md: 2,
            lg: 3
          }}
          spacing={8}
          w={"full"}
          
        >
          {rates.map((rate) => (
            <RateCard key={rate._id?.toString()} rate={rate} />
          ))}
        </SimpleGrid>
        </Center>

        {rates.length === 0 ? <Text
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
        </Text> : ""}
        
      </VStack>
    </Container>
  )
}
