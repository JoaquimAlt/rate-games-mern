import { Box, HStack, Text, useColorModeValue, Heading, Menu, MenuButton, IconButton, MenuItem, MenuList, MenuDivider, useToast, useDisclosure, Avatar, useBreakpointValue } from '@chakra-ui/react'
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
    rate: IRate,
    showimage?: boolean
}

const RateExpanded = ({ rate, showimage = false }: Props) => {

    const isMobile = useBreakpointValue({ base: true, md: false });

    const [updatedRate, setUpdatedRate] = useState(rate);

    const { updateRate, deleteRate, isLoadingRates } = useRateStore();

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
        })
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
            w={"full"}
            minH={"180px"}
            pb={10}
            gap={8}
            textAlign={"center"}
            overflow={"hidden"}
            onClick={() => {
                if (isMobile) {
                    onOpen();
                }
            }}

        >

            <HStack display={"flex"} gap={"4px"} as={"h4"} flexDirection={"row"} position={"absolute"} bottom={2} right={3} fontSize={12}>
                <Text color={"gray.500"}>
                    Feito por:
                </Text>
                <Text fontWeight={"bold"}>
                    {typeof rate.user === "object" && rate.user !== null && "username" in rate.user
                        ? (rate.user as { username: string }).username
                        : ""}
                </Text>
                <Avatar
                    name={
                        typeof rate.user === "object" && rate.user !== null && "username" in rate.user
                            ? (rate.user as { username: string }).username
                            : ""
                    }
                    src={
                        typeof rate.user === "object" && rate.user !== null && "profileImage" in rate.user
                            ? (rate.user as { profileImage?: string }).profileImage
                            : undefined
                    }

                    size={"xs"}
                />
                <Text color={"gray.500"}>
                    {rate.createdAt ? new Date(rate.createdAt).toLocaleDateString("pt-BR") : ""}
                </Text>
            </HStack>

            {showimage && <ImageGame rate={rate} h={230} w={220} />}

            <Box display={"flex"} flexDirection={"column"} w={"full"} marginRight={12} gap={4} textAlign={"start"}>
                <Heading wordBreak={"break-all"} fontSize={20}>
                    {rate.game}
                </Heading>
                <HStack gap={1}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar size={"20px"} key={star} color={star <= rate.stars ? "red" : "gray"} />
                    ))}
                </HStack>
                <Text
                    minW={50}
                    maxW={"full"}
                    wordBreak={"break-word"}
                    as={"p"}
                    color={useColorModeValue("gray.600", "gray.400")}
                    fontSize={"md"}
                >
                    {rate.comment}
                </Text>
            </Box>

            {isOwner &&
                <Box display={{ base: "none", md: "flex" }} position={"absolute"} right={0.5}>
                    <Menu>
                        <MenuButton as={IconButton} icon={<VscKebabVertical />} aria-label='Options' variant={"outline"} />
                        <MenuList>
                            <MenuItem isDisabled={isLoadingRates} onClick={onOpen} icon={<MdEdit size={15} />}>
                                Editar avaliação
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem isDisabled={isLoadingRates} onClick={() => { rate._id && handleDeleteRate(rate._id.toString()) }} icon={<MdDelete size={15} />}>
                                Excluir avaliação
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            }

            <ModalEditRate
                isOpen={isOpen}
                onClose={onClose}
                isLoading={isLoadingRates}
                updatedRate={updatedRate}
                setUpdatedRate={setUpdatedRate}
                handleUpdateRate={handleUpdateRate}
            />

        </Box>
    )
}

export default RateExpanded