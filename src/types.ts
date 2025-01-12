


export type TokenHoldingList = {
    contract: string,
    name: string,
    ticker: string,
    supply: bigint,
    listed: boolean,
    balance: number
  }

export type UserTokenInfo = {
    contract: string,
    supply: bigint,
    balance: number,
    ethBalance: number,
    listed: boolean
}