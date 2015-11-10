
import * as R from "ramda";

export function get_data () {
    console.log("piper called");
    var f = R.pipeP(
        () => fetch('http://localhost:8000/'),
        (response) => response.json(),
        (data) => console.log(data)
    );
    f();
}

