import { expect } from 'chai';
import React from 'react/addons';
const TestUtils = React.addons.TestUtils;
import {Table} from '../app/lib/utils';

var jsdom = require('mocha-jsdom');

function createComponent(component, props, ...children) {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(React.createElement(component, props, children.length > 1 ? children : children[0]));
    return shallowRenderer.getRenderOutput();
}

describe('test table', function() {

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

