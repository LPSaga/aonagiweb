import { mockTokenList } from '../../mock/tokenMock';
import { mockComments } from '../../mock/commentMock';

export class MockCommentServiceImpl {
  async postComment(symbol, comment) {
    console.log(`Mock postComment called with symbol: ${symbol}, comment: ${comment}`);
    return Promise.resolve({ status: 'success', message: 'Mock comment posted successfully' });
  }

  async listComments(token) {
    console.log(`Mock listComments called with token: ${token}`);
    return Promise.resolve(mockComments);
  }
}
