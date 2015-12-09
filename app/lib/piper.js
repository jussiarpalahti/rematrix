
var classNames = require('classnames');

import R from "ramda";


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

function select_data(e) {

    if (!e.target.dataset.id) return null;

    let ids = e.target.dataset.id.split(',');
    let route = ids[0];
    let axis_index = parseInt(ids[1]);
    let el = e.target;

    let span = route === 'head' ? parseInt(el.getAttribute('colspan')) : parseInt(el.getAttribute('rowspan'));
    let begin = axis_index;
    let end = begin + span;

    console.log(route, axis_index, span, begin, end, R.range(begin, end));
}


exports.get_data = get_data;
exports.piping = piping;
exports.clsnames = clsnames;
exports.get_chosen = get_chosen;
exports.select_data = select_data;
