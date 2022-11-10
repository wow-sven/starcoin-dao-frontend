import React, {useState} from 'react';
import {
    Flex,
    Button,
    FormControl,
    Input,
    InputGroup,
    InputLeftAddon,
    NumberInput,
    NumberInputField,
    useToast,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Select, Box, useDisclosure, Stack,
} from '@chakra-ui/react';

import {AiOutlineCaretDown, AiFillSetting} from 'react-icons/ai';
import {MdSettings} from 'react-icons/md'
import {RiSettings3Line} from 'react-icons/ri';

import {useForm} from 'react-hook-form';
import MainViewLayout from '../components/mainViewLayout';
import TextBox from '../components/TextBox';
import {Action, StakeParams} from "../utils/memberPluginAPI";
import ListStake from "../components/listStake";
import FormItems from "../components/formItems";

const From = (props) => {

    return (<FormControl id={props.name} mb={4}>
        <InputGroup>
            <InputLeftAddon bg='transparent' w='16%'>
                <TextBox size='sm'>
                    {props.title}
                </TextBox>
            </InputLeftAddon>
            {props.type == "number" ?
                <NumberInput w='100%' defaultValue={props.defaultValue}>
                    <NumberInputField
                        ref={props.reg}
                        name={props.name}
                        borderTopStartRadius='0'
                        borderBottomStartRadius='0'
                    />
                </NumberInput> :
                <Input ref={props.reg}
                       defaultValue={props.defaultValue}
                       placeholder={props.title + "..."}
                       name={props.name}/>
            }
        </InputGroup>
    </FormControl>)
}

const puposes = ['stc', 'apt', 'sui'];
const Proposal = () => {

    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit} = useForm();
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [action, setAction] = useState<StakeParams>({
        amount: 0n,
        lock_time: 0n,
    });

    const onSubmit = async data => {
        setLoading(true);

        setAction(data);

//        await createUpgradeProposal(data)

        setLoading(false);

        toast({
            title: 'Tips',
            description: "create upgrade proposa success",
            status: 'success',
            duration: 3000,
            position: 'top-right',
            isClosable: true,
        })
    }

//    const values = Object.values(action)
//    Object.keys(action).forEach((v, i) => {
//        let name = ""
//        v.split("_").forEach((v, i) => {
//            name += i > 0 ? " " + v : v
//        })
//
//        name = name[0].toUpperCase() + name.substring(1, name.length)
//        const s = typeof values[i]
//
//        console.log(s)
//    })

    const ctaButton = (
        <Flex spacing='4' direction='row'>
            <Button
                mb='4'
                size='md'
                iconSpacing='0'
                rightIcon={<RiSettings3Line/>}
                title={'Setting'}
                onClick={onOpen}
            />
            <Button
                ml='4'
                iconSpacing='0'
                rightIcon={<RiSettings3Line/>}
                title={'Setting'}
                onClick={onOpen}
            />
        </Flex>
    );

    return (
        <MainViewLayout
            header='Stake SBT'
            headerEl={ctaButton}
        >


            <Flex direction='row' w='100%' margin='0 auto'>


                <Flex direction='column' w='60%'>
                    {
                        /*<Flex direction='row' w='100%' spacing='10' margin='0 auto'>
                            <Button>筛选</Button>
                            <Button>筛选</Button>
                            <Button>筛选</Button>
                        </Flex>*/
                    }
                    <ListStake/>
                </Flex>

                <Flex w='5%'/>


                <Flex direction='column' w='35%'>
                    <FormItems obj={action} onSubmit={() => {
                        console.log("aa")
                    }}/>

                </Flex></Flex>

        </MainViewLayout>
    );
}

export default Proposal;