import { Injectable } from '@angular/core';
import { ethers, providers } from 'ethers';
import { environment } from 'src/environments/environment';
import { Contract, Web3Provider, Provider } from "zksync-web3";

@Injectable({
    providedIn: 'root'
})
export class DefaultProviderService {
    ethereum: any;
    provider: any
    signer: any;
    constructor() {
        //this.provider = new ethers.providers.Web3Provider(this.ethereum, 'any')
        this.provider = new Provider(environment.jsonRpcUrl);
        this.signer = (new Web3Provider(window.ethereum)).getSigner();

    }

    async getBlockNumber() {
        const blockNumber = await this.provider.getBlockNumber();
        console.log('block number is: ', blockNumber);
    }
    async getNetwork() {
        const getNetwork = await this.provider.getNetwork;
        console.log(' Network is: ', getNetwork);
    }




}
