
import R from "ramda";

export function get_data (callback) {
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
    f();
}

export function piping (start, callback) {
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
