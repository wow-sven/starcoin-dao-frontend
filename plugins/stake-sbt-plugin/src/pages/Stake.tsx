import React, {useEffect, useState} from 'react';
import {
    Box,
    useToast,
} from '@chakra-ui/react';

import MainViewLayout from '../components/mainViewLayout';
import FormItems from "../components/formItems";
import Back from "../components/back";
import {
    queryStakeType,
    QueryStakeTypeResult,
    newStakeParams,
    stakeSBT
} from "../utils/stakeSBTPluginAPI";
import {useDao} from '../contexts/DaoContext';
import AutoCompleteInputWidget from "../components/autoCompleteInput";

const Stake = () => {

    const {dao} = useDao();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const [tokenTypeOptions, setTokenTypeOptions] = useState<Array<QueryStakeTypeResult>>([])
    const [tokenType, setTokenType] = useState("")

    useEffect(() => {
        setLoading(true)

        queryStakeType().then((v) => {
            setTokenTypeOptions([...v])
            setLoading(false)
        }).catch(e => {
            setLoading(false)
        })
    }, [])

    const onSubmit = async data => {
        setLoading(true);

        stakeSBT({
            ...data,
            dao_type: dao.daoType,
            plugin_type: tokenType
        }).then(() => {
            setLoading(false)
            toast({
                title: 'Tips',
                description: "create upgrade proposa success",
                status: 'success',
                duration: 3000,
                position: 'top-right',
                isClosable: true,
            })
        }).catch(e => {
            setLoading(false)
            console.log(e)
        })
    }

    return (
        <MainViewLayout
            header='Stake SBT'
            headerEl={Back('Back')}
        >
            <Box w='50%' margin='0 auto'>

                <AutoCompleteInputWidget
                    options={tokenTypeOptions.map(v => v.type)}
                    onChange={setTokenType}
                />

                <FormItems obj={newStakeParams()} loading={loading} onSubmit={onSubmit}/>
            </Box>
        </MainViewLayout>
    )
}

export default Stake;