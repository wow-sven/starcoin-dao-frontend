import React, {useEffect, useState} from 'react'
import {
    Flex,
    Button,
    useToast, Heading,
} from '@chakra-ui/react'

import {MdAdd} from 'react-icons/md'
import {GoSettings} from 'react-icons/go'

import {useHistory} from 'react-router-dom'

import ListStake from "../components/listStake"
import MainViewLayout from '../components/mainViewLayout'
import {queryStakeCount, queryStakeList, unstakeSBT, nweUnstakeParams} from "../utils/stakeSBTPluginAPI"
import TextBox from "../components/TextBox";
import {cache} from "webpack";

const HomePage = () => {

    const toast = useToast()
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [stakeCount, setStakeCount] = useState(0)
    const [listData, setListData] = useState<any>()

    useEffect(() => {
        queryStakeCount()
            .then((v) => {
                setStakeCount(v)
                queryStakeList().then(setListData)
            })
            .catch(e => console.log(e))
            .finally(() => setLoading(false))
    }, [])

    const unStake = async (id) => {
        try {
            await unstakeSBT(nweUnstakeParams())
            toast({
                title: 'Tips',
                description: "create upgrade proposa success",
                status: 'success',
                duration: 3000,
                position: 'top-right',
                isClosable: true,
            })
        } catch (e) {
            console.log("haha")
        }
    }

    return (
        <MainViewLayout
            header='Stake SBT List'
            headerEl={
                <Flex direction='row'>
                    <Button
                        size='md'
                        rightIcon={<MdAdd/>}
                        title='Stake'
                        onClick={() => {
                            history.push(`/stake`)
                        }}
                    >
                        Stake
                    </Button>
                    <Button
                        ms='4'
                        rightIcon={<GoSettings/>}
                        title='Setting'
                        onClick={() => {
                            history.push(`/setting`)
                        }}
                    >
                        Setting
                    </Button>
                </Flex>
            }
        >
            {
                loading && listData
                    ?
                    <Flex direction='column'>
                        <Heading margin='0 auto'>You haven't stake.</Heading>
                        <TextBox margin='0 auto' mt={4}>
                            Welcome 👏 Let's get stared.
                        </TextBox>
                        <Button
                            w='15%'
                            margin='0 auto'
                            mt={6}
                            onClick={() => {
                                history.push(`/stake`)
                            }}
                        >
                            Stake Your First SBT
                        </Button>
                    </Flex>
                    :
                    <ListStake data={listData} onItemClick={unStake}/>
            }

        </MainViewLayout>
    )
}

export default HomePage;