import { Injectable } from '@angular/core';
import { BigNumber, ethers, providers, Signer, } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NetworkParams } from './network-params.interface';
import { Angweb3Config } from './angweb3-config.interface';
import { Contract, Web3Provider, Provider } from "zksync-web3";
//. zk greet contrat address  0xD1a274651175769088cD300461874109013147BB
declare global {
    interface Window {
        ethereum: any;
    }
}
@Injectable({
    providedIn: 'root'
})
export class WalletProviderService {

    provider: any;
    ethereum: any;
    signer: Signer;

    currentAccount
    currentNetwork: NetworkParams
    currentConfig: Angweb3Config;

    syncWallet: any;
    syncProvider: any;
    syncConnected: boolean;

    connectedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    accountSubject: BehaviorSubject<any> = new BehaviorSubject(null)
    networkSubject: BehaviorSubject<any> = new BehaviorSubject(null)

    constructor() {
        this.initializeNetworkConnection()
    }
    async connect(): Promise<boolean> {
        try {
            let ethereum = await detectEthereumProvider();
            console.log('ethereum = ', ethereum)
            if (ethereum) {
                await this.startApp(ethereum);

                return ethereum != undefined

            } else {
                return false
            }
        } catch (error) {
            console.error('unable to detect ethereum provider: ', error)
            return false
        }
    }

    isConnected(): boolean {
        return this.currentAccount != null && this.currentAccount != undefined
    }

    async startApp(ethereum: any) {

        this.provider = new ethers.providers.Web3Provider(ethereum, 'any')
        this.signer = await this.provider.getSigner()
        this.registerHandlers()
        if (ethereum.selectedAddress) {
            ethereum.enable();
            this.setCurrentAccount(ethereum.selectedAddress);

        } else {
        }

    }
    async szkConnect() {
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(async accounts => {
                if (+window.ethereum.networkVersion == 280) {
                    //  await this.connectMetaMask();

                }
            })
            .catch((e) => console.log(e));
        return true
    }
    async zkConnect() {


        try {
            await this.connect();
            this.provider = new Provider('https://zksync2-testnet.zksync.dev');
            console.log("zk connect provider", this.provider);
            // Note that we still need to get the Metamask signer

            this.signer = (new Web3Provider(window.ethereum)).getSigner();
            console.log("zk connect signer", this.signer);
            const balance = await this.signer.getBalance();
            console.log("zk connect getBalance", balance);
            if (this.signer) {


                return true

            } else {
                return false
            }
        } catch (error) {
            console.error('unable to detect ethereum provider: ', error)
            return false
        }

    }

    async addNetwork() {
        if (!this.provider || !this.currentNetwork) {
            return
        }
        console.log('about to add: ', this.currentNetwork)
        this.provider
            .send(
                'wallet_addEthereumChain',
                [this.currentNetwork]
            )
            .catch((error: any) => {
                console.log(error)
            })
    }

    async addToken(address: string, symbol: string, decimals: number, image?: string) {
        this.provider
            .send(
                'wallet_watchAsset',
                {
                    type: 'ERC20',
                    options: {
                        address,
                        symbol,
                        decimals,
                        image
                    },
                })
            .then((success) => {
                if (success) {
                    console.log('successfully added to wallet!');
                } else {
                    throw new Error('Something went wrong.');
                }
            })
            .catch(console.error);
    }

    async getAccounts() {
        if (!this.provider) {
            return null;
        }

        console.log('getting accounts')
        const accounts = await this.signer.getAddress();
        if (accounts.length > 0) {
            this.setCurrentAccount(accounts)
        } else {
            let accounts = await this.enableEthereum()
            if (accounts.length > 0) {
                this.setCurrentAccount(accounts)
            } else {
                this.setCurrentAccount(null)
            }
        }
        this.signer = this.provider.getSigner()
        console.log('signer is now ', this.signer)
        return accounts
    }
    getUserAccountAddressSubject() {
        return this.accountSubject.asObservable();
    }
    getaccountSubject() {
        return this.accountSubject.asObservable();
    }
    getnetworkSubject() {
        return this.networkSubject.asObservable();
    }
    async disconnect() {
        // not the right call
        // await this.ethereum.disconnect()
    }

    async checkBalance(): Promise<BigNumber | BigNumber> {
        if (this.currentAccount) {
            return await this.provider.getBalance(this.currentAccount)
        } else {
            return BigNumber.from(0)
        }
    }

    async balanceIsOver(value: BigNumber): Promise<boolean | boolean> {
        if (this.currentAccount) {
            const balance: BigNumber = await this.provider.getBalance(this.currentAccount)
            console.log(`Balance=${balance}, value=${value}`)
            return balance.gt(value) // must be strictly > to account for gas cost.
        } else {
            return false
        }
    }

    async enableEthereum(): Promise<any> {
        return await this.provider.enable()
    }

    private async registerHandlers() {
        console.log('registering handlers');
        this.provider.on('connect', this.handleAccountConnected.bind(this));
        this.provider.on('disconnect', this.handleAccountDisconnected.bind(this));
        this.provider.on('network', this.handledChainChanged.bind(this));
        this.provider.on('accountsChanged', this.handleAccountChanged.bind(this));
        this.provider.on('chainChanged', (_chainId: string) => window.location.reload());
    }

    private handleAccountConnected(accounts) {
        console.log('>>> Account connected: ', accounts)
    }

    private handleAccountDisconnected(accounts) {
        console.log('>>> Account disconnected: ', accounts)
    }

    private handledChainChanged(network) {
        console.log('>>> Chain changed to: ', network)
        this.networkSubject.next(this.getHexString(network.chainId))
    }

    private handleAccountChanged(accounts) {
        if (accounts.length > 0) {
            this.setCurrentAccount(accounts[0])
        } else {
            this.setCurrentAccount(null)
        }
        console.log('>>> Account changed to: ', accounts)
    }

    private setCurrentAccount(account: string | null) {
        this.currentAccount = account
        this.accountSubject.next(account)
    }

    private initializeNetworkConnection() {
        let eth: any = this.ethereum
        if (eth) {
            let hexVersion = this.getHexString(eth.networkVersion)
            console.log('current network version is: ', hexVersion)
            this.handledChainChanged(hexVersion)
        } else {
            console.log('no ethereum')
        }
        let cNetwork: NetworkParams = environment.config.networkParams
        if (cNetwork && cNetwork.chainId) {
        }
        this.currentNetwork = cNetwork
        this.currentConfig = environment.config
        this.zkConnect();
    }

    private getHexString(networkCode) {
        return `0x${(+networkCode).toString(16)}`
    }

    currencyName(): string {
        return environment.config.networkParams.nativeCurrency.symbol
    }
    async getBalance(address: string) {
        const balanceInUnits = await this.signer.getBalance(address);
        // To display the number of tokens in the human-readable format, we need to format them,
        // e.g. if balanceInUnits returns 500000000000000000 wei of ETH, we want to display 0.5 ETH the user
        return ethers.utils.formatUnits(balanceInUnits, address);

        const balance = await this.provider.getBalance(address);
        console.log(' balance is: ', balance);
    }


    onboard() { }
}
