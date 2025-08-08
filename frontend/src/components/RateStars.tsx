import { HStack, IconButton } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { useState } from "react";

interface Props {
  rating: number;
  onRate: (stars: number) => void;
}

export const RateStars: React.FC<Props> = ({ rating, onRate }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <HStack gap={1}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = hovered !== null ? star <= hovered : star <= rating;

        return (
          <IconButton
            key={star}
            aria-label={`Rate ${star} star`}
            onClick={() => onRate(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            icon={<FaStar />}
            color={isActive ? "red" : "gray.300"}
            variant="ghost"
            size="lg"
          />
        );
      })}
    </HStack>
  );
};
