import { defineStore } from "pinia";

export enum EthWalletState {
    Disconnect,
    Connected,
    Connecting
}

export const useAccountStore = defineStore('account', {
    state () {
        return {
            ethBalance: 0,
            ethWalletType: '',
            ethConnectState: EthWalletState.Disconnect,
            ethconnectAddress: '',
            provider: null as any
        }
    }
})