

declare module piper {
    //import piper = require('piper'); // this behaves like a relative path, but tsc eats it as 'not relative'.
    //import {...} from "piper";
    //export = piper;
    export function get_data (callback:any);
    export function piping (start:any, callback:any);
}

export = piper;
