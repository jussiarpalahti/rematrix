import d3 from 'd3';
import lodash from 'lodash';
var _ = lodash;

import {
    Table,
    generate_headers,
    create_header_hopper,
    remove_hidden_from_matrix,
} from './utils';

import {
    generate_matrix_headers,
    generate_hidden_check,
    generate_hidden_index,
    get_heading_hopper,
    get_matrix_mask,
    filter_matrix
} from './matrix_header';
import {get_dispatcher} from '../lib/converser';

export function FullTable(basetable, new_levels) {
    /*
     Creates a full table from table meta data
     or updates old table with new levels
     and adds meta and header structures to the clone
     */
    let table = _.cloneDeep(basetable);
    if (!table.base) {
        table.base = basetable;
        if (!table.base.meta) {
            table.base.meta = Table(table.base);
        }
    }

    if (new_levels) {
        _.forOwn(table.levels, (headers, heading) => {
            if (new_levels[heading]) table.levels[heading] = new_levels[heading];
        });
    }

    table.meta = Table(table);
    if (new_levels) {
        let heading_hops_list = hops_to_list(table.base.meta.hops, 'heading', table.base);
        let heading_headers = headings_to_mask_list(table, table.levels, table.base.levels,
            'heading');
        let stub_headers = headings_to_mask_list(table, table.levels, table.base.levels,
            'stub');
        let stub_hops_list = hops_to_list(table.base.meta.hops, 'stub', table.base);
        let heading_mask = get_matrix_mask(heading_headers, heading_hops_list);
        let stub_mask = get_matrix_mask(stub_headers, stub_hops_list);
        table.heading_mask = heading_mask;
        table.stub_mask = stub_mask;
        //table.matrix = filter_matrix(table, table.base.matrix)
    }

    table.heading_hopper = get_heading_hopper(
        heading_to_list(table.heading, table), table.meta.hops);
    table.stub_hopper = get_heading_hopper(
        heading_to_list(table.stub, table), table.meta.hops);

    return table;
}

let hops_to_list = (hops, heading, table) => {
    return _.map(table[heading], (level_ids) => {
        return hops[level_ids];
    });
};

let heading_to_list = (heading, table) => {
    return _.map(heading, (heading, index) => {
        return {
            heading: heading,
            headers: table.levels[heading]
        }
    });
};

let headings_to_mask_list = (table, new_levels, all_levels, heading) => {
    return _.map(table[heading], (level_ids) => {
        return [new_levels[level_ids], all_levels[level_ids]]
    });
};

export function build() {
    let rtable = get_table('real');
    let visible_table = get_table('real');

    return [rtable, visible_table];
}

export function handle_visibility(table, original_table, heading, headers, hidden_headers) {
    /*
    Old case: only one heading at a time gets hidden
    hidden_headers has heading: header, visibility pairs so all headings
    can be hidden
     */

    if (!hidden_headers) {
        let new_headers = [];
        _.forOwn(headers, (hidden, header) => {
            if (!hidden) new_headers.push(header);
        });
        table.levels[heading] = new_headers;
    } else if (hidden_headers) {
        _.forOwn(hidden_headers, (headers, heading) => {
            let new_headers = [];
            _.forOwn(headers, (hidden, header) => {
                if (!hidden) new_headers.push(header);
            });
            table.levels[heading] = new_headers;
        });
    }

    table.meta = Table(table);

    _.map(table.stub, (heading, index) => {
        table.hopper[heading] = create_header_hopper(table.levels[heading],
            table.meta.stub_size, table.meta.hops[heading]);
    });

    _.map(table.heading, (heading, index) => {
        table.hopper[heading] = create_header_hopper(table.levels[heading],
            table.meta.heading_size, table.meta.hops[heading]);
    });

    table.row_headers = generate_matrix_headers(table, table.stub, table.meta.stub_size);
    table.heading_headers = generate_matrix_headers(table, table.heading, table.meta.heading_size);
    let hidden_index = {
        heading: generate_hidden_index(original_table.heading_headers,
            table.heading_headers),
        stub: generate_hidden_index(original_table.row_headers,
            table.row_headers)
    };
    table.matrix = remove_hidden_from_matrix(
        original_table.matrix,
        hidden_index
    );
}

function hide_table() {

    let calc_table = {
        heading: ['one', 'two', 'three'],
        stub: ['first', 'second'],

        matrix: _.range(8).map((i) => [1,2,3,4,5,6,7,8,9,10,11,i+1]),

        levels: {
            one: ['top heading 1'],
            two: ['second heading 1', 'second heading 2', 'second heading 3'],
            three: ['third heading 1'],
            first: ['top row 2'],
            second: ['second row 1', 'second row 3', 'second row 4']
        }
    };

    calc_table.meta = Table(calc_table);

    calc_table.hopper = {
        one: create_header_hopper(calc_table.levels.one, calc_table.meta.heading_size, calc_table.meta.hops.one),
        two: create_header_hopper(calc_table.levels.two, calc_table.meta.heading_size, calc_table.meta.hops.two),
        three: create_header_hopper(calc_table.levels.three, calc_table.meta.heading_size, calc_table.meta.hops.three),
        first: create_header_hopper(calc_table.levels.first, calc_table.meta.stub_size, calc_table.meta.hops.first),
        second: create_header_hopper(calc_table.levels.second, calc_table.meta.stub_size, calc_table.meta.hops.second)
    };


    calc_table.row_headers = generate_matrix_headers(calc_table, calc_table.stub, calc_table.meta.stub_size);
    calc_table.heading_headers = generate_matrix_headers(calc_table, calc_table.heading, calc_table.meta.heading_size);

    return calc_table;
}

let SERVER = 'http://localhost:8000';
let ROUTER = {
    index: SERVER + '/',
    matrix: SERVER + '/matrix'
};

export function load_matrix(table, cb) {
    SENTINEL[table.name] = true;
    d3.json(ROUTER.matrix + table.url, (err, data) => {
        SENTINEL[table.name] = false;
        if (err) console.log("problem fetching data", err);
        else {
            console.log("fetched some data", table.url, data)
            cb(data);
        }
    });
}

/*
Sentinels are used to track ongoing network request
 */
let SENTINEL = {};
export function get_table(tableid) {
    /*
    Function goes to find a table for a given Id
    and returns a FullTable from it
     */
    let basetable = TABLES[tableid];

    let table = FullTable(basetable);
    if (table.preview || !table.matrix) {
        table.preview = false;
        table.matrix = null;
        TABLES[tableid].preview = false;
        if (!SENTINEL[table.name]) {
            SENTINEL[table.name] = true;
            load_matrix(table);
        }
    }
    return table;
}

export function fetch_table_previews(cb) {
    d3.json(ROUTER.index, (err, data) => {
        if (err) console.log("problem fetching tables", ROUTER.index, err);
        else {
            console.log("fetched some tables", data);
            _.map(data.pxdocs, (table, index) => {
                TABLES[table.name] = table;
            });
            cb(data.pxdocs); // this should render the app now that initialization is done
        }
    });
}

export function get_preview_table_levels(table, size) {
    /*
     Calculates effective levels to get a table with 30 rows and columns
     as a preview

     Heading hopper is used to ask active levels for every cell
     and added to level object's list
     */
    if (!size) size = 10;

    // initialize empty headers for levels object
    let preview_levels = _.mapValues(table.levels, () => []);
    for (let index=0; index < size; index++) {
        _.forEach(_.filter(table.heading_hopper(index)), (headings) => {
            preview_levels[headings.heading].push(headings.header);
        });
        _.forEach(_.filter(table.stub_hopper(index)), (headings) => {
            preview_levels[headings.heading].push(headings.header);
        });
    }

    // some headers repeat
    _.forOwn(preview_levels, (headers, heading) => {
       preview_levels[heading] = _.uniq(headers);
    });

    return preview_levels;
}


/*
Placeholder "database" for table meta and matrix
 */
export var TABLES = {
    test: {
        name: 'test',
        heading: ['one', 'two', 'three'],
        stub: ['first', 'second'],
        levels: {
            one: ['top heading 1', 'top heading 2'],
            two: ['second heading 1', 'second heading 2', 'second heading 3'],
            three: ['third heading 1', 'third heading 2'],
            first: ['top row 1', 'top row 2'],
            second: ['second row 1', 'second row 2', 'second row 3', 'second row 4']
        },
        matrix: _.range(8).map((i) => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, i + 1])
    }
};

export var OLD_TABLES = {
    real: {
        name: 'real',
        url: '/data/real.json',
        "heading": [
            "Sukupuoli",
            "Ikä"],
        "stub": [
            "Alue",
            "Vuosi"],
        "levels": {
            "Alue": [
                "Helsinki",
                "Espoo",
                "Vantaa",
                "Kauniainen"
            ],
            "Ikä": [
                "Väestö yhteensä",
                "0-vuotiaat",
                "1-vuotiaat",
                "2-vuotiaat"
            ],
            "Sukupuoli": [
                "Molemmat sukupuolet",
                "Miehet",
                "Naiset"
            ],
            "Vuosi": [
                "1976",
                "1977",
                "1978",
                "1979",
                "1980"]
        }
    },
    test: {
        name: 'test',
        heading: ['one', 'two', 'three'],
        stub: ['first', 'second'],
        levels: {
            one: ['top heading 1', 'top heading 2'],
            two: ['second heading 1', 'second heading 2', 'second heading 3'],
            three: ['third heading 1', 'third heading 2'],
            first: ['top row 1', 'top row 2'],
            second: ['second row 1', 'second row 2', 'second row 3', 'second row 4']
        },
        matrix: _.range(8).map((i) => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, i + 1])
    }
};
