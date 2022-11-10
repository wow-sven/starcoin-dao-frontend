import {utils, bcs} from "@starcoin/starcoin"
import {hexlify} from '@ethersproject/bytes'
import {getProvder} from "./stcWalletSdk";
import {nodeUrlMap} from "./consts";
import {uint64} from "@starcoin/starcoin/dist/src/lib/runtime/serde";

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

export type Action = {
    info: {
        title: string,
        introduction: string,
        description: string,
    }
    propsal: {
        action_delay: uint64,
    }
    package: {
        hash: string,
        version: uint64,
        enforced: boolean,
    }
}

export async function createUpgradeProposal(action: Action): Promise<string> {
    const functionId = '0x1::UpgradeModulePlugin::create_proposal_entry'
    const tyArgs = []
    const args = [
        action.info.title,
        action.info.introduction,
        action.info.description,
        action.propsal.action_delay,
        action.package.hash,
        action.package.version,
        action.package.enforced
    ]

    console.log("createMemberProposal tyArgs:", tyArgs)
    console.log("createMemberProposal args:", args)

    return await callContarctWithSigner(functionId, tyArgs, args)
}

export async function executeUpgradeProposal(proposalId: string): Promise<string> {
    const functionId = '0x1::UpgradeModulePlugin::execute_proposal_entry'
    const tyArgs = []
    const args = [proposalId]

    console.log("executeMemberProposal tyArgs:", tyArgs);
    console.log("executeMemberProposal args:", args);

    return await callContarctWithSigner(functionId, tyArgs, args);
}

