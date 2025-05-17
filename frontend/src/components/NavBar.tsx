import { Box, Button, Container, Flex, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Stack, Text, useColorMode } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { CgAddR } from "react-icons/cg";
import { LuMoon, LuSun } from "react-icons/lu";
import { FaGamepad } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { useUserStore } from "../store/user";
import { MdExitToApp } from "react-icons/md";
import { BsListStars } from "react-icons/bs";
import { useEffect } from "react";

export const NavBar = () => {

    const { colorMode, toggleColorMode } = useColorMode();

    const { user, logout, fetchUser} = useUserStore();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    useEffect(() => {
        fetchUser();
    }
    , [fetchUser]);

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
                    <Link to={"/"}>
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
                    <Button onClick={toggleColorMode}>
                        {colorMode === "light" ? <LuMoon /> : <LuSun />}
                    </Button>
                    {user !== null ?
                        <Box gap={2} display={"flex"} alignItems={"center"}>
                            <Link to={"/create"}>
                                <Button>
                                    <CgAddR />
                                </Button>
                            </Link>
                            <Menu>
                                <MenuButton leftIcon={<FaUserCircle />} as={Button}>
                                    {user?.username}
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => { navigate("/profile") }} icon={<BsListStars />}>
                                        Minhas Avaliações
                                    </MenuItem>
                                    <MenuDivider />
                                    <MenuItem onClick={handleLogout} icon={<MdExitToApp />}>
                                        Sair
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </Box>
                        :
                        <Link to={"/login"}>
                            <Button leftIcon={<FaUserCircle />}>
                                Login
                            </Button>
                        </Link>
                    }
                </Stack>

            </Flex>
        </Container>
    )
}
