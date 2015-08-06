import lodash from 'lodash';
var _ = lodash;

export function Table(table) {
    var resp = getSize(table);
    resp.hops = getHops(table);
    table.shadow = create_shadow_object.bind(table);
    return resp;
}

export function FullTable(basetable) {
    /*
    Creates a clone of basetable
    and adds meta and header structures to the clone
     */
    let table = _.cloneDeep(basetable);
    
    table.base = basetable;
    table.meta = getSize(table);
    table.meta.hops = getHops(table);
    table.shadow = create_shadow_object.bind(table);

    table.hopper = {};
    _.map(table.stub, (heading, index) => {
        table.hopper[heading] = create_header_hopper(table.levels[heading],
            table.meta.stub_size, table.meta.hops[heading]);
    });
    _.map(table.heading, (heading, index) => {
        table.hopper[heading] = create_header_hopper(table.levels[heading],
            table.meta.heading_size, table.meta.hops[heading]);
    });

    table.row_headers = generate_matrix_headers(table, table.stub, table.meta.stub_size);
    table.heading_headers = generate_matrix_headers(table, table.heading,
        table.meta.heading_size);

    return table;
}

export function create_shadow_object (fields, obj) {
    /*
     create_shadow_object essentially aliases given fields with
     a prefix and sets aliased fields to new values
     without affecting original object.
     If object is not given, assumes that this is the context
     that should be copied.
     */
    if (!obj) obj = this;
    let shadow_object = {};
    _.assign(shadow_object, obj);

    _.forOwn(fields, (value, field) => {
        shadow_object['shadow_' + field] = shadow_object[field];
        shadow_object[field] = value;
    });
    return shadow_object;
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

export function create_header_hopper(headers, size, hop) {
    /*

    Returns a function which responds with one
    item from headers list or null
    for one loop or more
    till all its loops are exhausted.

    Loop amount comes from how many times header
    can appear in a size when one header takes
    hop amount of space.

    Position starts at zero and null is returned when modulo hop
    does not match it (meaning that modulo is zero when hop
    position is met).

    It throws error if its closure variables exceed
    given loop or size limit.

    header_hopper can be given a true value as an argument
    which will reset its internal gauges to zero,
    effectively restarting it.

     */
    var index = 0;
    var loops = size / (hop * headers.length);
    var loop_index = 0;
    var pos = 0;

    return function header_hopper(reset) {

        if (reset) {
            index = 0;
            loop_index = 0;
            pos = 0;
            return true;
        }

        if (pos >= size) throw "Hopper limit exceeded " + pos;

        else {
            if (index >= headers.length) {
                index = 0;
                loop_index += 1;
            }
            if (pos % hop === 0) {
                pos += 1;
                index += 1;
                return headers[index - 1];
            }
            else {
                pos += 1;
                return null;
            }
        }
    }
}

export function get_cursor_position(table, keys) {
    /*
    Get cursor position for set of keys,
    that is headings where the table should start when
    viewport is moved from starting position in top left
    corner of the table

    TODO: make it work
     */
    let positions = {};
    let prev_pos;
    let next_pos;
    let place;

    let cursor_pos = table.heading.reduce((cursor, heading, index) => {
        let hop = table.meta.hops[heading];
        let key_pos = table.levels[heading].indexOf(keys[heading]);

        let prev_place = key_pos > 0 ? key_pos - 1 : 0;
        let next_place = key_pos + 1;

        if (hop > 1) {
            prev_pos = hop * key_pos;
            next_pos = hop * next_place;
        } else {
            prev_pos = key_pos;
        }

        positions[heading] = {prev_pos : cursor + prev_pos, next_pos: cursor + next_pos};

        return cursor + prev_pos;

    }, 0);

    //let heading_span = {};
    //table.heading.map((heading) => {
    //    heading_span[heading] = table.meta.hops[heading] - positions[heading];
    //});

    let heading_span = {};

    _.forOwn(positions, function(position, key) {
        heading_span[key] = position.next_pos - cursor_pos;}
    );

    return [cursor_pos, positions, heading_span];
}

export function toggle_header(table, heading, header) {
    /*
    First cut at hiding headers from a bigger table.
    Assumes that always there are more headers than need to show.

    Hidden headers are marked as null in their place at the table
    structure.
     */

    //let index = orig_table.levels[heading].indexOf(header);

    if (table.hidden_levels[heading] && table.hidden_levels[heading][header]) {
        // if true, set the header null
        table.hidden_levels[heading][header] = null;
    }
    else {
        // else assume that header is reinstated
        if (!table.hidden_levels[heading]) table.hidden_levels[heading] = {};

        table.hidden_levels[heading][header] = true;
    }
}

export function remove_hidden_from_table(table, hidden) {
    _.forOwn(hidden, (hidden_headers, heading) => {
        table.levels[heading] = _.filter(table.levels[heading],
            (header, index) => hidden_headers.indexOf(header) === -1);
    });
}

export function remove_hidden_from_matrix(matrix, hidden) {
    /*
    Generates new matrix based on row and column indexes
     */

    let is_hidden_column = (value, index) => {
        return hidden.heading.indexOf(index) === -1;
    };

    let is_hidden_row = (row, index) => {
        if (hidden.stub.indexOf(index) === -1) return _.filter(row, is_hidden_column);
    };

    return _.filter(_.map(matrix, is_hidden_row));
}
