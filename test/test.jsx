import { expect } from 'chai';
import React from 'react/addons';
const TestUtils = React.addons.TestUtils;
import {Table, generate_headers} from '../app/lib/utils';
import ManualTable from '../app/components/manual_table';

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
