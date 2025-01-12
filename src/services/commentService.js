import { config } from '../config';
import { CommentServiceImpl } from './implementations/CommentServiceImpl';
import { MockCommentServiceImpl } from './implementations/MockCommentServiceImpl';

function createCommentService() {
  return config.features.useMock
    ? new MockCommentServiceImpl()
    : new CommentServiceImpl();
}

export const CommentService = createCommentService();
