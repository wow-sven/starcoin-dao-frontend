import React from 'react';

import {
    Button,
    List,
    ListItem,
    ListIcon,
    Flex,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'

import {MdCheckCircle, MdSettings} from 'react-icons/md'

const ListStake = (props) => {
    return (
        !props.data ?
        <TableContainer>
            <Table variant='simple'>
                <TableCaption>Imperial to metric conversion factors</TableCaption>
                <Thead>
                    <Tr>
                        <Th>id</Th>
                        <Th>创建时间</Th>
                        <Th>类型</Th>
                        <Th>额度</Th>
                        <Th>时长</Th>
                        <Th>截止时间</Th>
                        <Th>SBT</Th>
                        <Th>操作</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>0xB028e8Be3372e805DC85175742dCa6c5</Td>
                        <Td>2022-11-1</Td>
                        <Td>STC</Td>
                        <Td >25.4</Td>
                        <Td >3000 (m)</Td>
                        <Td >2022-12-1</Td>
                        <Td >25.4</Td>
                        <Td ><Button>赎回</Button></Td>
                    </Tr>

                </Tbody>
            </Table>
        </TableContainer>
            :
            <Flex mt='100px' w='100%' justify='center'>
                No Offer.
            </Flex>
    )
}


export default ListStake