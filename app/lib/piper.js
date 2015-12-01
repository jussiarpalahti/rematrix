
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


exports.get_data = get_data;
exports.piping = piping;
exports.clsnames = clsnames;
