
// Header is a string or number
type Header = string | number;

type Heading = Header[]

// Headers is a list of lists containing one Header or more
type Headers = Heading[];

interface Table {
    size: number;
    hops: number[];
    loop: number[];
    hoppers?: Function[],
    headers?: Headers
}

export function create_header_hopper(headers: Header[], hop: number, limit: number): Function {
    /*

     Creates a function that returns either header or null
     based on hop size and limit, starting from zero index position.

     If limit is reached, returns null.

     */

    var index = 0;
    var pos = 0;
    var headers_size = headers.length;

    return function header_hopper(): Header {

        var header;

        if (pos >= limit) {
            // cell position advanced beyond limit
            return null;
        }

        if (index >= headers_size) {
            // headers exhausted, start over
            index = 0;
        }

        if (pos % hop === 0) {
            // time to show a header
            header = headers[index];
            index += 1;
        }

        // advance to next cell position
        pos += 1;

        return header ? header : null;
    }
}

export function get_table_shape (headers: Headers): Table {
    /*

     Calculate table shape from list of header lists:
     hop: header size in cells
     loop: how many times to loop all headers
     size: full axis size in cells

     */

    let res:number[] = [];

    // Bottom level starts first in size accumulation
    headers.reverse();
    let ret = headers.reduce(
        function reducer (prev:number, next, index, all) {
            let acc;

            if (!prev) {
                // Bottom level is a special case: every header corresponds to 1 cell
                res.push(1);
                return 1;
            } else {
                // Levels other than bottom have cell size accumulated from previous levels' sizes
                acc = all[index - 1].length * prev;
                res.push(acc);
                return acc;
            }
        },
        null);

    // Full size is accumulated size below last level times its own size
    let last = headers[headers.length - 1];
    console.log("ret, last", ret, last);
    var size:number = ret * last.length;
    headers.reverse();
    return {
        size: size,
        hops: res.reverse(),
        loop: res.slice() // repeat loop for level's headers is inverse of its hop size
    };
}


export function get_table (headers: Headers): Table {
    /*
    Generates a Table object from headers
     */
    let shape = get_table_shape(headers);
    shape.headers = headers;
    shape.hoppers = headers.map(
        (headings, index) => create_header_hopper(
                headings,
                shape.hops[index],
                shape.size));
    return shape;
}
