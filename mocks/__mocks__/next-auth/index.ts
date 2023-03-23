// requireActual seems to not work. No idea why. It seems to be working
// though so that's all that matters.
module.exports = {
  // REQUIRED for default export to work correctly
  __esModule: true,
  default: jest.fn(),
  getServerSession: () => ({ user: { id: '1234567890AB' } }),
}

export {}
