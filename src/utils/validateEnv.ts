import { cleanEnv, port, str } from 'envalid';

// 这段代码的作用是检查环境变量的正确性。
// 首先，它使用了`envalid`库来定义了两个环境变量：`NODE_ENV`和`PORT`。
// `NODE_ENV`应该是一个字符串，而`PORT`应该是一个数字。
// 然后，它使用`cleanEnv`函数来检查这两个变量是否已经定义，并且其类型是否正确。
// 如果检查通过，函数将不会返回任何值。如果检查失败，函数将抛出一个错误。
// 这段代码的作用是保证我们的应用程序在运行时能够正确地获取到所需的环境变量。
export const ValidateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
  });
};
