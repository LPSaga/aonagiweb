import { HttpService } from '../base/httpService';

export class CommentServiceImpl extends HttpService {
  async postComment(data) {
    try {
      return await this.post('/comment/post', data);
    } catch (error) {
      console.error('Failed to post comment:', error);
      throw error;
    }
  }

  async listComments(token) {
    try {
      const params = { token };
      return await this.get('/comment/list', { params });
    } catch (error) {
      console.error('Failed to list comments:', error);
      throw error;
    }
  }
}
