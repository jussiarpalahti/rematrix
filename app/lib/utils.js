
export function Table(table) {
    var resp = getSize(table);
    resp.hops = getHops(table);

    return resp;
}

let getSize = function(table) {
    var heading_size = table.heading.map(key => table.levels[key]).reduce((a, b) => {
        if (a.length) return a.length * b.length;
        else return a * b.length
    });
    var stub_size = table.stub.map(key => table.levels[key]).reduce((a, b) => {
        if (a.length) return a.length * b.length;
        else return a * b.length
    });

    return {
        heading_size: heading_size,
        stub_size: stub_size,
        size: heading_size * stub_size
    }
};

let getHops = function (table) {
    table.heading.reverse();
    table.stub.reverse();

    var hops = {};

    table.heading.reduce((size, key, index) => {
        if (index == 0) {
            hops[key] = size;
        } else {
            let level_below = table.levels[table.heading[index -1]];
            hops[key] = level_below.length * size;
        }
        return hops[key];
    }, 1);

    table.stub.reduce((size, key, index) => {
        if (index == 0) {
            hops[key] = size;
        } else {
            let level_below = table.levels[table.stub[index -1]];
            hops[key] = level_below.length * size;
        }
        return hops[key];
    }, 1);

    table.heading.reverse();
    table.stub.reverse();

    return hops;
};

export function generate_headers (headers) {
    /*
    Always returns one header per call looping through
    given list of headers
     */

    return function* f() {
        while (true) {
            for (var header of headers) {
                yield header;
            }
        }
    }();
};

export function PositionChecker (positions) {
    /*
     Returns a function where one item of the positions
     list if the item's place field matches the position
     given to this generated function
     */
    var index = 0;
    return function f(pos) {
        if (index >= positions.length) index = 0;

        var header = positions[index];
        if (header.place == pos) {
            index += 1;
            return header;
        } else {
            return null;
        }
    };
};
