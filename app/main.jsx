import React from 'react';
import MatrixTable from './components/matrix_table.jsx';
import './stylesheets/main.css';
import lodash from 'lodash';
var _ = lodash;

import {Table, generate_headers, create_header_hopper} from '../app/lib/utils';

main();

function main() {

    let testtable = {
        heading: ['one', 'two', 'three'],
        stub: ['first', 'second'],

        matrix: _.range(8).map((i) => [1,2,3,4,5,6,7,8,9,10,11,i+1]),

        levels: {
            one: ['top heading 1', 'top heading 2'],
            two: ['second heading 1', 'second heading 2', 'second heading 3'],
            three: ['third heading 1', 'third heading 2'],
            first: ['top row 1', 'top row 2'],
            second: ['second row 1', 'second row 2', 'second row 3', 'second row 4']
        },
        hopper : {
            one: [
                {header : 'top heading 1', place: 0},
                {header : 'top heading 2', place: 6}
            ],
            two: [
                {header : 'second heading 1', place: 0},
                {header : 'second heading 2', place: 2},
                {header : 'second heading 3', place: 4},
                {header : 'second heading 1', place: 6},
                {header : 'second heading 2', place: 8},
                {header : 'second heading 3', place: 10}
            ],
            first: [
                {header : 'top row 1', place: 0, hop: 4},
                {header : 'top row 2', place: 4, hop: 4}
            ]
        }
    };

    testtable.meta = Table(testtable);

    let calc_table = {
        heading: ['one', 'two', 'three'],
        stub: ['first', 'second'],

        matrix: _.range(8).map((i) => [1,2,3,4,5,6,7,8,9,10,11,i+1]),

        levels: {
            one: ['top heading 1', 'top heading 2'],
            two: ['second heading 1', 'second heading 2', 'second heading 3'],
            three: ['third heading 1', 'third heading 2'],
            first: ['top row 1', 'top row 2'],
            second: ['second row 1', 'second row 2', 'second row 3', 'second row 4']
        }
    };

    calc_table.meta = Table(calc_table);

    calc_table.hopper = {
        one: create_header_hopper(testtable.levels.one, testtable.meta.heading_size, testtable.meta.hops.one),
        two: create_header_hopper(testtable.levels.two, testtable.meta.heading_size, testtable.meta.hops.two),
        three: create_header_hopper(testtable.levels.three, testtable.meta.heading_size, testtable.meta.hops.three),
        first: create_header_hopper(testtable.levels.first, testtable.meta.stub_size, testtable.meta.hops.first),
        second: create_header_hopper(testtable.levels.second, testtable.meta.stub_size, testtable.meta.hops.second)
    };

    var app = document.createElement('div');
    document.body.appendChild(app);

    React.render(<div>
        <h1>React Table Viewer</h1>
        <MatrixTable table={calc_table} />
        </div>, app);
}
