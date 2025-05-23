import { Box, HStack, Text, useColorModeValue, Heading, Menu, MenuButton, IconButton, MenuItem, MenuList, MenuDivider, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, Button, useDisclosure, VStack, Textarea } from '@chakra-ui/react'
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

const RateCard = ({ rate }: Props) => {

    const [updatedRate, setUpdatedRate] = useState(rate);

    const handleStarsChange = (stars: number) => {
        setUpdatedRate({ ...updatedRate, stars });
    };

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

    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

    const bgInputs = useColorModeValue("gray.100", "blackAlpha.300");

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

            <ImageGame rate={rate} h={196} w={135}/>

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

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
                size={"3xl"}
            >
                <ModalOverlay />
                <ModalContent paddingInline={6}>
                    <ModalHeader textAlign={"center"}>Editar avaliação</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={2}>
                        <Box display={"flex"} justifyContent={"start"} h={"full"} alignItems={"center"} flexDirection={{base: "column", sm: "row"}} gap={10}>
                            <ImageGame w={260} rate={updatedRate}/>
                            <VStack w={"full"} h={"full"} alignItems={{base: "center", sm: "start"}} spacing={6}>

                                <Heading textAlign={{base: "center", sm: "start"}} fontSize={24}>{updatedRate.game}</Heading>
                                
                                <RateStars rating={updatedRate.stars} onRate={handleStarsChange} />

                                <Textarea
                                    name='comment'
                                    placeholder='Seu comentário sobre o jogo'
                                    value={updatedRate.comment}
                                    w={"full"}
                                    h={40}
                                    bg={bgInputs}
                                    onChange={(e) => setUpdatedRate({ ...updatedRate, comment: e.target.value })}
                                    maxLength={500}
                                />
                            </VStack>
                        </Box>
                    </ModalBody>

                    <ModalFooter paddingBlock={6} alignSelf={"end"}>
                        <Button isDisabled={isLoading} onClick={onClose}>Cancel</Button>
                        <Button
                            isLoading={isLoading}
                            isDisabled={isLoading}
                            color={"white"}
                            bgColor={"red"}
                            ml={3}
                            onClick={() => { rate._id && handleUpdateRate(rate._id.toString(), updatedRate) }}
                            _hover={useColorModeValue({ backgroundColor: "gray", color: "white" },
                                { backgroundColor: "white", color: "red" })}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </Box>
    )
}

export default RateCard