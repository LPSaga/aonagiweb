import { ethers } from "ethers";
const BaseChainId = 8453
const rpc = 'https://mainnet.base.org/'

export const setupNetwork = async (ethereum: any) => {
  try {
    const chainInfo = await ethereum.request({
      method: "eth_chainId",
    });
    if (parseInt(chainInfo) == BaseChainId) { // base chain id
      return true;
    }

    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: `0x${BaseChainId.toString(16)}`,
        },
      ],
    });
  } catch (error: any) {
    if (error.code === 4001) return;
    if (error.code === -32002) return;

    try {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${BaseChainId.toString(16)}`,
            chainName: 'Base chain',
            rpcUrls: [rpc],
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              icon: "https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png",
              decimals: 18,
            },
            blockExplorerUrls: ['https://basescan.org/'],
          },
        ],
      });
      return true;
    } catch (error) {
      console.log("setup chain fail", error);
    }
  }
};

export const getReadOnlyProvider = () => {
  return new ethers.JsonRpcProvider(rpc);
};

export const getTransactionReceipt = async (hash: string) => {
  const provider = getReadOnlyProvider();
  const tx = await provider.getTransactionReceipt(hash);
  return tx;
};

export const getBalance = async (ethAddr: string) => {
  const provider = getReadOnlyProvider();
  const balance = await provider.getBalance(ethAddr);
  return balance
}