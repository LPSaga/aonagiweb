declare const window: any;

import { ethers } from 'ethers';
import { setupNetwork } from './web3';
import { MetaMaskSDK } from '@metamask/sdk';
import { useAccountStore } from '../stores/web3';
import { EthWalletState } from '../stores/web3';
import { ChainConfig } from '../config';
// this.ethWalletType = 'none' // metamask, okx, none
// this.ethConnectState = EthWalletState.Disconnect
// this.ethConnectAddress = ''

const providerDetails: any = []
let mmSdk: any;
let provider: any;
let providerInfo: any;
let accounts: any = []
let initialized = false

export const isMetaMaskInstalled = () => provider && (provider.isMetaMask || provider.isOkxWallet || provider.isOKExWallet || provider.isOKx || provider.isCoinbaseWallet);
export const isMetaMaskConnected = () => accounts && accounts.length > 0;
export const isInitinalized = () => initialized;
export const getProviders = () => providerDetails;
export const getProvider = () => provider ?? useAccountStore().provider
export const getProviderInfo = () => providerInfo

// 搜索浏览器安装的evm钱包，添加到钱包列表
const detectEip6963 = () => {
    window.addEventListener('eip6963:announceProvider', (event: any) => {
      if (event.detail.info.uuid) {
        handleNewProviderDetail(event.detail);
        initialized = true;
      }
    });
    window.dispatchEvent(new Event('eip6963:requestProvider'));
};

// 链接手机端metamask钱包
export const setMetaMaskSDK = async () => {
    mmSdk = new MetaMaskSDK({
        checkInstallationImmediately: true,
        dappMetadata: {
            name: 'AON',
            url: 'https://aon.com'
        }
    });
    const accounts = await mmSdk.connect();
    provider = mmSdk.getProvider();
    useAccountStore().provider = provider;
    providerInfo = {
        name: 'MetaMask',
        icon: 'https://docs.metamask.io/img/metamask-logo.svg',
        uuid: 'metamask'
    }
    
    handleNewAccounts(accounts);
}

// 连接到用户选择的钱包
export const setActiveProviderDetail = (providerDetail: any) => {
    try {
        useAccountStore().ethConnectState = EthWalletState.Connecting
        provider = providerDetail.provider;
        useAccountStore().provider = provider;
        providerInfo = providerDetail.info;
        initializeProvider();
    } catch (error) {
        useAccountStore().ethConnectState = EthWalletState.Disconnect
        console.error(error)
    }
};

// 连接钱包
export const initializeProvider = async () => {
    if (isMetaMaskInstalled()) {
        // 监听钱包的切换地址事件
        provider.on('accountsChanged', handleNewAccounts);
        try {
            const newAccounts = await provider.request({
                method: "eth_requestAccounts"
            });
            if (!newAccounts || newAccounts.length === 0) {
                console.error('read wallet accoutn fail', newAccounts)
                useAccountStore().ethConnectState = EthWalletState.Disconnect
            }
            useAccountStore().ethconnectAddress = newAccounts[0];
            useAccountStore().ethConnectState = EthWalletState.Connected
            handleNewAccounts(newAccounts);
        } catch (e) {
            console.error('Error on init when getting accounts', e);
            useAccountStore().ethConnectState = EthWalletState.Disconnect
        }
    }else {
        console.error('not plugin installed')
    }
}

// 切换链和读取用户地址
export const setup = async () => {
    await setupNetwork(provider ?? useAccountStore().provider)
}
  
const existsProviderDetail = (newProviderDetail: any) => {
    const existingProvider = providerDetails.find(
        (providerDetail: any) =>
        providerDetail.info &&
        newProviderDetail.info &&
        providerDetail.info.uuid === newProviderDetail.info.uuid,
    );

    return existingProvider;
};

const handleNewProviderDetail = (newProviderDetail: any) => {
    if (existsProviderDetail(newProviderDetail)) {
        return;
    }
    providerDetails.push(newProviderDetail);
};

// 当用户切换地址时
const handleNewAccounts = async (accounts: any) => {
    accounts = accounts
    useAccountStore().ethconnectAddress = accounts[0]
    // TODO 处理用户的地址变更逻辑，比如通知页面更新用户的地址显示和余额重新读取等
}

// 关闭钱包链接
export const closeProvider = () => {
    handleNewAccounts([]);
    provider.removeListener('accountsChanged', handleNewAccounts)
    provider = undefined;
}

// 获取用户ETH余额
export const getBalance = async (addr: string) => {
    // @ts-ignore
    if (!ethers.isAddress(addr)) return 0n;
    await setup();
    let eth = getProvider();
    const provider = new ethers.BrowserProvider(eth);
    const balance = await provider.getBalance(addr);
    // @ts-ignore
    useAccountStore().ethBalance = balance.toString() / 1e18;
    return balance;
}

// export const getTransactionReceipt = async (hash: string) => {
//     const provider = getProvider();
//     console.log('provider', provider);
//     const tx = await provider.getTransactionReceipt(hash);
//     return tx;
//   };

// api接口，初始化钱包
export async function initPlugin() {
    detectEip6963()
}

export const getReadOnlyProvider = () => {
    return new ethers.JsonRpcProvider(ChainConfig.rpc);
  };
  
export const getTransactionReceipt = async (hash: string) => {
    const provider = getReadOnlyProvider();
    const tx = await provider.getTransactionReceipt(hash);
    return tx;
};