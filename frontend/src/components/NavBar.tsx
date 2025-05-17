import { Button, Container, Flex, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Stack, Text, useColorMode } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { CgAddR } from "react-icons/cg";
import { LuMoon, LuSun } from "react-icons/lu";
import { FaGamepad } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { useUserStore } from "../store/user";
import { MdExitToApp } from "react-icons/md";
import { BsListStars } from "react-icons/bs";

export const NavBar = () => {

    const { colorMode, toggleColorMode } = useColorMode();

    const { user, loggout } = useUserStore();

    const navigate = useNavigate();

    const handleLoggout = () => {
        loggout();
        navigate("/login");
    }

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

                <Stack
                    direction={"row"}
                    alignItems={"center"}
                >
                    <Link to={"/home"}>
                        <Text fontSize={"24px"} fontWeight={"bold"}>
                            RateGames
                        </Text>
                    </Link>
                    <FaGamepad color="red" size={30} />
                </Stack>

                <Stack
                    alignItems={"center"}
                    gap={"7px"}
                    direction={"row"}
                >
                    <Menu>
                        <MenuButton leftIcon={<FaUserCircle />} as={Button}>
                            {user?.username}
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => {navigate("/profile")}} icon={<BsListStars />}>
                                Minhas Avaliações
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={handleLoggout} icon={<MdExitToApp />}>
                                Sair
                            </MenuItem>
                        </MenuList>
                    </Menu>
                    <Link to={"/create"}>
                        <Button>
                            <CgAddR />
                        </Button>
                    </Link>
                    <Button onClick={toggleColorMode}>
                        {colorMode === "light" ? <LuMoon /> : <LuSun />}
                    </Button>
                </Stack>

            </Flex>
        </Container>
    )
}
