// components/EditRateModal.tsx
import {
  Box, Heading, VStack, Textarea, useColorModeValue,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, Text
} from "@chakra-ui/react";
import { useRef } from "react";
import { RateStars } from "./RateStars";
import ImageGame from "./ImageGame";
import type IRate from "../types/Rate";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  updatedRate: IRate;
  setUpdatedRate: (rate: IRate) => void;
  handleUpdateRate: (id: string, updatedRate: IRate) => void;
}

export const ModalEditRate = ({
  isOpen,
  onClose,
  isLoading,
  updatedRate,
  setUpdatedRate,
  handleUpdateRate
}: Props) => {

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const bgInputs = useColorModeValue("gray.100", "blackAlpha.300");
  const scrollbarStyles = {
    '&::-webkit-scrollbar': { width: '4px' },
    '&::-webkit-scrollbar-thumb': { bg: 'whiteAlpha.400', borderRadius: 'full' },
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
      size={"3xl"}
    >
      <ModalOverlay />
      <ModalContent marginBlock={"auto"} paddingInline={6}>
        <ModalHeader textAlign={"center"}>Editar avaliação</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={2}>
          <Box
            display={"flex"}
            justifyContent={"start"}
            h={"full"}
            alignItems={"flex-start"}
            flexDirection={{ base: "column", sm: "row" }}
            gap={10}
          >
            <ImageGame w={260} rate={updatedRate} />
            <VStack
              w={"full"}
              h={"full"}
              alignItems={{ base: "center", sm: "start" }}
              justifyContent={"space-between"}
            >
              <Heading textAlign={{ base: "center", sm: "start" }} fontSize={24}>
                {updatedRate.game}
              </Heading>

              <RateStars rating={updatedRate.stars} onRate={(stars) => setUpdatedRate({ ...updatedRate, stars })} />

              <VStack w={"full"} position={"relative"}>
                <Textarea
                  name="comment"
                  placeholder="Seu comentário sobre o jogo"
                  value={updatedRate.comment}
                  w={"full"}
                  h={"190px"}
                  bg={bgInputs}
                  onChange={(e) => setUpdatedRate({ ...updatedRate, comment: e.target.value })}
                  maxLength={500}
                  resize={"none"}
                  sx={scrollbarStyles}
                />
                <Text as={"p"} fontSize={"xs"} color={"gray.500"} position={"absolute"} bottom={-5} right={2}>
                  {updatedRate.comment.length}/500
                </Text>
              </VStack>
            </VStack>
          </Box>
        </ModalBody>

        <ModalFooter paddingBlock={6} alignSelf={"end"}>
          <Button isDisabled={isLoading} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            isLoading={isLoading}
            isDisabled={isLoading}
            color={"white"}
            bgColor={"red"}
            ml={3}
            onClick={() => updatedRate._id && handleUpdateRate(updatedRate._id.toString(), updatedRate)}
            _hover={useColorModeValue(
              { backgroundColor: "gray", color: "white" },
              { backgroundColor: "white", color: "red" }
            )}
          >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
