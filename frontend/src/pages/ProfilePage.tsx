import { Container, VStack, Text, Box, useColorModeValue, Divider, Button, MenuItem, MenuList, MenuButton, Menu } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { TbStarsFilled } from "react-icons/tb";
import { Link } from "react-router-dom"
import { useRateStore } from "../store/rate"
import { useUserStore } from "../store/user"
import RateExpanded from "../components/RateExpanded";
import { IoIosArrowDown } from "react-icons/io";

export const ProfilePage = () => {

  const { fetchMyRates, rates } = useRateStore();
  const { fetchUser, user } = useUserStore();

  const [order, setOrder] = useState("recentes");

  useEffect(() => {
    fetchMyRates(order);
    fetchUser();
  }, [fetchMyRates, fetchUser, order]);

  const bgColorContainer = useColorModeValue("white", "gray.800");

  return (
    <Container maxW={"smxl"} py={12}>
      <VStack spacing={4}>

        <Box
          bgColor={bgColorContainer}
          marginTop={6}
          display={"flex"}
          flexDirection={"column"}
          gap={8}
          w={"full"}
          maxW={"container.lg"}
          p={8}
        >
          <Box
            w={"full"}
            display={"flex"}
            textAlign={"center"}
            flexDirection={{ base: "column", md: "row" }}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={5}
          >
            <Box display={"flex"} alignItems={"center"} gap={5} fontSize={25}>
              <Text
                fontWeight={"bold"}
                bgGradient={"linear(to-r, red.500, red)"}
                bgClip={"text"}
              >
                Suas avaliações
              </Text>
              <Text
                fontWeight={"semi-bold"}
                color={useColorModeValue("black", "white")}
                maxW={220}
              >
                {user?.username}
              </Text>
              <TbStarsFilled color="red" size={30} />
            </Box>
            <Menu>
              <Box display={"flex"} alignItems={"center"} gap={3}>
                <Text>Ordenar por:</Text>
                <MenuButton as={Button} rightIcon={<IoIosArrowDown />} >{order}</MenuButton>
              </Box>
              <MenuList>
                <MenuItem onClick={() => { setOrder("recentes") }}>Recentes</MenuItem>
                <MenuItem onClick={() => { setOrder("antigas") }}>Antigas</MenuItem>
              </MenuList>
            </Menu>
          </Box>

          <Divider />

          {rates.map((rate) => (
            <Box key={rate._id?.toString()}>
              <RateExpanded showimage={true} rate={rate} />
              <Divider />
            </Box>
          ))}
        </Box>

        {rates.length === 0 &&
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
        }

      </VStack>
    </Container>
  )
}
