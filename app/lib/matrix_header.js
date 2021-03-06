import lodash from 'lodash';
var _ = lodash;

import {
    Table,
    generate_headers,
    create_header_hopper,
    get_cursor_position,
    toggle_header,
    remove_hidden_from_table,
    remove_hidden_from_matrix
} from './utils.js';

export function generate_matrix_headers(table, headers, size) {

    _.forOwn(table.hopper, (hopper, key) => {
        hopper(true);
    });

    let data = [];
    for (var i=0; i < size; i++) {

        let obj = {hop:{}};
        let hop = null;

        headers.map((heading, index) => {

            let hopper = table.hopper[heading];
            let header = hopper();

            if (header) {
                hop = table.meta.hops[heading];
            }
            else {
                header = data[i - 1][heading];
                hop = null;
            }

            obj[heading] = header;
            obj['hop'][heading] = hop;
        });
        data.push(obj);
    }
    return data;
}

export function generate_hidden_check(headers, hiding_queries) {
    /*
    Generates a helper function that tells if a given header
    is hidden.
    hidden argument is a list of query objects, with header
    values set for any necessary headings:
        [{level1: value1}, {level2: value2}]
    Query is all inclusive, all matching objects are removed

    TODO: find out why trying to add to an array during reduce fails
    */

    let hidden_headers = _.flatten(
        hiding_queries.map((hide_query) => {
            return _.where(headers, hide_query);
        })
    );

    return (header) => {
        return _.where(hidden_headers, header).length > 0;
    }
}

export function generate_hidden_index(original_headers, visible_headers) {
    /*
    Goes through all headers and returns their index position
    if the header is in visible_headers
    This means that for this index all cells on this point of the axis
    can be used in the matrix
     */
    return _.filter(original_headers.map((header, index) => {
        if (!_.findWhere(visible_headers, _.omit(header, 'hop'))) {
           return index;
       }
    }), (item) => item !== undefined);
}

export function get_header_mask(visible_headers, original_headers, hop, heading_size) {
    /*
    Based on a given set of visible and original headers, former being a subset of the latter,
    calculate visible index positions on the headings' axis.
    Given heading size is the amount of cells in the axis that the headers have to fill.
    For top level, all headers together are large enough. Other levels need to cycle through
    their headers as many times till all space is filled.
    */

    let get_range = (start_pos, hop) => {
        return _.range(start_pos, start_pos + hop);
    };

    // listing all ranges times loop amount
    let get_mask = (loops, offset, size, hop) => {
        return _.map(_.range(loops), (loop) => {
            return get_range(get_startpos(loop, offset, size), hop);
        })
    };

    let d = {};
    // for all the visible headers loop through them
    // and calculate mask for each header and return a list of all
    let mask = _.map(visible_headers, (header) => {

        let offset = get_offset(header, original_headers, hop);
        let size = hop * original_headers.length;
        let loops = heading_size / size;

        return _.flatten(get_mask(loops, offset, size, hop));
    });

    return _.flatten(mask);
}

// startpos is the place of loop times size of one set of headers
// + the offset in last set
let get_startpos = (loop, offset, size) => {
    return loop  * size + offset;
};

// offset is the position times hop in the original
let get_offset = (header, headers, hop) => {
    return headers.indexOf(header) * hop;
};

export function get_matrix_mask(all_headers, hops) {
    /*
    This is a convenience function for get_header_mask that
    goes through many headers where both arguments are in the
    order of levels, from top to bottom
     */
    let heading_size = all_headers[0][1].length * hops[0];
    let matrix_mask =  _.map(all_headers, (headers, index) => {
        return get_header_mask(...headers, hops[index], heading_size);
    });
    return _.intersection.apply({}, matrix_mask);
}

export function get_heading_hopper(headings, hops) {
    /*
    Builds a function from headings and their hops.
    Returned function answers with a list of header
    objects for a given position.
    If a header does not appear on this position, it won't
    be returned.

    NOTE: Since level order is important here, but I can't be bothered
    to travel with the heading order list like I've done before, on this
    I've moved to JS stable list of objects (where's OrderedDict when you
    need it...?
    */

    let hoppers = _.map(headings, (item, index) => {
        return {
            checker: get_header_from_pos(item.headers, hops[item.heading]),
            heading: item.heading};
    });

    // Checker function to go through all headers' checkers
    return (pos) => {
        return _.map(hoppers, (hopper) => {
                let active_header = hopper.checker(pos);
                if (active_header !== null) {
                    return {
                        heading: hopper.heading,
                        header: active_header,
                        hop: hops[hopper.heading]
                    };
                } else {
                    return null;
                }});
    };
}

export function get_header_from_pos (headers, hop) {
    /*
    Returns a function to check which header is active on given position
    Position can be between 0 and infinity
    */
    let heading_size = headers.length * hop;
    return (pos) => {
        let loop, inside_heading_pos, header_pos;
        // shortcut: no header start on this position
        if (pos % hop !== 0) return null;
        loop = Math.floor(pos / heading_size);
        if (loop >= 1) {
            inside_heading_pos = pos - loop * heading_size;
            header_pos = inside_heading_pos / hop;
        } else {
            header_pos = Math.floor(pos / hop);
        }
        return headers[header_pos];
    };
}

export function filter_matrix (stub_mask, heading_mask, matrix) {
    return _.map(stub_mask, (row, index) => {
        return _.map(heading_mask, (col) => {
            return matrix[row][col];
        });
    });
}
