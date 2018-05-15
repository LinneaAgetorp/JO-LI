import { render } from 'react-dom';

import app from './App';
// ...

app(component => render(component, document.getElementById('root')));