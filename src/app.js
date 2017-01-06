// import moment from 'moment';
//
// var rightNow = moment().format();
//
// console.log(rightNow);
import styles from './styles/bar.css';
console.log(styles.bar);
// document.getElementsByTagName('body')[0].append= styles.bar;
if(ISDEV){
  // require('./index.html');

  console.log('ss12232ssss');
  require('./html/index.pug');
  require('./index.html');
}

if (module.hot) {
  module.hot.accept();
  }
