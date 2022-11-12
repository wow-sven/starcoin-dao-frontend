import {providers} from "@starcoin/starcoin"
import {getLocalNetwork} from "./localHelper";
import {Web3Provider} from "@starcoin/starcoin/dist/src/providers";

export async function requestAccounts() {
    return await window.starcoin.request({
        method: 'stc_requestAccounts',
    })
}

export async function getAccounts() {

    return await window.starcoin.request({
        method: 'stc_accounts',
    })
}

export async function getProvder() {
    const network = getLocalNetwork() || "main"
    return new providers.Web3Provider(window.starcoin, network);
}

//export function callRPC(function_id: string,
//                        address: string,) {
//
//}

export function callContract(function_id: string, type_args: any[], args: any[]): Promise<number> {

    console.log(getProvder())

    return getProvder.callV2({
        function_id,
        type_args,
        args,
    });
}

export function isValidateAddress(address: string) {
    const pattern = /^0x[0-9a-fA-F]{32}$/g;
    return pattern.test(address);
}