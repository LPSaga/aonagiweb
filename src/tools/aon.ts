import { ethers } from 'ethers'
import { getContract, ContractAddress } from './contract';
import { getTransactionReceipt } from './wallets'
import { abis } from './abis'
import { aggregate } from '@makerdao/multicall'
import { ChainConfig, WETH, uniswapV2Router02 } from '@/config'
import { useAccountStore } from '../stores/web3';

export const calculateInitEth = async (amount: bigint) => {
    amount = amount / 100n;
    const contract = await getContract('AON');
    const needEth = await contract.getBuyPriceAfterFee(0, amount);
    return needEth
}

export const checkTickUsed = async (tick: string) => {
    const contract = await getContract('AON');
    const created = await contract.createdTicks(tick);
    return created
}

export const createCoin = async (createForm: any) => {
    const contract = await getContract('AON');
    let tx: any = await contract.createToken(createForm.name, createForm.ticker, {
        value: createForm.initEth + ethers.parseEther('0.04')
    });
    console.log('tx hash:', tx.hash)
    await tx.wait();

    const hash = tx.hash;
    tx = await getTransactionReceipt(hash);
    const event: any = getCreateTokenEventByHash(tx);
    // name, tick, instance, tx.origin
    if (event && event.length == 4 && event[0] == createForm.name && event[1] == createForm.ticker) {
        return {token: event[2], createHash: hash}
    }
    return {createHash: hash};
}

export const getTokenInfoAndBalance = async (tokens: string[]) => {
    tokens = tokens.filter(ethers.isAddress)
    if (tokens.length == 0) {
        return;
    }
    tokens = [...new Set(tokens)]
    const accStore = useAccountStore()
    let calls: any = [];
    for (let token of tokens) {
        calls = calls.concat([{
            target: token,
            call: [
                'name()(string)'
            ],
            returns: [
                [token + '-name']
            ]
        },
        {
            target: token,
            call: [
                'symbol()(string)'
            ],
            returns: [
                [token + '-symbol']
            ]
        },
        {
            target: token,
            call: [
                'bondingCurveSupply()(uint256)'
            ],
            returns: [
                [token + '-supply']
            ] 
        },
        {
            target: token,
            call: [
                'listed()(bool)'
            ],
            returns: [
                [token + '-listed']
            ] 
        },
        {
           target: token,
           call: [
            'balanceOf(address)(uint256)',
            accStore.ethconnectAddress
           ] ,
           returns: [
            [token + '-balance', (val: any) => val / 1e18]
           ]
        }])
    }
    const result = await aggregate(calls, ChainConfig.multiConfig);
    let tokenInfo: any = {}
    for (let token of tokens) {
        tokenInfo[token] = {
            contract: token,
            name: result.results.transformed[token+'-name'],
            ticker: result.results.transformed[token+'-symbol'],
            supply: result.results.transformed[token+'-supply'],
            listed: result.results.transformed[token+'-listed'],
            balance: result.results.transformed[token+'-balance'],
        }
    }
    return tokenInfo
}

export const buyToken = async (token: string, amount: bigint, ethAmount: bigint, slippage = 0, listed = false) => {
    if (!ethers.isAddress(token)) throw 'Token contract error';
    if (listed) {
        const router = await getContract('UniswapRouter');
        const tx = await router.swapExactETHForTokens(
            amount * BigInt(slippage) / 10000n,
            [WETH, token],
            useAccountStore().ethconnectAddress,
            Math.floor(Date.now() / 1000) + 300,
            {
                value: ethAmount
            }
        )
        
        await tx.wait();
        return tx.hash;
    }else {
        const tc = await getContract('Token', token)
        const tx = await tc.buyToken(amount, slippage, ethers.ZeroAddress, {
            value: ethAmount
        })
        await tx.wait();
        return tx.hash;
    }
}

export const sellToken = async (token: string, amount: bigint, receiveEth: bigint, slippage = 0, listed = false) => {
    if (!ethers.isAddress(token)) throw 'Invalid token address';

    const tc = await getContract('Token', token)
    if (listed) {
        // checkout approve
        const allowance = await tc.allowance(useAccountStore().ethconnectAddress, uniswapV2Router02);
        if (allowance < amount) {
            const res = await tc.approve(uniswapV2Router02, ethers.MaxInt256);
            await res.wait();
        }
        const router = await getContract('UniswapRouter');
        const tx = await router.swapExactTokensForETH(
            amount,
            receiveEth * BigInt(slippage) / 10000n,
            [token, WETH],
            useAccountStore().ethconnectAddress,
            Math.floor(Date.now() / 1000) + 300
        )
        await tx.wait();
        return tx.hash;
    }else {
        const tx = await tc.sellToken(amount, receiveEth, slippage);
        await tx.wait();
        return tx.hash;
    }
}

export const getBuyAmountWithETHAfterFee = async (supply: bigint, ethAmount: bigint) => {
    const aon = await getContract('AON');
    const receive = await aon.getBuyAmountByValue(BigInt(supply), ethAmount);
    return receive;
}

export const getReceivedAmountSellETHAfterFee = async (supply: bigint, amount: bigint) => {
    const aon = await getContract('AON');
    const receive = await aon.getSellPriceAfterFee(BigInt(supply), amount);
    return receive
}

export const getBuyAmountUseEth = async (token: string, ethAmount: bigint) => {
    let contract = await getContract('UniswapRouter');
    const amount = await contract.getAmountsOut(ethAmount, [WETH, token]);
    return amount[1];
}

export const getSellAmountUseToken = async (token: string, tokenAmount: bigint) => {
    let contract = await getContract('UniswapRouter');
    const amount = await contract.getAmountsOut(tokenAmount, [token, WETH]);
    return amount[1];
}

export const getUserTokenInfo = async (token: string, ethAddr: string) => {
    let calls = [
        {
            target: token,
            call: [
                'balanceOf(address)(uint256)',
                ethAddr
            ],
            returns: [
                ['balance', (val: any) => val.toString() / 1e18]
            ]
        },
        {
            target: token,
            call: [
                'bondingCurveSupply()(uint256)'
            ],
            returns: [
                ['supply']
            ]
        },
        {
            target: token,
            call: [
                'listed()(bool)'
            ],
            returns: [
                ['listed']
            ]
        },
        {
            call: [
              'getEthBalance(address)(uint256)', 
              ethAddr
            ],
            returns: [['ethBalance', (val: any) => val / 10 ** 18]]
          }
    ]
    const res = await aggregate(calls, ChainConfig.multiConfig);
    return res.results.transformed;
}

const getCreateTokenEventByHash = (tx: any) => {
    let contract = new ethers.Contract(ContractAddress['AON'], abis.AON)
    let event;
    tx.logs.forEach((log: any) => {
        try {
            const parsedLog = contract.interface.parseLog(log);
            if (parsedLog && parsedLog.name === 'NewToken') {
                event = parsedLog.args
            }
        } catch (error) {
            console.error(error)
        }
    });
    return event
}