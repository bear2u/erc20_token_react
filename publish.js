var ghpages = require('gh-pages');

ghpages.publish('build_webpack', {    
    repo: 'https://github.com/bear2u/erc20_token_react.git'
  }, err => {
    console.log(err);
  });