module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './lib/featherioc.ts',
  output: {
    filename: 'featherioc.js',
    globalObject: 'this',
    library: {
      name: 'featherioc',
      type: 'umd',
    },
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
