var $ = require('zepto');
var _ = require('underscore');
var Efte = require('efte');

var IndexPage = module.exports;

IndexPage.init = function () {
  Efte.action.get(function (query) {
    console.log('query: ', query);
    alert('query: \n' + JSON.stringify(query));
  });
};
