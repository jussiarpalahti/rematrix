

//import React from 'react';
import * as React from "react";

interface Props {
    foo: string;
}

export default class Tyyppi extends React.Component<Props, {}> {
    render() {
        return <span>This coming with types: {this.props.foo}</span>
    }
}

function main() {
    var app = document.createElement('div');
    document.body.appendChild(app);

    React.render(<div id="app">
        <h1>React Typed Table Viewer</h1>
        <Tyyppi foo="hih" />
    </div>, app);
}

main();
