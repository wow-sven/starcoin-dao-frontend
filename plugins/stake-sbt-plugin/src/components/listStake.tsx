import React, {useState} from 'react'

import {
    Table,
    Thead,
    Tbody,
    Button,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer, Spinner,
} from '@chakra-ui/react'

import {Skeleton} from '@chakra-ui/react'

const title = [
    'id',
    '创建时间',
    '类型',
    '额度',
    '时长',
    '截止时间',
    'SBT',
    '操作',
]

const ListStake = (props) => {

    const [actionLoading, setActionLoading] = useState<Map<String, boolean>>(new Map())

    const onItemClick = (v) => {
        setActionLoading(new Map(actionLoading.set(v, true)))

        props.onItemClick('x').finally(() => {
            setActionLoading(new Map(actionLoading.set(v, false)))
        })
    }

    return (
        <TableContainer>
            <Table variant='simple'>
                <TableCaption>loading...</TableCaption>
                <Thead>
                    <Tr>
                        {
                            title.map((v, i) => (
                                <Th key={i.toString()}>{v}</Th>
                            ))
                        }
                    </Tr>
                </Thead>
                <Tbody>
                    {!props.data
                        ?
                        <Tr>
                            <Td>0xB028e8Be3372e805DC85175742dCa6c5</Td>
                            <Td>2022-11-1</Td>
                            <Td>STC</Td>
                            <Td>25.4</Td>
                            <Td>3000 (m)</Td>
                            <Td>2022-12-1</Td>
                            <Td>25.4</Td>
                            <Td>
                                <Button onClick={() => {
                                    onItemClick('x')
                                }}>
                                    {actionLoading['x'] ? <Spinner margin='0 auto'/> : "赎回"}
                                </Button>
                            </Td>
                        </Tr>
                        :
                        <Tr>
                            {
                                title.map((v, i) => (
                                    <Td key={i.toString()}>
                                        <Skeleton height='20px' isLoaded={props.data}/>
                                    </Td>
                                ))
                            }
                        </Tr>
                    }
                </Tbody>
            </Table>
        </TableContainer>
    )
}

export default ListStake