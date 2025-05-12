import { useState } from "react"
import type IRate from "../types/Rate"
import { Box, Button, Container, Heading, Input, Textarea, VStack } from "@chakra-ui/react";
import { useColorModeValue } from "../components/ui/color-mode";
import { RateStars } from "../components/RateStars";
import { useRateStore } from "../store/rate";

export const CreatePage = () => {

  const [newRate, setNewRate] = useState<IRate>({
    game: "",
    stars: 0,
    comment: "",
    image: "",
  }
  );

  const handleStarsChange = (stars: number) => {
    setNewRate({ ...newRate, stars });
  };

  const { createRate } = useRateStore();

  const handleAddRate = async() => {
    const {success, msg} = await createRate(newRate);
    console.log("Succes:", success);
    console.log("Message:", msg);
  }

  return (
    <Container maxW={"lg"}>
      <VStack gap={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mt={20} >
          Fazer nova avaliação
        </Heading>

        <Box w={"full"} bg={useColorModeValue("white", "gray.950")} p={6} rounded={"lg"} shadow={"md"} >
          <VStack gap={6}>

            <Input
              placeholder="URL da Imagem do Jogo"
              name="image"
              value={newRate.image}
              onChange={(e) => setNewRate({ ...newRate, image: e.target.value })}
              variant="outline"
            />

            <Input
              placeholder="Nome do Jogo"
              name="game"
              value={newRate.game}
              onChange={(e) => setNewRate({ ...newRate, game: e.target.value })}
              variant="outline"
            />

            <RateStars rating={newRate.stars} onRate={handleStarsChange}/> 

            <Textarea 
              placeholder="Comente sobre o jogo..."
              name="comment"
              value={newRate.comment}
              onChange={(e) => setNewRate({ ...newRate, comment: e.target.value })}
              variant="outline"
            />

            <Button w={"full"} colorPalette={"red"} onClick={handleAddRate}>
              Enviar Avaliação
            </Button>

          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
