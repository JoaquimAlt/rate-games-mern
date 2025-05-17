import { Container, VStack, Text, Box, SimpleGrid, Center } from "@chakra-ui/react"
import { useEffect } from "react"
import { TbStarsFilled } from "react-icons/tb";
import { Link } from "react-router-dom"
import { useRateStore } from "../store/rate"
import RateCard from "../components/RateCard"
import { useUserStore } from "../store/user"

export const ProfilePage = () => {

  const { fetchMyRates, rates } = useRateStore();
  const { fetchUser, user} = useUserStore();

  useEffect(() => {
    fetchMyRates();
    fetchUser();
  }, [fetchMyRates, fetchUser]);

  console.log("Rates:", rates);
  console.log("User:", user);
  
  return (
    <Container maxW={"smxl"} py={12}>
      <VStack spacing={4}>
        <Box display={"flex"} textAlign={"center"} alignItems={"center"} gap={5}>
          <Text
            fontSize={30}
            fontWeight={"bold"}
            bgGradient={"linear(to-r, red.500, red)"}
            bgClip={"text"}
          >
            Suas avaliações
          </Text>
          <Text
            fontSize={30}
            fontWeight={"bold"}
            color={"white"}
          >
            {user?.username}
          </Text>
          <TbStarsFilled color="red" size={30} />
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
