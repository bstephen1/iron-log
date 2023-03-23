After hours and hours of wrangling with jest to get the mocks to work,
I've finally been successful. I would not recommend changing this pattern
unless there is very good reason to, because this is a huge rabbit hole to 
dive into. 

Basically, next-auth causes huge issues with jest mocks. Anything in the 
pages folder will need to mock out next-auth. 

The jest devs are bizarrely stridently opinionated that every mock must
be located in a __mocks__ folder adjacent to the file being mocked. This 
pattern is frankly unacceptable because it causes huge bloat. There is 
a workaround in that jest does allow you to label a second root directory
which you can use to place a __mocks__ folder, but this ONLY works for
node_modules mocks. 

So, that's what this folder is for. To activate jest.config.ts must have:
  roots: ['<rootDir>', '<rootDir>/mocks']
And __mocks__ subfolders must mimic the path used for the desired import.

Note also that it's more desireable to mock node_modules rather than our own
modules, because node_modules mocks are automatically activated, but for 
our own modules we still need to call jest.mock() in every test file for 
jest to read from __mocks__.


See: 
https://github.com/facebook/jest/issues/2726
https://jestjs.io/docs/configuration#roots-arraystring