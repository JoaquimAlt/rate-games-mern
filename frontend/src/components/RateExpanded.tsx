import { Box, HStack, Text, useColorModeValue, Heading, Menu, MenuButton, IconButton, MenuItem, MenuList, MenuDivider, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Input, ModalFooter, Button, useDisclosure, VStack, Textarea } from '@chakra-ui/react'
import type IRate from '../types/Rate'
import { FaStar } from 'react-icons/fa'
import { VscKebabVertical } from "react-icons/vsc"
import { MdEdit, MdDelete } from "react-icons/md"
import { useRateStore } from '../store/rate'
import React, { useState } from 'react'
import { RateStars } from './RateStars'
import ImageGame from './ImageGame'
import { useUserStore } from '../store/user'

interface Props {
    rate: IRate
}

const RateExpanded = ({ rate }: Props) => {

    const [updatedRate, setUpdatedRate] = useState(rate);

    const handleStarsChange = (stars: number) => {
        setUpdatedRate({ ...updatedRate, stars });
    };

    const { updateRate, deleteRate } = useRateStore();

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

    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

    const bgInputs = useColorModeValue("gray.100", "blackAlpha.300");

    return (
        <Box
            position={"relative"}
            display={"flex"}
            flexDirection={"row"}
            alignItems={"start"}
            w={"full"}
            h={"auto"}
            pb={8}
            gap={8}
            textAlign={"center"}
            overflow={"hidden"}
        >

            <ImageGame rate={rate} h={230} w={220}/>

            <Box display={"flex"} flexDirection={"column"} w={"full"} marginRight={12} gap={4} textAlign={"start"}>
                <Heading wordBreak={"break-all"} fontSize={20}>
                    {rate.game}
                </Heading>
                <HStack gap={1}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} color={star <= rate.stars ? "red" : "gray"} />
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
                <Box position={"absolute"} right={0.5}>
                    <Menu>
                        <MenuButton as={IconButton} icon={<VscKebabVertical />} aria-label='Options' variant={"outline"} />
                        <MenuList>
                            <MenuItem onClick={onOpen} icon={<MdEdit size={15} />}>
                                Editar avaliação
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={() => { rate._id && handleDeleteRate(rate._id.toString()) }} icon={<MdDelete size={15} />}>
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

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
                size={"xl"}
            >
                <ModalOverlay />
                <ModalContent paddingInline={6}>
                    <ModalHeader textAlign={"center"}>Editar avaliação</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={2}>
                        <HStack spacing={10}>
                            <ImageGame rate={updatedRate} />
                            <VStack alignItems={"center"} spacing={6}>

                                <Input ref={initialRef}
                                    name='image'
                                    placeholder='URL da capa do jogo'
                                    value={updatedRate.image}
                                    bg={bgInputs}
                                    onChange={(e) => setUpdatedRate({ ...updatedRate, image: e.target.value })}
                                />

                                <Input ref={initialRef}
                                    name='game'
                                    placeholder='Nome do jogo'
                                    value={updatedRate.game}
                                    bg={bgInputs}
                                    onChange={(e) => setUpdatedRate({ ...updatedRate, game: e.target.value })}
                                    required={true}
                                />

                                <RateStars rating={updatedRate.stars} onRate={handleStarsChange} />

                                <Textarea
                                    name='comment'
                                    placeholder='Seu comentário sobre o jogo'
                                    value={updatedRate.comment}
                                    bg={bgInputs}
                                    onChange={(e) => setUpdatedRate({ ...updatedRate, comment: e.target.value })}
                                />
                            </VStack>
                        </HStack>
                    </ModalBody>

                    <ModalFooter paddingBlock={6} alignSelf={"end"}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            color={"white"}
                            bgColor={"red"}
                            ml={3}
                            onClick={() => { rate._id && handleUpdateRate(rate._id.toString(), updatedRate) }}
                            _hover={useColorModeValue({ backgroundColor: "gray", color: "white" },
                                { backgroundColor: "white", color: "red" })}>
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </Box>
    )
}

export default RateExpanded