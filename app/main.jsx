import React from 'react';
import App from './components/App';
import './stylesheets/main.css';

main();

function main() {
    var app = document.createElement('div');
    document.body.appendChild(app);

    React.render(<div>
        <h1>React Table Viewer</h1>
        <App />
        </div>, app);
}
