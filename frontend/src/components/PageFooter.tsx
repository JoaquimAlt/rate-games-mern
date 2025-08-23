import { HStack, Text, VStack } from '@chakra-ui/react'

import { FaGamepad } from "react-icons/fa6";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { Link } from 'react-router-dom';



export default function PageFooter() {
    return (
        <footer>
            <HStack alignItems={"flex-start"} spacing={40} justifyContent={"center"} w={"full"} p={10} mt={40} bgGradient={"linear(to-r, red.500, red)"}>
                <VStack alignItems={"flex-start"}>
                    <HStack>
                        <Text fontSize={22} fontWeight={"bold"}>RateGames</Text>
                        <FaGamepad size={20} />
                    </HStack>
                    <Text>© Todosos direitos reservados</Text>
                </VStack>

                <VStack alignItems={"flex-start"}>
                    <Text fontSize={22} fontWeight={"bold"}>Contate-nos</Text>
                    <HStack spacing={3}>
                        <Link target='_blank' to={"https://www.linkedin.com/in/joaquim-neto-047993241/"}>
                            <FaLinkedin size={30} />
                        </Link>
                        <Link target='_blank' to={"https://www.instagram.com/joaquimnetofs/"}>
                            <FaInstagram size={30} />
                        </Link>
                        <Link target='_blank' to={"https://github.com/JoaquimAlt"}>
                            <FaGithub size={30} />
                        </Link>
                        <Link to='mailto:rategamesmern@gmail.com'>
                            <IoMdMail size={30} />
                        </Link>
                    </HStack>
                </VStack>
            </HStack>
        </footer>
    )
}
