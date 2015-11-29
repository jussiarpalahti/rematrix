
interface Headers extends Array {
    [index: number]: [number|string];
}

export function create_header_hopper(headers: Headers, hop: number, limit: number): Function {
    /*

     Creates a function that returns either header or null
     based on hop size and limit, starting from zero index position.

     If limit is reached, returns null.

     */

    var index = 0;
    var pos = 0;
    var headers_size = headers.length;

    return function header_hopper() {

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

export function shape (headers: Headers) {
    /*

     Calculate table shape from list of header lists:
     hop: header size in cells
     loop: how many times to loop all headers
     size: full axis size in cells

     */

    var res = [];

    var ret = headers.reduce(
        function reducer (prev, next, index, all) {
            var acc;

            if (!prev) {
                // Bottom level is a special case: every header corresponds to 1 cell
                res.push(1)
                return 1;
            } else {
                // Levels other than bottom have cell size accumulated from previous levels' sizes
                acc = all[index - 1].length * prev
                res.push(acc)
                return acc;
            }
        },
        null);

    // Full size is accumulated size below last level times its own size
    let last = headers[headers.length - 1];
    var size = ret * last.length;

    return {
        size: size,
        hops: res,
        loop: res.slice().reverse() // repeat loop for level's headers is inverse of its hop size
    };
}
