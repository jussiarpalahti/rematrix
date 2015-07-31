import { expect } from 'chai';
import React from 'react/addons';
const TestUtils = React.addons.TestUtils;
import {
    Table,
    generate_headers,
    create_header_hopper,
    get_cursor_position,
    toggle_header,
    remove_hidden_from_table,
    remove_hidden_from_matrix
} from '../app/lib/utils';

import {generate_matrix_headers} from '../app/lib/matrix_header';
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

    testtable.hopper = {
        one: create_header_hopper(testtable.levels.one, testtable.meta.heading_size, testtable.meta.hops.one),
        two: create_header_hopper(testtable.levels.two, testtable.meta.heading_size, testtable.meta.hops.two),
        three: create_header_hopper(testtable.levels.three, testtable.meta.heading_size, testtable.meta.hops.three),
        first: create_header_hopper(testtable.levels.first, testtable.meta.stub_size, testtable.meta.hops.first),
        second: create_header_hopper(testtable.levels.second, testtable.meta.stub_size, testtable.meta.hops.second)
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

    it('should match middle level headers', function () {

        let hopper = create_header_hopper(testtable.levels.two, 8, 2);
        let first_answer = hopper();
        let second_answer = hopper();
        let third_answer = hopper();
        for (var i=0; i<5; i++) { hopper(); } // move to the end position

        expect(first_answer).to.equal('second heading 1');

        expect(second_answer).to.equal(null);

        expect(third_answer).to.equal('second heading 2');

        expect(hopper).to.throw("Hopper limit exceeded 8");

    });

    it('should match low level headers', function () {
        let hopper = create_header_hopper(testtable.levels.second, 12, 1);
        let first_answer = hopper();
        let second_answer = hopper();
        let third_answer = hopper();

        for (var i=0; i<8; i++) { hopper(); } // move to the end position

        let final_answer = hopper();

        expect(second_answer).to.equal("second row 2");

        expect(third_answer).to.equal('second row 3');

        expect(final_answer).to.equal('second row 4');

        expect(hopper).to.throw("Hopper limit exceeded 12");

    });

    it('should match top level headers', function () {
        let hopper = create_header_hopper(testtable.levels.first, 12, 6);
        let first_answer = hopper();

        for (var i=0; i<5; i++) { hopper(); } // move to the end position

        let second_answer = hopper();

        for (var i=0; i<5; i++) { hopper(); } // move to the end position

        expect(first_answer).to.equal("top row 1");

        expect(second_answer).to.equal('top row 2');

        expect(hopper).to.throw("Hopper limit exceeded 12");
    });
});

describe('cursor test', function () {
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

    let cursor = {
        one : 'top heading 2',
        two : 'second heading 1',
        three : 'third heading 2'
    };

    let cursor2 = {
        one : 'top heading 2',
        two : 'second heading 2',
        three : 'third heading 1'
    };

    let cursor3 = {
        one : 'top heading 1',
        two : 'second heading 1',
        three : 'third heading 2'
    };

    let [cursor_pos, positions, heading_span] = get_cursor_position(testtable, cursor);
    let [cursor_pos2, positions2, heading_span2] = get_cursor_position(testtable, cursor2);
    let [cursor_pos3, positions3, heading_span3] = get_cursor_position(testtable, cursor3);

    it('should have a cursor position of 7', function () {

        expect(cursor_pos).to.equal(7);
        expect(cursor_pos2).to.equal(8);
        expect(cursor_pos3).to.equal(1);

    })

    it('should have a correct span', function () {

        expect(heading_span.one).to.equal(5);

        expect(heading_span.two).to.equal(1);

        expect(heading_span2.one).to.equal(4);

        expect(heading_span2.two).to.equal(2);

        expect(heading_span3.one).to.equal(5);

        expect(heading_span3.two).to.equal(1);

    });

});

describe('header hiding toggle', function () {

    let testtable = {
        hidden_levels: {}
    };

    it('should have toggled heading\'s state true', function () {

        toggle_header(testtable, 'three', 'third heading 2');
        expect(testtable.hidden_levels.three['third heading 2']).to.equal(true);

    });

    it('should have toggled heading\'s state to null', function () {

        toggle_header(testtable, 'three', 'third heading 2');
        expect(testtable.hidden_levels.three['third heading 2']).to.equal(null);

    });
});

describe('remove data and headers from table', function () {

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

    remove_hidden_from_table(testtable, {three: ['third heading 2']});

    it('should be no "third heading 2" in level three heading', function () {

        expect(testtable.levels.three[1]).to.equal(undefined);

    });

    it('should be "third heading 1" in level three heading\'s first position', function () {

        expect(testtable.levels.three[0]).to.equal('third heading 1');

    });
});

describe('remove data from matrix', function () {

        let matrix = _.range(8).map((i) => [1,2,3,4,5,6,7,8,9,10,11,i+1]);

        let hidden = {
            row: [2, 6],
            column: [1, 7, 9]
        };

        it('should have smaller rows and columns', function () {

            let unmatrix = remove_hidden_from_matrix(matrix, hidden);

            expect(unmatrix.length).to.equal(6);

            expect(unmatrix[0].length).to.equal(9);

        })
    }
);

describe('matrix header generation', function () {

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
    testtable.hopper = {
        one: create_header_hopper(testtable.levels.one, testtable.meta.heading_size, testtable.meta.hops.one),
        two: create_header_hopper(testtable.levels.two, testtable.meta.heading_size, testtable.meta.hops.two),
        three: create_header_hopper(testtable.levels.three, testtable.meta.heading_size, testtable.meta.hops.three),
        first: create_header_hopper(testtable.levels.first, testtable.meta.stub_size, testtable.meta.hops.first),
        second: create_header_hopper(testtable.levels.second, testtable.meta.stub_size, testtable.meta.hops.second)
    };

    let headers = generate_matrix_headers(testtable, testtable.stub, testtable.meta.stub_size);

    it('header objects should have correct headers and hop settings', function () {

        expect(headers[0].first.header).to.equal('top row 1');
        expect(headers[0].first.hop).to.equal(4);
        expect(headers[1].second.header).to.equal('second row 2');
        expect(headers[1].first.hop).to.equal(null);

        expect(headers[4].first.header).to.equal('top row 2');
        expect(headers[4].first.hop).to.equal(4);
   });

});