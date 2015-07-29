
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

export function add_heading_hopper(table) {
    let hopper = {};

    table.heading.slice(1, table.heading.length - 1).map((key) => {
        let headers = table.levels[key];
        hopper[key] = calculate_middle_hopper(
            headers,
            table.meta.hops[key],
            table.meta.heading_size);
    });

    let top_header = table.heading[0];
    hopper[top_header] = calculate_top_hopper(
        table.levels[top_header],
        table.meta.hops[top_header]);

    //let low_header = table.heading[table.stub.length - 1];
    //hopper[low_header] = calculate_low_hopper(
    //    table.levels[low_header],
    //    table.meta.hops[low_header],
    //    table.meta.heading_size);

    return hopper;
}

export function add_row_hopper(table) {
    let hopper = {};

    table.stub.slice(1, table.stub.length - 1).map((key) => {
        let headers = table.levels[key];
        hopper[key] = calculate_middle_hopper(
            headers,
            table.meta.hops[key],
            table.meta.stub_size);
    });

    let top_header = table.stub[0];
    hopper[top_header] = calculate_top_hopper(
        table.levels[top_header],
        table.meta.hops[top_header]);
    //
    //let low_header = table.stub[table.stub.length -1];
    //hopper[low_header] = calculate_low_hopper(
    //    table.levels[low_header],
    //    table.meta.hops[low_header],
    //    table.meta.stub_size);
    //
    return hopper;

}

let calculate_top_hopper = function (headers, hop) {
    let hopper = [];
    let place = 0;

    headers.map((header) => {
        hopper[hopper.length] = {
            header: header,
            place: place,
            hop: hop
        };
        place += hop;
    });
    return hopper;
};

let calculate_middle_hopper = function (headers, hop, size) {
    let header_gen = generate_headers(headers);
    let hopper = [];
    let place = 0;
    for (var i=0; i < size; i++) {
        hopper[hopper.length] = {
            header: header_gen.next().value,
            place: place,
            hop: hop
        };
        place += hop;
    }
    return hopper;
};

let calculate_low_hopper = function (headers, hop, size) {
    let header_gen = generate_headers(headers)
    let hopper = [];
    for (var i=0; i < size; i++) {
        hopper[hopper.length] = {
            header: header_gen.next().value,
            hop: hop
        };
    }
    return hopper;
};

export {calculate_low_hopper, calculate_middle_hopper, calculate_top_hopper}
