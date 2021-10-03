module.exports = {
  parser: 'babel-eslint',
  extends: ['next', 'prettier', 'plugin:tailwind/recommended'],
  env: {
    browser: true,
    es6: true,
  },
  rules: {
    'no-plusplus': ['off'],
    radix: ['off'],
    'tailwind/class-order': ['off'],
    'react/react-in-jsx-scope': ['off'],
    'react/jsx-filename-extension': ['off'],
    'react/prop-types': ['off'],
    'react/jsx-props-no-spreading': ['off'],
    'react/no-unescaped-entities': ['off'],
    'react/destructuring-assignment': ['off'],
    'jsx-a11y/anchor-is-valid': ['off'],
    'no-param-reassign': ['off'],
    'consistent-return': ['off'],
    'jsx-a11y/interactive-supports-focus': ['off'],
    'jsx-a11y/iframe-has-title': ['off'],
  },
};
