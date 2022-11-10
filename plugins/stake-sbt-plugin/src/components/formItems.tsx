import {
    Button,
    Flex,
    FormControl,
    Input,
    InputGroup,
    InputLeftAddon,
    NumberInput,
    NumberInputField
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";

import React, {
    useEffect,
    useState
} from 'react';
import TextBox from "./TextBox";

enum ItemType {
    Title,
    Input,
}

type Item = {
    title: string
    name: string
    defaultValue: any
    valueType: string
    type: ItemType
}

const parseTitle = (title) => {

    let nTitle = ""

    title.split("_").forEach((v, i) => {
        nTitle += i > 0 ? "" + v : v
    })

    return nTitle[0].toUpperCase() + nTitle.substring(1, nTitle.length)
}

const parseItems = (obj) => {
    const keys = Object.keys(obj)
    let items = Array<Item>()
    Object.values(obj).forEach((v, i) => {

        let valueTypee = typeof v

        if (valueTypee === "object") {
            let sub = parseItems(v)
            items = items.concat(keys[i] === "obj" ? sub : [{
                title: parseTitle(keys[i]),
                name: keys[i],
                defaultValue: "",
                valueType: "",
                type: ItemType.Title
            }, ...sub])
        } else {
            items = items.concat({
                title: parseTitle(keys[i]),
                name: keys[i],
                defaultValue: v,
                valueType: typeof valueTypee,
                type: ItemType.Input
            })
        }
    })

    return items
}

const FormItems = (props) => {

    const {register, handleSubmit} = useForm();
    const [items, setItems] = useState<Array<any>>([])

    useEffect(() => {
        setItems([...parseItems(props.obj)])
    }, [props.obj])

    return (
        <Flex
            as='form'
            onSubmit={handleSubmit(props.onSubmit)}
            direction='column'>
            {
                items.map((v, i) => {
                    return v.type === ItemType.Title
                        ? <TextBox key={i.toString()} size='xs' mb={2} mt={2}>
                            {v.title}
                        </TextBox>
                        : <FormControl key={i.toString()} id={v.name} mb={4}>
                            <InputGroup>
                                <InputLeftAddon bg='transparent' w='16%'>
                                    <TextBox size='sm'>
                                        {v.title}
                                    </TextBox>
                                </InputLeftAddon>
                                {v.valueType == "number" ?
                                    <NumberInput w='100%' defaultValue={v.defaultValue}>
                                        <NumberInputField
                                            ref={register({required: true})}
                                            name={v.name}
                                            borderTopStartRadius='0'
                                            borderBottomStartRadius='0'
                                        />
                                    </NumberInput> :
                                    <Input ref={register({required: true})}
                                           defaultValue={v.defaultValue}
                                           placeholder={v.title + "..."}
                                           name={v.name}/>
                                }
                            </InputGroup>
                        </FormControl>
                })
            }

            <Button type='submit' my={4}>
                Submit
            </Button>

        </Flex>
    )
}

export default FormItems

