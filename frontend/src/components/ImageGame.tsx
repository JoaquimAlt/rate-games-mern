import { useState } from 'react';
import { Image,  Box, Spinner, Center } from "@chakra-ui/react";
import type IRate from '../types/Rate';

import NotImage from "../assets/not-image.png";

interface Props {
    rate: IRate;
    h?: number;
    w?: number;
}

const ImageGame = ({ rate, h = 280, w = 190 }: Props) => {
    const [imgError, setImgError] = useState(false);
    const [imgLoading, setImgLoading] = useState(true);

    return (
        <Box
            h={h}
            w={w}
            bgColor={"gray.900"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            borderRadius="md"
            overflow="hidden"
        >
            {imgLoading && !imgError && (
                <Box>
                    <Center>
                        <Spinner size="md" />
                    </Center>
                </Box>
            )}

            <Image
                src={rate.image}
                alt={rate.game}
                objectFit="cover"
                w="100%"
                h="100%"
                borderRadius="md"
                onLoad={() => setImgLoading(false)}
                onError={(e) => {
                    setImgError(true);
                    setImgLoading(false);
                    e.currentTarget.src = NotImage;
                }}
                display={imgLoading ? "none" : "block"}
            />
        </Box>
    );
};

export default ImageGame;
