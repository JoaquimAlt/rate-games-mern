import { Button, Center, Container, Flex, Stack, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { CgAddR } from "react-icons/cg";
import { useColorMode } from "./ui/color-mode";
import { LuMoon, LuSun } from "react-icons/lu";

export const NavBar = () => {

    const {colorMode, toggleColorMode} = useColorMode();

    return (
        <Container maxW={"1140px"} px={4}>
            <Flex
                h={16}
                alignItems={"center"}
                justifyContent={"space-between"}
                padding={"20px"}
                flexDirection={
                    {
                        base: "column",
                        sm: "row"
                    }
                }
            >
                <Text
                    fontSize={"24px"}
                    fontWeight={"bold"}
                >
                    <Link to="/">RateGames</Link>
                </Text>

                <Stack
                alignItems={"center"}
                gap={"7px"}
                direction={"row"}
                >
                    <Link to="/create">
                        <Button variant={"subtle"}>
                            <CgAddR />
                        </Button>
                    </Link>
                    <Button variant={"subtle"} onClick={toggleColorMode}>
                        {colorMode === "light" ? <LuMoon /> : <LuSun/>}
                    </Button>
                </Stack>

            </Flex>
        </Container>
    )
}
