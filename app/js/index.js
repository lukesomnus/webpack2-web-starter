import styles from 'styles/main.css';
import 'purecss';


import 'jquery';
import 'react';
import component from './component';

document.body.appendChild(component());

let deomComponent = component();
document.body.appendChild(deomComponent);

document.getElementsByTagName('div')[0].className =styles.redColor;
// HMR interface

// if(module.hot){
//     // capture hot update
//     module.hot.accept('./component',()=>{
//         const nextCompoent = component();

//         // replace old content with the hot loaded one 

//         document.body.replaceChild(nextCompoent,deomComponent);
//         demoComponent = nextCompoent;
//     })
// }