import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import Greeter from '../artifacts/Greeter.json'

import { environment } from '../../environments/environment';
import { DefaultProviderService } from '../shared/providers/default-provider.service';
import { WalletProviderService } from '../shared/providers/wallet-provider.service';
import { ProviderErrors } from '../shared/model/eip1193/providerErrors';
import { Contract, Web3Provider, Provider, utils } from "zksync-web3";

@Injectable({
    providedIn: 'root'
})
export class GreeterService {

    greeterContract: any

    constructor(public provider: DefaultProviderService, private wallet: WalletProviderService, private http: HttpClient) {
        this.greeterContract = new ethers.Contract(
            wallet.currentConfig.contracts.Greeter,
            Greeter.abi,
            provider.provider
        );
    }



    async greet() {
        let greet = await this.greeterContract.greet();
        return greet;
    }
    async setGreeting(greeting: string) {
        const txHandle = await this.greeterContract.connect(this.provider.signer).setGreeting(greeting, await this.getOverrides(greeting));

    }

    async getOverrides(greeting: string) {


        console.log("0")
        const testnetPaymaster = "0x2e4805d59193e173c9c8125b4fc8f7f9c7a3a3ed";
        console.log("1", testnetPaymaster)
        console.log("1")
        const gasPrice = await this.wallet.provider.getGasPrice();
        const gasLimit = await this.greeterContract.estimateGas.setGreeting(greeting);
        const fee = gasPrice.mul(gasLimit);
        console.log("2")
        console.log("2", fee)
        const paymasterParams = utils.getPaymasterParams(testnetPaymaster, {
            type: 'ApprovalBased',
            token: "0x2e4805d59193e173c9c8125b4fc8f7f9c7a3a3ed",
            minimalAllowance: fee,
            innerInput: new Uint8Array(0)
        });
        console.log("3")
        console.log("3", paymasterParams)
        return {
            maxFeePerGas: gasPrice,
            maxPriorityFeePerGas: ethers.BigNumber.from(0),
            gasLimit,
            customData: {
                ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT,
                //paymasterParams
            }
        };



    }
}
