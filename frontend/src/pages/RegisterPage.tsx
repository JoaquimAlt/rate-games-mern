import { Box, Button, Container, Heading, Input, useColorModeValue, useToast, VStack, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useUserStore } from '../store/user';
import { Link, useNavigate } from 'react-router-dom';
import InputPassword from '../components/InputPassword';
import PasswordChecklist from "react-password-checklist";

const RegisterPage = () => {

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const { register, isLoading } = useUserStore();

    const toast = useToast();

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const { success, msg } = await register(
            user.username,
            user.email,
            user.password,
            user.confirmPassword
        );

        toast({
            title: success ? "Usuário cadastrado com sucesso!" : "Erro ao realizar cadastro",
            description: msg,
            status: success ? "success" : "error",
            duration: 3000,
            isClosable: true,
            position: "top",
        });

        if (success) {
            navigate("/");
            setUser({
                username: "",
                email: "",
                password: "",
                confirmPassword: ""
            })
        }
    };

    const bgInputs = useColorModeValue("gray.100", "blackAlpha.300");

    return (
        <Container display={"flex"} flexDirection={"column"} minH={"100vh"} justifyContent={"center"} maxW={"600px"}>
            <VStack gap={5}>
                <Heading
                    as={"h1"}
                    size={"lg"}
                    textAlign={"center"}
                    bgGradient={"linear(to-r, red.500, red)"}
                    bgClip={"text"}
                >
                    Página de Cadastro
                </Heading>
                <Box
                    w={"full"}
                    bg={useColorModeValue("white", "gray.800")}
                    rounded={"lg"}
                    shadow={"md"}
                >
                    <VStack p={8} gap={6}>
                        <Text fontSize={"lg"}>Cadastre sua conta</Text>

                        <Input
                            placeholder='Nome de usuário'
                            type='text'
                            name='username'
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            bgColor={bgInputs}
                        />

                        <Input
                            placeholder='Email'
                            type='email'
                            name='email'
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            bgColor={bgInputs}
                        />

                        <InputPassword
                            placeholder='Senha'
                            name='password'
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            bgColor={bgInputs}
                        />

                        <InputPassword
                            placeholder='Confirme sua senha'
                            name='confirmPassword'
                            value={user.confirmPassword}
                            onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                            bgColor={bgInputs}
                        />

                        {(user.password.length > 0 || user.confirmPassword.length > 0) && 
                            <Box w={"100%"} p={2}>
                                <PasswordChecklist
                                    iconSize={12}
                                    rules={["minLength", "specialChar", "number", "capital", "match"]}
                                    minLength={5}
                                    value={user.password}
                                    valueAgain={user.confirmPassword}
                                    onChange={(isValid) => {setIsPasswordValid(isValid)}}
                                    messages={{
                                        minLength: "A senha possui mais de 5 caracteres",
                                        specialChar: "A senha possui caracteres especiais.",
                                        number: "A senha possui número.",
                                        capital: "A senha possui letra maiúscula",
                                        match: "As senhas coincidem.",
                                    }}
                                />
                            </Box>
                        }

                        <Button isLoading={isLoading} isDisabled={isLoading || !isPasswordValid} color={"white"} onClick={handleRegister} bgColor='red' size='lg' width={"full"}>
                            Cadastrar
                        </Button>

                        <Text fontSize={"sm"} color={"gray.500"}>
                            Já possui uma conta? <Link to="/login" style={{ color: "red" }}> Entrar</Link>
                        </Text>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    )
}

export default RegisterPage