import { Image, Box, Spinner, useColorModeValue } from "@chakra-ui/react";
import type IRate from '../types/Rate';

import NotImage from "../assets/not-image.png";

interface Props {
    rate: IRate;
    h?: number;
    w?: number;
}

const ImageGame = ({ rate, h = 280, w = 190 }: Props) => {
    return (
        <Box
            h={h}
            w={w}
            minH={180}
            minW={130}
            bgColor={useColorModeValue("gray.100", "gray.900")}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            borderRadius="md"
            overflow="hidden"
            
        >
            <Image
                src={rate.image || NotImage}
                fallbackSrc={NotImage}
                fallback={<Spinner size="md" />}
                alt={rate.game || "Imagem do jogo"}
                objectFit="cover"
                w={"full"}
                h={"full"}
                borderRadius="md"
            />
        </Box>
    );
};

export default ImageGame;
