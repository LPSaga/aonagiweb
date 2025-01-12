import { getProvider, setup } from "./wallets";
import { abis } from './abis'
import { ethers } from 'ethers'
import { uniswapV2Router02 } from '@/config'

export const ContractAddress = {
    // AON: '0xa6C9A05ae2c04faAF7A0b8F755821df55202b2b7',
    AON: '0xC8f7B5d8e1CCA8475a9677afDE15840C70D77190',
    UniswapRouter: uniswapV2Router02
}

export const getContract = async (contractName: string, address?: string): Promise<any> => {
    let provider = getProvider();
    await setup()
    // @ts-ignore
    const abi = abis[contractName]

    provider = new ethers.BrowserProvider(provider)
    
    if (!provider || !abi) {
        throw 'no provider'
    }

    if (!address) {
        // @ts-ignore
        address = ContractAddress[contractName]
    }
    const contract = new ethers.Contract(address!, abi, provider);
    return contract.connect(await provider.getSigner())

}