import { Box, HStack, Text, useColorModeValue, Heading, Menu, MenuButton, IconButton, MenuItem, MenuList, MenuDivider, useToast, useDisclosure } from '@chakra-ui/react'
import type IRate from '../types/Rate'
import { FaStar } from 'react-icons/fa'
import { VscKebabVertical } from "react-icons/vsc"
import { MdEdit, MdDelete } from "react-icons/md"
import { useRateStore } from '../store/rate'
import { useState } from 'react'
import ImageGame from './ImageGame'
import { useUserStore } from '../store/user'
import { ModalEditRate } from './ModalEditRate'

interface Props {
    rate: IRate
}

const RateCard = ({ rate }: Props) => {

    const [updatedRate, setUpdatedRate] = useState(rate);

    const { updateRate, deleteRate, isLoading } = useRateStore();

    const toast = useToast();

    const handleUpdateRate = async (rid: string, updatedRate: IRate) => {
        const { success, msg } = await updateRate(rid, updatedRate);

        toast({
            title: success ? "Sucesso" : "Erro",
            description: success ? "Avaliação atualizada com sucesso!" : msg,
            status: success ? "success" : "error",
            duration: 3000,
            isClosable: true,
            position: "top",
        });

        onClose();
    }

    const handleDeleteRate = async (rid: string) => {
        const { success, msg } = await deleteRate(rid);

        toast({
            title: success ? "Avaliação deletada!" : "Erro ao deletar avaliação",
            description: msg,
            status: success ? "success" : "error",
            duration: 3000,
            isClosable: true,
            position: "top",
        });
    };

    const { user } = useUserStore();

    const isOwner = user && typeof rate.user === "object" && rate.user !== null && "username" in rate.user
        ? (rate.user as { username: string }).username === user.username
        : false;

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box
            position={"relative"}
            display={"flex"}
            flexDirection={"row"}
            alignItems={"start"}
            h={260}
            minW={"100px"}
            maxW={"md"}
            gap={8}
            shadow={"md"}
            rounded={"md"}
            p={8}
            bgColor={useColorModeValue("white", "gray.800")}
            textAlign={"center"}
            overflow={"hidden"}
        >

            <ImageGame rate={rate} h={196} w={135} />

            <Box display={"flex"} flexDirection={"column"} marginRight={12} gap={3} textAlign={"start"}>
                <Heading fontSize={20}>
                    {rate.game}
                </Heading>
                <HStack gap={1}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} color={star <= rate.stars ? "red" : "gray"} />
                    ))}
                </HStack>
                <Text maxW={150} as={"p"} noOfLines={4}>
                    {rate.comment}
                </Text>
            </Box>

            {isOwner &&
                <Box position={"absolute"} right={6}>
                    <Menu>
                        <MenuButton isDisabled={isLoading} as={IconButton} icon={<VscKebabVertical />} aria-label='Options' variant={"outline"} />
                        <MenuList>
                            <MenuItem isDisabled={isLoading} onClick={onOpen} icon={<MdEdit />}>
                                Editar avaliação
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem isDisabled={isLoading} onClick={() => { rate._id && handleDeleteRate(rate._id) }} icon={<MdDelete />}>
                                Excluir avaliação
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            }

            <Text position={"absolute"} bottom={2} right={3} fontSize={12} color={"gray.500"}>
                Feito por: {" "}
                {typeof rate.user === "object" && rate.user !== null && "username" in rate.user
                    ? (rate.user as { username: string }).username
                    : ""}
            </Text>

            <ModalEditRate
                isOpen={isOpen}
                onClose={onClose}
                isLoading={isLoading}
                updatedRate={updatedRate}
                setUpdatedRate={setUpdatedRate}
                handleUpdateRate={handleUpdateRate}
            />

        </Box>
    )
}

export default RateCard