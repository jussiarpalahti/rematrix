import { expect } from 'chai';
import React from 'react/addons';
const TestUtils = React.addons.TestUtils;
import {
    Table,
    generate_headers,
    add_heading_hopper,
    add_row_hopper
    calculate_low_hopper,
    calculate_middle_hopper,
    calculate_low_hopper} from '../app/lib/utils';
import ManualTable from '../app/components/manual_table';
import MatrixTable from '../app/components/matrix_table';
import lodash from 'lodash';
var _ = lodash;

var jsdom = require('mocha-jsdom');

function createComponent(component, props, ...children) {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(React.createElement(component, props, children.length > 1 ? children : children[0]));
    return shallowRenderer.getRenderOutput();
}

describe('test table structure', function() {

    let testtable = {
        heading: ['one', 'two', 'three'],
        stub: ['first', 'second'],

        levels: {
            one: ['top heading 1', 'top heading 2'],
            two: ['second heading 1', 'second heading 2', 'second heading 3'],
            three: ['third heading 1', 'third heading 2'],
            first: ['top row 1', 'top row 2'],
            second: ['second row 1', 'second row 2', 'second row 3', 'second row 4']
        }
    };

    let table = Table(testtable);

    it('should have 8 rows', function() {
        expect(table.stub_size).to.equal(8);
    });

    it('should have 12 columns', function() {
        expect(table.heading_size).to.equal(12);
    });

    it('should have 96 cells', function() {
        expect(table.size).to.equal(96);
    });

    it('should have length of 6 cells for one first level column header', function() {
        expect(table.hops.one).to.equal(6);
    });

    it('should have length of 4 cells for one first level row header', function() {
        expect(table.hops.one).to.equal(6);
    });

});

describe('header generation', function () {

    let first_set = ['second heading 1', 'second heading 2', 'second heading 3'];
    let second_set = ['one', 'two'];

    let first_gen = generate_headers(first_set);
    let second_gen = generate_headers(second_set);

    it('should yield correctly', function ()  {
        var first = first_gen.next();
        expect(first.value).to.equal(first_set[0]);

        var second = first_gen.next();
        expect(second.value).to.equal(first_set[1]);

        var third = first_gen.next();
        expect(third.value).to.equal(first_set[2]);

    });

    it('should keep on repeating its headers', function () {
        for (var i=0; i<10; i++) {
            var res = second_gen.next();
        }
        expect(res.value).to.equal(second_set[1]);
    })

});

describe('manual table view test', function () {
    var mable;

    jsdom();

    before(function() {
        mable = TestUtils.renderIntoDocument(
            <ManualTable />
        );
    });

    it('should have 8 tr elements in table body', function () {
        var body = TestUtils.findRenderedDOMComponentWithTag(mable, 'tbody');
        var tr = TestUtils.scryRenderedDOMComponentsWithTag(body, 'tr');
        expect(tr.length).to.equal(8);
    });

    it('should have 12 td elements in first tr of the table body', function () {
        var body = TestUtils.findRenderedDOMComponentWithTag(mable, 'tbody');
        var tr = TestUtils.scryRenderedDOMComponentsWithTag(body, 'tr');
        var columns = TestUtils.scryRenderedDOMComponentsWithTag(tr[0], 'td');
        expect(columns.length).to.equal(12);
    });

    it('should have 96 td elements in the whole table', function () {
        var elems = TestUtils.scryRenderedDOMComponentsWithTag(mable, 'td');
        expect(elems.length).to.equal(96);
    });

    it('should have 6 th elements in the second tr of the table heading with colspan of 2', function () {

        var head = TestUtils.findRenderedDOMComponentWithTag(mable, 'thead');
        var trs = TestUtils.scryRenderedDOMComponentsWithTag(head, 'tr');
        var column_headers = TestUtils.scryRenderedDOMComponentsWithTag(trs[1], 'th');

        expect(column_headers.length).to.equal(6);

        expect(Number(column_headers[0].props.colSpan)).to.equal(2);

    });

});

describe('object table view test', function () {
    var otable;

    jsdom();

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
            three: [
                {header : 'third heading 1', place: 0},
                {header : 'third heading 2', place: 0}
            ],
            first: [
                {header : 'top row 1', place: 0, hop: 4},
                {header : 'top row 2', place: 4, hop: 4},
            ]
        }
    };

    testtable.meta = Table(testtable);
    //console.log(testtable);

    before(function() {
        otable = TestUtils.renderIntoDocument(
            <MatrixTable table={testtable} />
        );
    });

    it('should have 8 tr elements in table body', function () {
        var body = TestUtils.findRenderedDOMComponentWithTag(otable, 'tbody');
        var tr = TestUtils.scryRenderedDOMComponentsWithTag(body, 'tr');
        expect(tr.length).to.equal(8);
    });

    it('should have 12 td elements in first tr of the table body', function () {
        var body = TestUtils.findRenderedDOMComponentWithTag(otable, 'tbody');
        var tr = TestUtils.scryRenderedDOMComponentsWithTag(body, 'tr');
        var columns = TestUtils.scryRenderedDOMComponentsWithTag(tr[0], 'td');
        expect(columns.length).to.equal(12);
    });

    it('should have 96 td elements in the whole table', function () {
        var elems = TestUtils.scryRenderedDOMComponentsWithTag(otable, 'td');
        expect(elems.length).to.equal(96);
    });

    it('should have 6 th elements in the second tr of the table heading with colspan of 2', function () {

        var head = TestUtils.findRenderedDOMComponentWithTag(otable, 'thead');
        var trs = TestUtils.scryRenderedDOMComponentsWithTag(head, 'tr');
        var column_headers = TestUtils.scryRenderedDOMComponentsWithTag(trs[1], 'th');

        expect(column_headers.length).to.equal(6);
        expect(Number(column_headers[1].props.colSpan)).to.equal(2);
    });

    it('should have correct column header text in the third heading row\'s fifth th node', function () {

        var head = TestUtils.findRenderedDOMComponentWithTag(otable, 'thead');
        var trs = TestUtils.scryRenderedDOMComponentsWithTag(head, 'tr');
        var column_headers = TestUtils.scryRenderedDOMComponentsWithTag(trs[2], 'th');
        var target = column_headers[4];
        expect(target.props.children).to.equal("third heading 1");
    });

    it('should have correct row header text in the sixth row\'s second th node', function () {

        var body = TestUtils.findRenderedDOMComponentWithTag(otable, 'tbody');
        var column_headers = TestUtils.scryRenderedDOMComponentsWithTag(body, 'th');
        var target = column_headers[7];

        expect(target.props.children).to.equal("second row 2");
    });

});

describe('hop calculation', function () {

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
    let heading_hopper = add_heading_hopper(calc_table);
    let row_hopper = add_row_hopper(calc_table);

    calc_table.hopper = {
        one: heading_hopper['one'],
        two: heading_hopper['two'],
        first: row_hopper['first']
    };

    let baseline_table = {
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

    it('calculated table should be identical to baseline table', function () {
        expect(calc_table).to.equal(baseline_table);
    });

    it('should have placement of 6 for header 4 of column header 2', function () {
        let target = calc_table.hopper['one'][1];
        expect(target.place).to.equal(6);
    });

    it('should have place 7 for header 2 of row 1', function () {
        let target = calc_table.hopper['first'][1];
        expect(target.place).to.equal(4);
    });

});

describe('calculated table view test', function () {
    var otable;

    jsdom();


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
        }
    };

    testtable.meta = Table(testtable);
    let heading_hopper = add_heading_hopper(testtable);
    let row_hopper = add_row_hopper(testtable);

    testtable.hopper = {
        one: heading_hopper['one'],
        two: heading_hopper['two'],
        three: heading_hopper['three'],
        first: row_hopper['first']
    };


    before(function() {
        otable = TestUtils.renderIntoDocument(
            <MatrixTable table={testtable} />
        );
    });

    it('should have 8 tr elements in table body', function () {
        var body = TestUtils.findRenderedDOMComponentWithTag(otable, 'tbody');
        var tr = TestUtils.scryRenderedDOMComponentsWithTag(body, 'tr');
        expect(tr.length).to.equal(8);
    });

    it('should have 12 td elements in first tr of the table body', function () {
        var body = TestUtils.findRenderedDOMComponentWithTag(otable, 'tbody');
        var tr = TestUtils.scryRenderedDOMComponentsWithTag(body, 'tr');
        var columns = TestUtils.scryRenderedDOMComponentsWithTag(tr[0], 'td');
        expect(columns.length).to.equal(12);
    });

    it('should have 96 td elements in the whole table', function () {
        var elems = TestUtils.scryRenderedDOMComponentsWithTag(otable, 'td');
        expect(elems.length).to.equal(96);
    });

    it('should have 6 th elements in the second tr of the table heading with colspan of 2', function () {

        var head = TestUtils.findRenderedDOMComponentWithTag(otable, 'thead');
        var trs = TestUtils.scryRenderedDOMComponentsWithTag(head, 'tr');
        var column_headers = TestUtils.scryRenderedDOMComponentsWithTag(trs[1], 'th');

        expect(column_headers.length).to.equal(6);
        expect(Number(column_headers[1].props.colSpan)).to.equal(2);
    });

    it('should have correct column header text in the third heading row\'s fifth th node', function () {

        var head = TestUtils.findRenderedDOMComponentWithTag(otable, 'thead');
        var trs = TestUtils.scryRenderedDOMComponentsWithTag(head, 'tr');
        var column_headers = TestUtils.scryRenderedDOMComponentsWithTag(trs[2], 'th');
        var target = column_headers[4];
        expect(target.props.children).to.equal("third heading 1");
    });

    it('should have correct row header text in the sixth row\'s second th node', function () {

        var body = TestUtils.findRenderedDOMComponentWithTag(otable, 'tbody');
        var column_headers = TestUtils.scryRenderedDOMComponentsWithTag(body, 'th');
        var target = column_headers[7];

        expect(target.props.children).to.equal("second row 2");
    });

});

describe('hopper test', function () {
    it('should match low level headers');
    it('should match middle level headers');
    it('should match top level headers');
});