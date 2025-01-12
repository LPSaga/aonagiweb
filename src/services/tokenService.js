import { config } from '../config';
import { TokenServiceImpl } from './implementations/TokenServiceImpl';
import { MockTokenServiceImpl } from './implementations/MockTokenServiceImpl';

function createTokenService() {
  return config.features.useMock
    ? new MockTokenServiceImpl()
    : new TokenServiceImpl();
}

export const TokenService = createTokenService();
