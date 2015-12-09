
var classNames = require('classnames');

import R from "ramda";
import * as _ from "lodash";

function get_data (callback) {
    let url = 'http://localhost:8000/';
    console.log("piper called");
    var f = R.pipeP(
        () => fetch(url),
        (response) => response.json(),
        (data) => {
            console.log("pipe response", data);
            callback(data);
        }
    );
    f().catch((error) => console.log('problem in pipe promise', error));
}


function piping (start, callback) {
    console.log("pipe started");
    var f = R.pipe(
        (data) => data,
        (data) => {
            data.arg = data.arg + 1;
            callback(data);
        }
    );
    f(start, callback);
    console.log("piped");
}


function clsnames(...args) {
    return classNames(args);
}


function get_chosen(datasets, name) {
    return R.find(R.whereEq({name: name}), datasets);
}


function picker(list, picks) {
    /*
    Pick elements from list according to list of indexes.
    */
    return picks.map((i) => list[i]);
}


function pick_columns(rows, picks) {
    /*
    For each row pick elements according to picks
    creating a list of lists each having columns elements
    */
    return _.zip(...rows.map((row) => picker(row, picks)));
}


function select_data(e, matrix) {
    /*
    Selects list of lists rows or columns from matrix
    according to clicked header's position and span
    */
    if (!e.target.dataset.id) return null;

    let ids = e.target.dataset.id.split(',');
    let route = ids[0];
    let axis_index = parseInt(ids[1]);
    let el = e.target;

    let span = route === 'heading' ? parseInt(el.getAttribute('colspan')) : parseInt(el.getAttribute('rowspan'));
    let begin = axis_index;
    let end = begin + span;

    let data = [];
    if (route === 'heading') {
        data = pick_columns(matrix, R.range(begin, end));
    } else if (route === 'stub') {
        data = picker(matrix, R.range(begin, end));
    }

    //console.log(route, axis_index, span, begin, end, el.textContent, data);

    return {
        data: data,
        heading: el.textContent
    }
}


exports.get_data = get_data;
exports.piping = piping;
exports.clsnames = clsnames;
exports.get_chosen = get_chosen;
exports.select_data = select_data;
