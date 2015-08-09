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
    remove_hidden_from_matrix,
    create_shadow_object,
} from '../app/lib/utils';

import {
    generate_matrix_headers,
    generate_hidden_check,
    generate_hidden_index,
    get_header_mask,
    get_matrix_mask,
    get_header_from_pos,
    get_heading_hopper
} from '../app/lib/matrix_header';

import ManualTable from '../app/components/manual_table';
import {
    MatrixTable,
    HeaderTable,
    HoppingTable
} from '../app/components/matrix_table';
import {create_dispatch} from '../app/lib/converser'
import {
    FullTable,
    get_preview_table_levels
} from  '../app/lib/table_utils';

import {big_table} from './table_fixtures';

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
            stub: [2, 6],
            heading: [1, 7, 9]
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
        one: create_header_hopper(testtable.levels.one, testtable.meta.heading_size,
            testtable.meta.hops.one),
        two: create_header_hopper(testtable.levels.two, testtable.meta.heading_size,
            testtable.meta.hops.two),
        three: create_header_hopper(testtable.levels.three, testtable.meta.heading_size,
            testtable.meta.hops.three),
        first: create_header_hopper(testtable.levels.first, testtable.meta.stub_size,
            testtable.meta.hops.first),
        second: create_header_hopper(testtable.levels.second, testtable.meta.stub_size,
            testtable.meta.hops.second)
    };

    it('stub header objects should have correct headers and hop settings', function () {
        let headers = generate_matrix_headers(testtable, testtable.stub,
            testtable.meta.stub_size);
        expect(headers[0].first).to.equal('top row 1');
        expect(headers[0].hop.first).to.equal(4);
        expect(headers[1].second).to.equal('second row 2');
        expect(headers[1].hop.first).to.equal(null);

        expect(headers[4].first).to.equal('top row 2');
        expect(headers[4].hop.first).to.equal(4);
    });

    it('heading header objects should have correct headers and hop settings', function () {
        let headers = generate_matrix_headers(testtable, testtable.heading,
            testtable.meta.heading_size);

        expect(headers[0].two).to.equal('second heading 1');
        expect(headers[0].hop.two).to.equal(2);
        expect(headers[1].three).to.equal('third heading 2');
        expect(headers[1].hop.two).to.equal(null);

        expect(headers[6].one).to.equal('top heading 2');
        expect(headers[6].hop.one).to.equal(6);
        expect(headers[6].hop.three).to.equal(1);
    });
});

describe('hidden header checker', function () {

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
        one: create_header_hopper(testtable.levels.one, testtable.meta.heading_size,
            testtable.meta.hops.one),
        two: create_header_hopper(testtable.levels.two, testtable.meta.heading_size,
            testtable.meta.hops.two),
        three: create_header_hopper(testtable.levels.three, testtable.meta.heading_size,
            testtable.meta.hops.three),
        first: create_header_hopper(testtable.levels.first, testtable.meta.stub_size,
            testtable.meta.hops.first),
        second: create_header_hopper(testtable.levels.second, testtable.meta.stub_size,
            testtable.meta.hops.second)
    };
    let stub_headers = generate_matrix_headers(testtable, testtable.stub,
        testtable.meta.stub_size);
    let heading_headers = generate_matrix_headers(testtable, testtable.heading,
        testtable.meta.heading_size);

    it('should hide certain headers', function () {

        let hiding_query = [
            {'one': 'top heading 1'},
            {'three': 'third heading 2'}];

        let hider = generate_hidden_check(heading_headers, hiding_query);

        let is_hidden1 = {
            one:'top heading 1',
            two: 'second heading 2',
            three: 'third heading 1'};

        let is_hidden2 = {
            one:'top heading 2',
            two: 'second heading 1',
            three: 'third heading 2'};

        expect(hider(is_hidden1)).to.equal(true);
        expect(hider(is_hidden2)).to.equal(true);
    });
});

describe('header table view test', function () {
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

    testtable.row_headers = generate_matrix_headers(testtable, testtable.stub,
        testtable.meta.stub_size);
    testtable.heading_headers = generate_matrix_headers(testtable, testtable.heading,
        testtable.meta.heading_size);

    before(function() {
        otable = TestUtils.renderIntoDocument(
            <HeaderTable table={testtable} />
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

describe('shadow object function', function () {

    it("should correctly shadow stated fields and preserve others", function () {

        let old = {
            field:"value",
            deep_field: [1,2,3,4],
            subobj:{value: "preserved"}};
        let shadow_old = create_shadow_object({deep_field: [6,7,8,9]}, old);
        shadow_old.subobj.value = "same as old";
        shadow_old.deep_field[1] = 77;
        shadow_old.shadow_deep_field[3] = 44;

        expect(shadow_old.deep_field[0]).to.equal(6);
        expect(old.deep_field[0]).to.equal(1);
        expect(shadow_old.deep_field[1]).to.equal(77);
        expect(old.deep_field[1]).to.equal(2);
        expect(shadow_old.field).to.equal(old.field);
        expect(shadow_old.subobj.value).to.equal(old.subobj.value);
        expect(shadow_old.shadow_deep_field[3]).to.equal(old.deep_field[3]);
    });
});

describe('create shadow table', function () {

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

    it('should allow shadowing heading and stub', function () {
        let shadow_fields = {
            three: ['third heading 1'],
            first: ['top row 2'],
        };

        let shadow_levels = testtable.shadow(shadow_fields, testtable.levels);
        let shadow_table = testtable.shadow({levels: shadow_levels});
    });
});

describe('verify hidden headers are indexed properly', function () {

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

    let visible_table = {
        heading: ['one', 'two', 'three'],
        stub: ['first', 'second'],

        matrix: _.range(8).map((i) => [1,2,3,4,5,6,7,8,9,10,11,i+1]),

        levels: {
            one: ['top heading 1'],
            two: ['second heading 1', 'second heading 2', 'second heading 3'],
            three: ['third heading 2'],
            first: ['top row 1', 'top row 2'],
            second: ['second row 1', 'second row 2', 'second row 3', 'second row 4']
        }
    };
    visible_table.meta = Table(visible_table);
    visible_table.hopper = {
        one: create_header_hopper(visible_table.levels.one, visible_table.meta.heading_size, visible_table.meta.hops.one),
        two: create_header_hopper(visible_table.levels.two, visible_table.meta.heading_size, visible_table.meta.hops.two),
        three: create_header_hopper(visible_table.levels.three, visible_table.meta.heading_size, visible_table.meta.hops.three),
        first: create_header_hopper(visible_table.levels.first, visible_table.meta.stub_size, visible_table.meta.hops.first),
        second: create_header_hopper(visible_table.levels.second, visible_table.meta.stub_size, visible_table.meta.hops.second)
    };

    let all_headers = generate_matrix_headers(testtable, testtable.heading,
        testtable.meta.heading_size);

    let visible_headers = generate_matrix_headers(visible_table, visible_table.heading,
        visible_table.meta.heading_size);

    it('should create indexes for hidden headers', function () {

        let hidden_index = generate_hidden_index(all_headers, visible_headers);
        expect(hidden_index.length).to.equal(9);
        expect(hidden_index.indexOf(1)).to.equal(-1);
        expect(hidden_index.indexOf(7)).to.not.equal(-1);

    });

});

describe('matrix filter using headers', function () {

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

        let visible_table = {
            heading: ['one', 'two', 'three'],
            stub: ['first', 'second'],

            matrix: _.range(8).map((i) => [1,2,3,4,5,6,7,8,9,10,11,i+1]),

            levels: {
                one: ['top heading 1'],
                two: ['second heading 1', 'second heading 2', 'second heading 3'],
                three: ['third heading 2'],
                first: ['top row 1', 'top row 2'],
                second: ['second row 1', 'second row 3']
            }
        };
        visible_table.meta = Table(visible_table);
        visible_table.hopper = {
            one: create_header_hopper(visible_table.levels.one,
                visible_table.meta.heading_size, visible_table.meta.hops.one),
            two: create_header_hopper(visible_table.levels.two,
                visible_table.meta.heading_size, visible_table.meta.hops.two),
            three: create_header_hopper(visible_table.levels.three,
                visible_table.meta.heading_size, visible_table.meta.hops.three),
            first: create_header_hopper(visible_table.levels.first,
                visible_table.meta.stub_size, visible_table.meta.hops.first),
            second: create_header_hopper(visible_table.levels.second,
                visible_table.meta.stub_size, visible_table.meta.hops.second)
        };

        let all_headings = generate_matrix_headers(testtable, testtable.heading,
            testtable.meta.heading_size);

        let visible_headings = generate_matrix_headers(visible_table, visible_table.heading,
            visible_table.meta.heading_size);

        let all_stubs = generate_matrix_headers(testtable, testtable.stub,
            testtable.meta.stub_size);

        let visible_stubs = generate_matrix_headers(visible_table, visible_table.stub,
            visible_table.meta.stub_size);

        let hidden_index = {
            heading: generate_hidden_index(all_headings, visible_headings),
            stub: generate_hidden_index(all_stubs, visible_stubs)
        };

        it('matrix should be smaller', function () {

            let unmatrix = remove_hidden_from_matrix(
                testtable.matrix,
                hidden_index
            );

            expect(unmatrix.length).to.equal(4);
            expect(unmatrix[0].length).to.equal(3);
            expect(unmatrix[0][0]).to.equal(2);

        });
    }
);

describe('test dispatcher creator', function () {

    let test_val;
    let test_val_2;
    let test_val_3;

    let test_handlers = {
        "type1" : [
            (arg) => {
                test_val = arg
            },
            (arg) => test_val_3 = arg],
        "type2" : [(arg) => test_val_2 = arg]
    };

    let dispatch = create_dispatch(test_handlers);

    dispatch.type1(1);
    dispatch.type2(2);

    it('should trigger both types and all their handlers', function () {
        expect(test_val).to.equal(1);
        expect(test_val_2).to.equal(2);
        expect(test_val_3).to.equal(1);
    });
});

describe('FullTable creator test', function () {

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

    let new_table = FullTable(testtable);
    let new_table2 = FullTable(testtable);

    it('it should have identical basetable', function () {
       expect(new_table.base).to.equal(new_table2.base);
    });

});

describe('FullTable with header table view test', function () {
    jsdom();
    var otable;
    let basetable = {
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

    let testtable = FullTable(basetable);

    before(function() {
        otable = TestUtils.renderIntoDocument(
            <HoppingTable table={testtable} />
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

describe("header and matrix mask test", function () {

    let original_headers = ['top heading 1', 'top heading 2'];
    let visible_headers = ['top heading 1'];
    let hop = 1;
    let heading_size = 12;

    it('should handle one header', function () {
        let mask = get_header_mask(
            visible_headers, original_headers,
            hop,heading_size);
        expect(mask[1]).to.equal(2);
        expect(mask.length).to.equal(6);
    });

    let hops = [6, 2, 1];
    let all_headers = [
        [
            ['top heading 1'], ['top heading 1', 'top heading 2']
        ],
        [
            ['second heading 2', 'second heading 3'],
            ['second heading 1', 'second heading 2', 'second heading 3']
        ],
        [
            ['third heading 1'], ['third heading 1', 'third heading 2']
        ]
    ];
    let matrix = _.range(12);

    it('should handle many headers', function () {
        let full_mask = get_matrix_mask(all_headers, hops);
        expect(full_mask[0]).to.equal(2);
        expect(full_mask[1]).to.equal(4);
        expect(full_mask.length).to.equal(2);

        let visible_value = matrix[full_mask[0]];
        expect(visible_value).to.equal(2);
        let visible_value_2 = matrix[full_mask[1]];
        expect(visible_value_2).to.equal(4);
    });

});

describe('get header on a position test', function () {

    it('should handle null and active positions for hop of 2', function () {
        let headers = ['second heading 1', 'second heading 2', 'second heading 3'];
        let hop = 2;
        let checker =  get_header_from_pos(headers, hop);

        expect(checker(0)).to.equal(headers[0]);
        expect(checker(1)).to.equal(null);
        expect(checker(2)).to.equal(headers[1]);
        expect(checker(6)).to.equal(headers[0]);
    });

    it('should handle null and active positions for hop of 1', function () {
        let headers = ['third heading 1', 'third heading 2'];
        let hop = 1;
        let checker =  get_header_from_pos(headers, hop);

        expect(checker(0)).to.equal(headers[0]);
        expect(checker(1)).to.not.equal(null);
        expect(checker(1)).to.equal(headers[1]);
        expect(checker(2)).to.equal(headers[0]);
        expect(checker(11)).to.equal(headers[1]);
    });
});

describe('heading\'s headers on a position test', function () {

    let headings = [
        {
            heading: "one",
            headers: ['top heading 1', 'top heading 2']},
        {
            heading: "two",
            headers: ['second heading 1', 'second heading 2', 'second heading 3']},
        {
            heading: "three",
            headers: ['third heading 1', 'third heading 2']}
    ];
    let hops = {three: 1, two: 2, one: 6};

    it('should handle three levels with varying hops', function () {

        let checkers = get_heading_hopper(headings, hops);
        expect(checkers(0)[0].hop).to.equal(6);
        expect(checkers(1)[0]).to.equal(null);
        expect(checkers(2)[2].heading).to.equal("three");
        let second_top_hopper = checkers(6);
        expect(second_top_hopper[0].header).to.equal(headings[0].headers[1]);
        expect(second_top_hopper[1].header).to.equal(headings[1].headers[0]);
        expect(second_top_hopper[2].header).to.equal(headings[2].headers[0]);
    });
});

describe.only('testing preview level generation', function () {

    it('should be properly smaller', function () {

        let full_table = FullTable(big_table);
        let preview = get_preview_table_levels(full_table, 15);
        console.log(preview);
        console.log(full_table.meta)

    });
});