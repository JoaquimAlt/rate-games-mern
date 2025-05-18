import { useEffect, useState } from "react"
import type IRate from "../types/Rate"
import { Box, Button, Container, Heading, Textarea, VStack, useColorModeValue, useToast } from "@chakra-ui/react";

import { RateStars } from "../components/RateStars";
import { useRateStore } from "../store/rate";
import ImageGame from "../components/ImageGame";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user";

export const CreatePage = () => {

  const location = useLocation();
  const { gameName, gameImage } = location.state as { gameName: string; gameImage: string } || { gameName: "", gameImage: "" };

  const {token, user} = useUserStore();

  const [newRate, setNewRate] = useState<IRate>({
    game: gameName,
    stars: 0,
    comment: "",
    image: gameImage,
    user: undefined as unknown as import("mongodb").ObjectId,
  }
  );

  const handleStarsChange = (stars: number) => {
    setNewRate({ ...newRate, stars });
  };

  const { createRate } = useRateStore();

  const toast = useToast();

  const navigate = useNavigate();

  const [disable, setDisable] = useState(false);

  const handleAddRate = async () => {
    const { success, msg } = await createRate(newRate);
    console.log("Succes:", success);

    setDisable(true);

    toast({
      title: success ? "Avaliação criada com sucesso!" : "Erro ao criar avaliação",
      description: msg,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    })

    if (success) {
      setTimeout(() => {
        setDisable(false);
        navigate("/");
      }, 1200);
    } else {
      setDisable(false);
    }

    console.log("Message:", msg);
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    setNewRate((prev) => ({
      ...prev,
      game: gameName,
      image: gameImage,
      comment: "",
      stars: 0,
      user: user?._id as unknown as import("mongodb").ObjectId
    }));
  }, [gameName, gameImage, user]);

  const bgInputs = useColorModeValue("gray.100", "blackAlpha.300");

  return (
    <Container maxW={"800px"} pb={6}>
      <VStack gap={8}>
        <Heading as={"h1"} size={"lg"} textAlign={"center"} mt={20} >
          Fazer nova avaliação
        </Heading>

        <Box
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded={"lg"}
          shadow={"md"}
          display={"flex"}
          flexDirection={{base: "column", sm: "row"}}
          gap={8}
          justifyContent={"start"}
          alignItems={"center"}
        >

          <ImageGame w={280} h={280} rate={newRate} />

          <VStack display={"flex"} w={"full"} justifyContent={"end"} gap={8}>

            <Box display={"flex"} w={"full"} h={280} alignItems={{base: "center", sm: "start"}} flexDirection={"column"} gap={2}>

              <Heading textAlign={{base: "center", sm: "start"}} fontSize={24}>
                {newRate.game}
              </Heading>

              <RateStars rating={newRate.stars} onRate={handleStarsChange} />

              <Textarea
                placeholder="Comente sobre o jogo..."
                h={"full"}
                name="comment"
                value={newRate.comment}
                onChange={(e) => setNewRate({ ...newRate, comment: e.target.value })}
                bg={bgInputs}
              />

            </Box>

            <Button isDisabled={disable} w={"full"} bgColor="red" color={"white"} onClick={handleAddRate}>
              Enviar Avaliação
            </Button>

          </VStack>

        </Box>
      </VStack>
    </Container>
  );
}
