import { Avatar, Box, Button, Container, Flex, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Stack, Text, useColorMode, useColorModeValue } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { LuMoon, LuSun } from "react-icons/lu";
import { FaGamepad } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { useUserStore } from "../store/user";
import { MdExitToApp } from "react-icons/md";
import { BsListStars } from "react-icons/bs";
import SearchGames from "./SearchGames";

export const NavBar = () => {

    const { colorMode, toggleColorMode } = useColorMode();

    const { user, token, logout } = useUserStore();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    const bgColor = useColorModeValue("white", "");

    return (
        <Container maxW={"1140px"} px={4}>
            <Flex
                h={{
                        base: "auto",
                        md: 16
                    }}
                alignItems={"center"}
                justifyContent={"space-between"}
                padding={"20px"}
                flexDirection={
                    {
                        base: "column",
                        md: "row"
                    }
                }
                gap={
                    {
                        base: 5,
                        md: 0
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
                    <SearchGames />

                    <Button bgColor={bgColor} onClick={toggleColorMode}>
                        {colorMode === "light" ? <LuMoon size={25} /> : <LuSun size={25} />}
                    </Button>
                    {token !== null && user !== null 
                        ?
                        <Box gap={2} display={"flex"} alignItems={"center"}>
                            <Menu>
                                <MenuButton bgColor={bgColor} as={Button}>
                                    <HStack>
                                        <Avatar name={user.username} size={"xs"} src={user.profileImage || undefined} />
                                        <Text>{user.username}</Text>
                                    </HStack>
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => { navigate("/profile") }} icon={<BsListStars size={18} />}>
                                        Minhas Avaliações
                                    </MenuItem>
                                    <MenuDivider />
                                    <MenuItem onClick={handleLogout} icon={<MdExitToApp size={18} />}>
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
    );
}
