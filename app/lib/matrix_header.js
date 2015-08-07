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

    // startpos is the place of loop times size of one set of headers
    // + the offset in last set
    let get_startpos = (loop, offset, size) => {
        let startpos = loop  * size + offset;
        console.log("startpos", startpos)
        return startpos;
    };

    let get_range = (start_pos, hop) => {
        return _.range(start_pos, start_pos + hop);
    };

    // listing all ranges times loop amount
    let get_header_mask = (loops, offset, size, hop) => {
        return _.map(_.range(loops), (loop) => {
            return get_range(get_startpos(loop, offset, size), hop);
        })
    };

    // offset is the position times hop in the original
    let get_offset = (header, headers, hop) => {
        console.log("offsetting", header, headers.indexOf(header), hop)
        return headers.indexOf(header) * hop;
    };

    let d = {};
    // for all the visible headers loop through them
    // and calculate mask for each header and return a list of all
    let mask = _.map(visible_headers, (header) => {

        let offset = get_offset(header, original_headers, hop);
        let size = hop * original_headers.length;
        let loops = heading_size / size;
        console.log("per header", offset, size, loops)

        let header_mask = _.flatten(get_header_mask(loops, offset, size, hop));
        d[header] = header_mask;
        return header_mask;
    });

    return [_.flatten(mask), d];
}

export function get_matrix_mask(all_headers, hops) {
    return _.map(all_headers, (headers, index) => {
        console.log("all", headers)
        return get_header_mask(...headers, hops[index]);
    });
}
