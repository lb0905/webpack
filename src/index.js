import _ from 'lodash';
import './assets/index.css'
function component() {
    const element = document.createElement('div');
    element.innerHTML = _.join(['hello', 'webpack'], ' ');
    return element
}

const i = require('./assets/images/asd.png');
const img = new Image();
img.src = i.default;



document.body.appendChild(component());
document.body.appendChild(img); // file-loader