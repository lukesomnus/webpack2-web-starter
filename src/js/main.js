require('../styles/foo.css');
require('../styles/bar.css');
require('./foo.js');
var moment = require('moment');

require.ensure([],function(require){
  require('../js/bar.js');
})
var a= 'main123';
console.log(moment().format());
foo();
