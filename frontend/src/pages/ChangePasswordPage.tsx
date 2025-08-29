import { Button, Container, Heading, HStack, PinInput, PinInputField, useToast, Text, useColorModeValue, VStack, Box } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import InputPassword from '../components/InputPassword';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/user';
import PasswordChecklist from "react-password-checklist";

export const ChangePasswordPage = () => {

  const location = useLocation();
  const toast = useToast();
  const email = location.state?.email;

  const [changePass, setChangePass] = useState(false);
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const { isLoadingUser, verifyOTP, changePassword } = useUserStore();

  const navigate = useNavigate();

  const handleVerifyOTP = async (email: string, otp: string) => {
    const { success, msg } = await verifyOTP(email, otp);

    toast({
      title: success ? "Código verificado com sucesso!" : "Erro ao verificar código",
      description: msg,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    setChangePass(success);
  };

  const handleChangePassword = async (email: string, password: string) => {
    const { success, msg } = await changePassword(email, password);

    toast({
      title: success ? "Senha alterada com sucesso!" : "Erro ao alterar senha",
      description: msg,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    });

    setPassword("");
    setConfirmPassword("");

    if(success) {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!email) {
      navigate("/forgot");
    }
  }, [email, navigate])

  const pinInputStyle = {
    fontSize: "2xl",
    width: {
      base: "50px",
      sm: "60px"
    },
    height: {
      base: "50px",
      sm: "60px"
    }
  };

  const bgColorContainer = useColorModeValue("white", "gray.800");
  const bgInputs = useColorModeValue("gray.100", "blackAlpha.300");

  return (
    <Container display={"flex"} h={"100vh"} justifyContent={"center"} flexDirection={"column"} maxW={"420px"} py={12}>
      {changePass
        ?
        <VStack spacing={10} p={10} backgroundColor={bgColorContainer} rounded={"lg"} gap={8}>
          <Heading
            as={"h2"}
            size={"lg"}
            w={"full"}
            bgGradient={"linear(to-r, red.500, red)"}
            bgClip={"text"}
            textAlign={"center"}
          >
            Altere sua senha
          </Heading>
          <InputPassword
            placeholder={"Digite sua nova senha"}
            value={password}
            name={"password"}
            bgColor={bgInputs}
            onChange={(e) => setPassword(e.target.value)}
          />

          <InputPassword
            placeholder={"Confirme sua senha"}
            value={confirmPassword}
            name={"confirmPassword"}
            bgColor={bgInputs}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Box w={"100%"} p={2}>
            <PasswordChecklist
              iconSize={12}
              rules={["minLength", "specialChar", "number", "capital", "match"]}
              minLength={5}
              value={password}
              valueAgain={confirmPassword}
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
          <Button
            color={"white"}
            bgColor='red'
            size='lg'
            width={"full"}
            isLoading={isLoadingUser }
            isDisabled={isLoadingUser || !isPasswordValid}
            onClick={() => handleChangePassword(email, password)}
          >
            Alterar senha
          </Button>
        </VStack>
        :
        <VStack textAlign={"center"} spacing={10} p={10} backgroundColor={bgColorContainer} rounded={"lg"}>
          <VStack>
            <Heading
              as={"h2"}
              size={"lg"}
              w={"full"}
              bgGradient={"linear(to-r, red.500, red)"}
              bgClip={"text"}
            >
              Verificar código
            </Heading>
            <Text>
              Insira o código que enviamos ao seu email.
            </Text>
          </VStack>

          <HStack justifyContent={"center"} spacing={3} w={"full"}>
            <PinInput value={otp} onChange={setOtp} otp>
              {Array.from({ length: 4 }).map((_, i) => (
                <PinInputField bgColor={bgInputs} key={i} {...pinInputStyle} />
              ))}
            </PinInput>
          </HStack>

          <Button
            color={"white"}
            bgColor={'red'}
            size={'lg'}
            w={"full"}
            onClick={() => handleVerifyOTP(email, otp)}
            isLoading={isLoadingUser}
            isDisabled={isLoadingUser || otp.length < 4}
          >
            Verificar código
          </Button>
        </VStack>
      }

    </Container>
  )
}