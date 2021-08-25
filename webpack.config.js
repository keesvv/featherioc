module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './lib/index.ts',
  output: {
    filename: 'index.js',
    globalObject: 'this',
    library: {
      name: 'featherioc',
      type: 'umd',
    },
  },
  resolve: {
    extensions: ['.ts'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
