// import 'normalize.css';
// import './main.css';
// import $ from 'jquery';

// import './index.html';

// const monitorEle = $('.monitor');

// setInterval(() => {
//     let heiht = monitorEle.height();
//     // let contentEle = $('<p>啦啦啦啦啦啦啦啦啦啦啦啦</p>');
//     let divEle = $('<p></p>');
//     monitorEle.append(divEle);
//     typeit(divEle, '实打实大师大师多所');
//     monitorEle.scrollTop(heiht);
// }, 1000);

// function typeit(ele, str) {
//     var $ele = ele,
//         // str = $ele.html(),
//         progress = 0;
//     // $ele.html('');
//     var timer = setInterval(function () {
//         var current = str.substr(progress, 1);
//         if (current == '<') {
//             progress = str.indexOf('>', progress) + 1;
//         } else {
//             progress++;
//         }
//         $ele.html(str.substring(0, progress));
//         if (progress >= str.length) {
//             clearInterval(timer);
//         }
//     }, 30);
// }