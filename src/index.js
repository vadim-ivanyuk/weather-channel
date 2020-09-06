import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import WebFont from 'webfontloader';
import 'swiper/swiper-bundle.css';

WebFont.load({
  google: {
    families: ['Roboto', 'Open Sans']
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

serviceWorker.unregister();
