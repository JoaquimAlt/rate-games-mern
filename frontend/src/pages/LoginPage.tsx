import { Box, Button, Container, Heading, Input, useColorModeValue, useToast, VStack, Text } from '@chakra-ui/react'
import React from 'react'
import { useUserStore } from '../store/user';
import { Link, useNavigate } from 'react-router-dom';
import InputPassword from '../components/InputPassword';
import { FcGoogle } from "react-icons/fc";


const LoginPage = () => {

    const [user, setUser] = React.useState({
        email: "",
        password: ""
    });

    const { login, isLoading } = useUserStore();

    const toast = useToast();

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const { success, msg } = await login(user.email, user.password);

        toast({
            title: success ? "Login realizado com sucesso!" : "Erro ao realizar login",
            description: msg,
            status: success ? "success" : "error",
            duration: 3000,
            isClosable: true,
            position: "top",
        });

        if (success) {
            navigate("/");
            setUser({
                email: "",
                password: ""
            });
        }
    };

    const API_URL = import.meta.env.VITE_API_URL;

    const handleLoginWithGoogle = () => {
        window.location.href = `${API_URL}/auth/google`;
    }

    const bgInputs = useColorModeValue("gray.100", "blackAlpha.300");

    return (
        <Container
            display={"flex"}
            flexDirection={"column"}
            minH={"100vh"}
            justifyContent={"center"}
            maxW={"600px"}
        >
            <VStack gap={8}>
                <Heading
                    as={"h1"}
                    size={"lg"}
                    textAlign={"center"}
                    bgGradient={"linear(to-r, red.500, red)"}
                    bgClip={"text"}
                >
                    Página de Login
                </Heading>
                <Box
                    w={"full"}
                    bg={useColorModeValue("white", "gray.800")}
                    rounded={"lg"}
                    shadow={"md"}
                >
                    <VStack p={8} gap={6}>
                        <Text fontSize={"lg"}>Entre com sua conta</Text>
                        <Input
                            placeholder='Email'
                            type='email'
                            name='email'
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            bgColor={bgInputs}
                        />

                        <VStack w={"100%"} alignItems={"flex-start"}>
                            <InputPassword
                                placeholder='Senha'
                                name='password'
                                value={user.password}
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                                bgColor={bgInputs}
                            />
                            <Text fontSize={"sm"} color={"red"}>
                                <Link to="/forgot">
                                    Esqueci minha senha
                                </Link>
                            </Text>
                        </VStack>

                        <Button
                            color={"white"}
                            isLoading={isLoading}
                            isDisabled={isLoading || user.password.length < 3 || user.email.length < 3}
                            onClick={handleLogin}
                            bgColor='red'
                            size='lg'
                            width={"full"}
                        >
                            Entrar
                        </Button>

                        <Button
                            leftIcon={<FcGoogle />}
                            size='lg'
                            width={"full"}
                            onClick={handleLoginWithGoogle}
                        >
                            Entrar com Google
                        </Button>

                        <Text fontSize={"sm"} color={"gray.500"}>
                            Não tem uma conta? <Link to="/register" style={{ color: "red" }}>Registrar</Link>
                        </Text>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    )
}

export default LoginPage