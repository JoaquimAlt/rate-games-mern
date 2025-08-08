import { IconButton, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Props {
    placeholder: string,
    value: string,
    name: string,
    bgColor: string,
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined
}

const InputPassword = ({placeholder, name, value, bgColor, onChange}: Props) => {

    const [showPassword, setShowPassword] = useState(false);

    const handleClick = () => {
        if (showPassword === true){
            setShowPassword(false);
        } else {
            setShowPassword(true);
        }
    }

    return (
        <InputGroup>
            <Input
                placeholder={placeholder}
                type={showPassword ? 'text' : 'password'}
                name={name}
                value={value}
                onChange={onChange}
                bgColor={bgColor}
            />
            <InputRightElement>
                <IconButton aria-label='visibilidade' variant={'ghost'} onClick={handleClick}>
                    {showPassword ? <FaEye/> : <FaEyeSlash />}
                </IconButton>
            </InputRightElement>
        </InputGroup>
    )
}

export default InputPassword

