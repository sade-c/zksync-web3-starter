// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  ZKNETWORK: "https://rinkeby-api.zksync.io/jsrpc",
  IPFS_GATEWAY: "https://ipfs.io/ipfs/",
  ZK_EXPLORER: "https://ropsten.zkscan.io/explorer/transactions/",
  ETH_EXPLORER: "https://ropsten.etherscan.io/tx/",
  ZK_WALLET: "https://wallet.zksync.io/",
  environmentName: 'Avalanche Testnet C-Chain',
  jsonRpcUrl: 'https://ropsten.infura.io/v3/9c3496dd968d444c8449af5e09168512',
  config: {
    contracts: {
      USDC: '',
      mUSDC: '',
      WrappedNative: '',
      Faucet: '',
      Greeter: "0x2b7Ca997504485BFA6dDED203A25F8aAFc9496A8",
    },
    networkParams: {
      chainId: '0xA869',
      chainName: 'Avalanche Testnet C-Chain',
      nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18
      },
      rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
      blockExplorerUrls: ['https://testnet.snowtrace.io/']
    },
    ui: {
      chainName: 'Avalanche',
      logo: '/assets/logos/avalanche-avax-logo.png',
      txUrlPrefix: 'https://testnet.snowtrace.io/tx/'
    }
  },
}
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
