export const util = {
  ...jest.requireActual('lib/backend/apiMiddleware/util'),
  getUserId: jest.fn(),
}

module.exports = util
