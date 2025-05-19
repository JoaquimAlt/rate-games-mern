import { Image, Box, Spinner, useColorModeValue } from "@chakra-ui/react";
import type IRate from '../types/Rate';

import NotImage from "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";

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
