

// base main net
export const ChainConfig = {
    name: "Base",
    rpc: 'https://mainnet.base.org/',
    chainId: 8453,
    symbol: 'ETH',
    browser: 'https://basescan.org/',
    decimals: 18,
    multiConfig: {
        rpcUrl: 'https://mainnet.base.org/',
        multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
        interval: 3000
    }
}

export const WETH = '0x4200000000000000000000000000000000000006';
export const uniswapV2Factory = '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6';
export const uniswapV2Router02 = '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24';

export const config = {
    api: {
        baseUrl: 'https://aon.dexian.io'
    },
    features: {
        useMock: false
    }
};