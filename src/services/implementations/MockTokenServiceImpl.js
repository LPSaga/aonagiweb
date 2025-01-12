import { mockTokenDetail, mockTokenList } from '../../mock/tokenMock';
import { mockTransactions } from '../../mock/transactionMock';
import { mockTopHolders } from '../../mock/topHoldersMock';

export class MockTokenServiceImpl {
  async getTokenList() {
    return Promise.resolve(mockTokenList);
  }

  async getTokenByContract(contract) {
    return Promise.resolve(mockTokenList.find(token => token.contract === contract));
  }

  async createToken(tokenData) {
    return Promise.resolve({ status: 'success', message: 'Mock token created successfully' });
  }

  async getRecentTransactions(contract) {
    console.log(`Mock getRecentTransactions called with contract: ${contract}`);
    return Promise.resolve(mockTransactions);
  }

  // 需要中转一下数据~
  async getRelatedTokens(token) {
    console.log(`Mock getRelatedTokens called with token: ${token}`);
    return Promise.resolve([1, 2, 3]);
  }

  async getTopHolders(token) {
    console.log(`Mock getTopHolders called with token: ${token}`);
    return Promise.resolve(mockTopHolders);
  }

  async getTokenDetail(contract) {
    console.log(`Mock getTokenDetail called with contract: ${contract}`);
    return Promise.resolve(mockTokenDetail);
  }

  async addAgentId(agentAppId) {
    console.log(`Mock addAgentId called with agentAppId: ${agentAppId}`);
    return Promise.resolve({ code: 0, msg: 'success' });
  }

  async getKlineData(token) {
    console.log(`Mock getKlineData called with token: ${token}`);
    return Promise.resolve([
      [
        1499040000000,
        0.01634790,
        0.80000000,
        0.01575800,
        0.01577100,
        148976.11427815,
        1499644799999,
        2434.19055334,
        308,
        1756.87402397,
        28.46694368
      ]
    ]);
  }
}
