import { Box, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const images = [
  "https://guildtag.com/images/landing/minecraft-banner-1.jpg",
  "https://gmedia.playstation.com/is/image/SIEPDC/the-crew-motorfest-hero-banner-desktop-01-en-30may23?$native$",
  "https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2025/04/donkey-kong-bananza-4310754.jpg?tf=3840x",
  "https://www.qualbert.com/wp-content/uploads/2022/03/Divider.png"
];

export const SimpleCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 20000); // troca a cada 3 segundos

    return () => clearInterval(timer); // limpa intervalo ao desmontar
  }, []);

  return (
  <Box display={{base: "none", md: "flex"}} position={"relative"} w={"full"} h={250} overflow={"hidden"} boxShadow={"md"}>
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`slide-${index}`}
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          objectFit="cover"
          opacity={index === currentIndex ? 1 : 0}
          transition="opacity 0.5s ease-in-out"
          zIndex={index === currentIndex ? 1 : 0}
        />
      ))}
    </Box>
  );
};
