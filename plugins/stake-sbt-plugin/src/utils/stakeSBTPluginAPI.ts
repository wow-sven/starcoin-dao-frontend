import {utils, bcs} from "@starcoin/starcoin"
import {hexlify} from '@ethersproject/bytes'
import {callContract, getProvder} from "./stcWalletSdk";
import {nodeUrlMap} from "./consts";
import {uint128, uint64} from "@starcoin/starcoin/dist/src/lib/runtime/serde";

export type Types = {
    dao_type: string,
    plugin_type: string,
}

export interface StakeParams extends Types {
    amount: uint128,
    lock_time: uint64
}

export function newStakeParams(): StakeParams {
    return {
        dao_type: "-",
        plugin_type: "-",
        amount: 0n,
        lock_time: 0n
    }
}

export async function stakeSBT(params: StakeParams): Promise<string> {

    const functionId = '0x1::StakeToSBTPlugin::stake_entry'
    const tyArgs = [params.dao_type, params.plugin_type]
    const args = [params.amount, params.lock_time]

    return await callContarctWithSigner(functionId, tyArgs, args)
}

export interface UnstakeParams extends Types {
    id: string,
}

export function nweUnstakeParams(): UnstakeParams {
    return {
        dao_type: "",
        plugin_type: "",
        id: ""
    }
}

export async function unstakeSBT(params: UnstakeParams): Promise<string> {

    const functionId = '0x1::StakeToSBTPlugin::unstake_by_id_entry'
    const tyArgs = [params.dao_type, params.plugin_type]
    const args = [params.id]

    return await callContarctWithSigner(functionId, tyArgs, args)
}

export async function unstakeAllSBT(params: Types): Promise<string> {

    const functionId = '0x1::StakeToSBTPlugin::unstake_all_entry'
    const tyArgs = [params.dao_type, params.plugin_type]

    return await callContarctWithSigner(functionId, tyArgs, [])
}

//export interface queryStakeCount extends DaoType {
//    id:string
//}

// TODO: 拿到数据后再来弄分页
export type QueryStakeTypeResult = {
    title: string
    type: string
}

export async function queryStakeType(): Promise<Array<QueryStakeTypeResult>> {

    const result = await window.starcoin.request({
        method: 'state.list_resource',
        params: [
            '0x1',
            {
                resource_types: [
//                    '0x1::Config::Config<0x1::StakeToSBTPlugin::LockWeightConfig>',
                    '0x1::Config::ModifyConfigCapabilityHolder<0x1::StakeToSBTPlugin::LockWeightConfig<0x00000000000000000000000000000001::StarcoinDAO::StarcoinDAO>'
                ],
                decode: true,
                start_index: 0,
                max_size: 100
            }
        ]
    })
    
    console.log(result)

    let type = new Array<QueryStakeTypeResult>()

    for (let key in result.resources) {

        const tmp = key.split(",")

        const daoType = tmp[0].split("::")

        type = type.concat({
            type: tmp[1].replace(">>", "").trim(),
            title: tmp[1].replace(">>", "").trim().split("::")[2],
        })
    }

    console.log(type);

    return type

}

export async function queryStakeCount(): Promise<number> {

    const functionId = '0x1::StakeToSBTPlugin::query_stake_count'

    return callContract(functionId, [], [window.starcoin.selectedAddress])
}

export async function queryStakeList(): Promise<Array<any>> {

    const result = await window.starcoin.request({
        method: 'state.list_resource',
        params: [
            '0x1',
            {
                resource_types: [],
                decode: true,
                start_index: 0,
                max_size: 0
            }
        ]
    })

    console.log(result)

    return result
}

export interface createTokenAcceptProposalParams extends Types {
    info: {
        title: string,
        introduction: string,
        extend: string,
    }
    propsal: {
        action_delay: uint64,
    }
}

export function newCreateTokenAcceptProposalParams(): createTokenAcceptProposalParams {

    return {
        dao_type: "-",
        plugin_type: "",
        info: {
            title: "",
            introduction: "",
            extend: ""
        },
        propsal: {
            action_delay: 0n
        },
    }
}

export async function createTokenAcceptProposal(params: createTokenAcceptProposalParams): Promise<string> {
    const functionId = '0x1::StakeToSBTPlugin::create_token_accept_proposal_entry'
    const tyArgs = [params.dao_type, params.plugin_type]
    const args = [
        params.info.title,
        params.info.introduction,
        params.info.extend,
        params.propsal.action_delay,
    ]
    console.log("createMemberProposal tyArgs:", tyArgs)
    console.log("createMemberProposal args:", args)

    return await callContarctWithSigner(functionId, tyArgs, args)
}

export async function executeTokenAcceptProposal(types: Types, proposalId: string): Promise<string> {
    const functionId = buildFunctionId("execute_token_accept_proposal")
    const tyArgs = [types.dao_type, types.plugin_type]
    const args = [proposalId]

    console.log("executeMemberProposal tyArgs:", tyArgs);
    console.log("executeMemberProposal args:", args);

    return await callContarctWithSigner(functionId, tyArgs, args);
}

export interface createWeightProposalParams extends Types {
    info: {
        title: string,
        introduction: string,
        extend: string,
    }
    sbt: {
        lock_time: uint64,
        weight: uint64,
    }
    propsal: {
        action_delay: uint64,
    }
}

export function newCreateWeightProposalParams(): createWeightProposalParams {
    return {
        dao_type: "-",
        plugin_type: "-",
        info: {
            title: "",
            introduction: "",
            extend: "",
        },
        sbt: {
            lock_time: 0n,
            weight: 0n,
        },
        propsal: {
            action_delay: 0n,
        }
    }
}

export async function createWeightProposal(params: createWeightProposalParams): Promise<string> {
    const functionId = '0x1::StakeToSBTPlugin::create_weight_proposal_entry'

    const tyArgs = [params.dao_type, params.plugin_type]
    const args = [
        params.info.title,
        params.info.introduction,
        params.info.extend,
        params.sbt.lock_time,
        params.sbt.weight,
        params.propsal.action_delay,
    ]

    console.log("createMemberProposal tyArgs:", tyArgs)
    console.log("createMemberProposal args:", args)

    return await callContarctWithSigner(functionId, tyArgs, args)
}

export async function executeWidgthProposal(types: Types, proposalId: string): Promise<string> {
    const functionId = buildFunctionId("execute_weight_proposal_entry")
    const tyArgs = [types.dao_type, types.plugin_type]
    const args = [proposalId]

    console.log("executeMemberProposal tyArgs:", tyArgs);
    console.log("executeMemberProposal args:", args);

    return await callContarctWithSigner(functionId, tyArgs, args);
}

export async function callContarctWithSigner(functionId, tyArgs, args): Promise<string> {
    try {

        const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(functionId, tyArgs, args, nodeUrlMap[window.starcoin.networkVersion])

        // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
        const payloadInHex = (function () {
            const se = new bcs.BcsSerializer()
            scriptFunction.serialize(se)
            return hexlify(se.getBytes())
        })()

        const txParams = {
            data: payloadInHex,
            expiredSecs: 10
        }

        const starcoinProvider = await getProvder()

        return await starcoinProvider.getSigner().sendUncheckedTransaction(txParams)

    } catch (error) {
        throw error
    }
}

function buildFunctionId(name: string): string {
    return "0x1::StakeToSBTPlugin::" + name
}