import { HttpService } from '../base/httpService';

export class TokenServiceImpl extends HttpService {
  async getTokenList() {
    try {
      return await this.get('/token/list');
    } catch (error) {
      console.error('Failed to fetch token list:', error);
      throw error;
    }
  }

  async getTokenByContract(contract) {
    try {
      return await this.get(`/token/${contract}`);
    } catch (error) {
      console.error(`Failed to fetch token details for contract ${contract}:`, error);
      throw error;
    }
  }

  async createToken(tokenData) {
    try {
      return await this.post('/token/create', tokenData);
    } catch (error) {
      console.error('Failed to create token:', error);
      throw error;
    }
  }

  async getRecentTransactions(token) {
    try {
      return await this.get(`/tx/recently?token=${token}`);
    } catch (error) {
      console.error('Failed to fetch recent transactions:', error);
      throw error;
    }
  }

  async getRelatedTokens(token) {
    try {
      return await this.get(`/token/related?token=${token}`);
    } catch (error) {
      console.error('Failed to fetch related tokens:', error);
      throw error;
    }
  }

  async getTopHolders(token) {
    try {
      return await this.get(`/token/holder?token=${token}`);
    } catch (error) {
      console.error('Failed to fetch top holders:', error);
      throw error;
    }
  }

  async getTokenDetail(contract) {
    try {
      return await this.get(`/token/detail?contract=${contract}`);
    } catch (error) {
      console.error('Failed to fetch token detail:', error);
      throw error;
    }
  }

  async addAgentId(agentAppId) {
    try {
      return await this.post('/token/addAgentId', { agentAppId });
    } catch (error) {
      console.error('Failed to add agent ID:', error);
      throw error;
    }
  }

  async getKlineData(token) {
    try {
      return await this.get(`/tx/kline?token=${token}`);
    } catch (error) {
      console.error('Failed to fetch Kline data:', error);
      throw error;
    }
  }

  async getDigest24h(token) {
    try {
      return await this.get(`/digest/24h?token=${token}`);
    } catch (error) {
      console.error('Failed to fetch 24h digest:', error);
      throw error;
    }
  }
}
