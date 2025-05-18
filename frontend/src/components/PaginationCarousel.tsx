import { HStack, IconButton, Input } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { useGameStore } from '../store/game';

const PaginationCarousel = () => {

    const [page, setPage] = useState(1);

    const { fetchPopularGames } = useGameStore();

    useEffect(()=>{
        fetchPopularGames(page.toString());
    }, [page])

  return (
    <HStack maxW={150}>
        <IconButton 
            aria-label='back' 
            icon={<IoIosArrowBack />} 
            onClick={() => setPage(page - 1)}
            isDisabled={page === 1}
        />

            <Input
                type={"number"} 
                value={page} 
                onChange={(e) => {
                    let value = Number(e.target.value);
                    value = Math.max(1, Math.min(50, value));
                    setPage(value);
                }}
            />

        <IconButton 
            aria-label='back' 
            icon={<IoIosArrowForward />} 
            onClick={() => setPage(page + 1)}
            isDisabled={page >= 50}
        />

    </HStack>
  )
}

export default PaginationCarousel