import { expect } from 'chai';
import React from 'react/addons';
const TestUtils = React.addons.TestUtils;
import {table, size} from '../app/lib/utils';

var jsdom = require('mocha-jsdom');

function createComponent(component, props, ...children) {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(React.createElement(component, props, children.length > 1 ? children : children[0]));
    return shallowRenderer.getRenderOutput();
}

describe('table test', function() {
    it('should return stuff', function() {
        var ret = table(1);
        expect(ret).to.equal(2);
    })
});
