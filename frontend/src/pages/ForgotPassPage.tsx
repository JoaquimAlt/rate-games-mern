import { Button, Container, Heading, Input, Text, useColorModeValue, useToast, VStack } from '@chakra-ui/react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/user';

export const ForgotPassPage = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const toast = useToast();

    const { sendEmail, isLoadingUser } = useUserStore();

    const handleSubmit = async (email: string) => {
        const { success, msg } = await sendEmail(email);

        toast({
            title: success ? "Código enviado para o seu email!" : "Erro ao enviar código",
            description: msg,
            status: success ? "success" : "error",
            duration: 3000,
            isClosable: true,
            position: "top",
        });

        if (success) {
            navigate("/change-password", {state: {email}});
        }

        setEmail("");
    }

    const bgColorContainer = useColorModeValue("white", "gray.800");
    const bgInputs = useColorModeValue("gray.100", "blackAlpha.300");

    return (
        <Container display={"flex"} h={"100vh"} justifyContent={"center"} flexDirection={"column"} gap={10} maxW={"xl"} py={12}>
            <VStack textAlign={"center"} spacing={10} p={10} backgroundColor={bgColorContainer} rounded={"lg"}>
                <VStack>
                    <Heading
                        as={"h2"}
                        size={"lg"}
                        w={"full"}
                        bgGradient={"linear(to-r, red.500, red)"}
                        bgClip={"text"}
                    >
                        Esqueceu sua senha?
                    </Heading>
                    <Text color={"gray.500"}>
                        Enviaremos um código de verifição para o seu email para que possa mudar sua senha.
                    </Text>
                </VStack>

                <Input
                    size={"lg"}
                    placeholder='Digite seu email'
                    type='email'
                    name='email'
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                    bgColor={bgInputs}
                />

                <Button
                    onClick={() => handleSubmit(email)}
                    color={"white"}
                    bgColor='red'
                    size='lg'
                    width={"full"}
                    isLoading={isLoadingUser}
                    isDisabled={isLoadingUser}
                    >
                    Enviar código
                </Button>
            </VStack>
        </Container>
    )
}
