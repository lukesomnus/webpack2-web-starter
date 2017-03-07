export default function (text = 'Hello world') {
    const element = document.createElement('div');

    element.className = 'pure-button';
    element.innerHTML = text;
    console.log(123);
    return element;
}