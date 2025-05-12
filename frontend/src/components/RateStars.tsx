import { HStack, IconButton } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

interface Props {
    rating: number,
    onRate: (stars: number) => void
}

export const RateStars: React.FC<Props> = ({ rating, onRate }) => {
  return (
    <HStack gap={1}>
      {[1, 2, 3, 4, 5].map((star) => (
        <IconButton
          key={star}
          aria-label={`Rate ${star} star`}
          onClick={() => onRate(star)}
          color={star <= rating ? "red.600" : "gray.300"}
          variant="ghost"
          size="lg"
        >
        <FaStar/> 
        </IconButton>
      ))}
    </HStack>
  );
};
