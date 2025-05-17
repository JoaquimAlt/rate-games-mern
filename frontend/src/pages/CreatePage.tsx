import { useState } from "react"
import type IRate from "../types/Rate"
import { Box, Button, Container, Heading, Input, Textarea, VStack, useColorModeValue, useToast} from "@chakra-ui/react";

import { RateStars } from "../components/RateStars";
import { useRateStore } from "../store/rate";
import ImageGame from "../components/ImageGame";
import { useNavigate } from "react-router-dom";

export const CreatePage = () => {

  const [newRate, setNewRate] = useState<IRate>({
    game: "",
    stars: 0,
    comment: "",
    image: "",
    user: undefined as unknown as import("mongodb").ObjectId,
  }
  );

  const handleStarsChange = (stars: number) => {
    setNewRate({ ...newRate, stars });
  };

  const { createRate } = useRateStore();

  const toast = useToast();

  const navigate = useNavigate();

  const handleAddRate = async () => {
    const { success, msg } = await createRate(newRate);
    console.log("Succes:", success);

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
          navigate("/home");
        }, 1200);
    }

    console.log("Message:", msg);
  }



  const bgInputs = useColorModeValue("gray.100", "blackAlpha.300");

  return (
    <Container maxW={"600px"}>
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
          justifyContent={"space-around"}
          alignItems={"start"}
        >

          <ImageGame rate={newRate} />

          <VStack gap={6}>

            <Input
              placeholder="URL da Imagem do Jogo"
              name="image"
              value={newRate.image}
              onChange={(e) => setNewRate({ ...newRate, image: e.target.value })}
              bg={bgInputs}
            />

            <Input
              placeholder="Nome do Jogo"
              name="game"
              value={newRate.game}
              onChange={(e) => setNewRate({ ...newRate, game: e.target.value })}
              colorScheme={"white"}
              bg={bgInputs}
            />

            <RateStars rating={newRate.stars} onRate={handleStarsChange} />

            <Textarea
              placeholder="Comente sobre o jogo..."
              name="comment"
              value={newRate.comment}
              onChange={(e) => setNewRate({ ...newRate, comment: e.target.value })}
              bg={bgInputs}
            />

            <Button w={"full"} bgColor="red" color={"white"} onClick={handleAddRate}>
              Enviar Avaliação
            </Button>

          </VStack>

        </Box>
      </VStack>
    </Container>
  );
}
