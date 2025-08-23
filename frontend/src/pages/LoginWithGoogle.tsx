import { Text, HStack, Spinner, useToast} from '@chakra-ui/react';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/user';

const LoginWithGoogle = () => {

    const navigate = useNavigate();

    const toast = useToast();

    const { loginWithGoogle } = useUserStore();

    const [token, setToken] = useState("");

    const responseLogin = async () => {

        const { success, msg } = await loginWithGoogle(token);

        toast({
            title: success ? "Bem vindo" : "Erro ao registrar com Google",
            description: msg,
            status: success ? "success" : "error",
            duration: 3000,
            isClosable: true,
            position: "top",
        });

        if (success) {
            navigate("/");
        } else {
            navigate("/login");
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenParam = params.get("token");

        if (!tokenParam) {
            toast({
                title: "Erro de autenticação",
                description: "Não foi possível autenticar com o Google. Tente novamente.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            navigate("/login");
        } else {
            setToken(tokenParam);
        }
    }, [navigate, toast]);

    useEffect(() => {
        if (!token) return;

        responseLogin();
    }, [token]);



    return (
        <HStack p={60} width={"full"} height={"full"} display={"flex"} justifyContent={"center"} alignContent={"center"}>
            <Spinner size="xl" />
            <Text>Redirecionando...</Text>
        </HStack>
    )
}

export default LoginWithGoogle;