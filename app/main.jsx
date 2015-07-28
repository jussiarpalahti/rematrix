import React from 'react';
import MatrixTable from './components/matrix_table.jsx';
import './stylesheets/main.css';
import lodash from 'lodash';
var _ = lodash;

import {Table, generate_headers} from '../app/lib/utils';

main();

function main() {

    let testtable = {
        heading: ['one', 'two', 'three'],
        stub: ['first', 'second'],

        matrix: _.range(8).map((i) => [1,2,3,4,5,6,7,9,10,11,i+1]),

        levels: {
            one: ['top heading 1', 'top heading 2'],
            two: ['second heading 1', 'second heading 2', 'second heading 3'],
            three: ['third heading 1', 'third heading 2'],
            first: ['top row 1', 'top row 2'],
            second: ['second row 1', 'second row 2', 'second row 3', 'second row 4']
        },
        hopper : {
            one: [
                {header : 'top heading 1', place: 1},
                {header : 'top heading 2', place: 7}
            ]
        }
    };

    testtable.meta = Table(testtable);
    console.log(testtable);

    var app = document.createElement('div');
    document.body.appendChild(app);

    React.render(<div>
        <h1>React Table Viewer</h1>
        <MatrixTable table={testtable} />
        </div>, app);
}
