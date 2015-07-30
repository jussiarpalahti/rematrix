
import './stylesheets/main.css';
import './stylesheets/pure/pure-min.css';

import React from 'react';
import MatrixTable from './components/matrix_table.jsx';

import lodash from 'lodash';
var _ = lodash;

import {Table, generate_headers, create_header_hopper} from '../app/lib/utils';

main();

function main() {

    let testtable = {
        heading: ['one', 'two', 'three'],
        stub: ['first', 'second'],

        matrix: _.range(8).map((i) => [1,2,3,4,5,6,7,8,9,10,11,i+1]),

        levels: {
            one: ['top heading 1', 'top heading 2'],
            two: ['second heading 1', 'second heading 2', 'second heading 3'],
            three: ['third heading 1', 'third heading 2'],
            first: ['top row 1', 'top row 2'],
            second: ['second row 1', 'second row 2', 'second row 3', 'second row 4']
        },
        hopper : {
            one: [
                {header : 'top heading 1', place: 0},
                {header : 'top heading 2', place: 6}
            ],
            two: [
                {header : 'second heading 1', place: 0},
                {header : 'second heading 2', place: 2},
                {header : 'second heading 3', place: 4},
                {header : 'second heading 1', place: 6},
                {header : 'second heading 2', place: 8},
                {header : 'second heading 3', place: 10}
            ],
            first: [
                {header : 'top row 1', place: 0, hop: 4},
                {header : 'top row 2', place: 4, hop: 4}
            ]
        }
    };

    testtable.meta = Table(testtable);

    let calc_table = {
        heading: ['one', 'two', 'three'],
        stub: ['first', 'second'],

        matrix: _.range(8).map((i) => [1,2,3,4,5,6,7,8,9,10,11,i+1]),

        levels: {
            one: ['top heading 1', 'top heading 2'],
            two: ['second heading 1', 'second heading 2', 'second heading 3'],
            three: ['third heading 1', 'third heading 2'],
            first: ['top row 1', 'top row 2'],
            second: ['second row 1', 'second row 2', 'second row 3', 'second row 4']
        }
    };

    calc_table.meta = Table(calc_table);

    calc_table.hopper = {
        one: create_header_hopper(testtable.levels.one, testtable.meta.heading_size, testtable.meta.hops.one),
        two: create_header_hopper(testtable.levels.two, testtable.meta.heading_size, testtable.meta.hops.two),
        three: create_header_hopper(testtable.levels.three, testtable.meta.heading_size, testtable.meta.hops.three),
        first: create_header_hopper(testtable.levels.first, testtable.meta.stub_size, testtable.meta.hops.first),
        second: create_header_hopper(testtable.levels.second, testtable.meta.stub_size, testtable.meta.hops.second)
    };

    let realtable = real_table();

    var app = document.createElement('div');
    document.body.appendChild(app);

    React.render(<div>
        <h1>React Table Viewer</h1>
        <MatrixTable table={realtable} />
    </div>, app);
}

function real_table() {
    let table = {
    "matrix": [
    [
        "498680",
        "6329",
        "5827",
        "4921",
        "221072",
        "3337",
        "2897",
        "2511",
        "277608",
        "2992",
        "2930",
        "2410"
    ],
    [
        "493847",
        "6064",
        "5902",
        "5561",
        "219024",
        "3195",
        "3098",
        "2754",
        "274823",
        "2869",
        "2804",
        "2807"
    ],
    [
        "487519",
        "5816",
        "5657",
        "5468",
        "216505",
        "2955",
        "2991",
        "2860",
        "271014",
        "2861",
        "2666",
        "2608"
    ],
    [
        "484879",
        "5602",
        "5561",
        "5475",
        "215386",
        "2848",
        "2840",
        "2918",
        "269493",
        "2754",
        "2721",
        "2557"
    ],
    [
        "483743",
        "5724",
        "5319",
        "5307",
        "215117",
        "2949",
        "2704",
        "2707",
        "268626",
        "2775",
        "2615",
        "2600"
    ],
    [
        "120632",
        "2099",
        "2027",
        "1801",
        "58136",
        "1071",
        "1035",
        "972",
        "62496",
        "1028",
        "992",
        "829"
    ],
    [
        "123388",
        "2221",
        "2136",
        "2023",
        "59596",
        "1170",
        "1096",
        "1040",
        "63792",
        "1051",
        "1040",
        "983"
    ],
    [
        "126735",
        "2185",
        "2307",
        "2184",
        "61145",
        "1110",
        "1213",
        "1128",
        "65590",
        "1075",
        "1094",
        "1056"
    ],
    [
        "129758",
        "2085",
        "2236",
        "2312",
        "62496",
        "1095",
        "1111",
        "1182",
        "67262",
        "990",
        "1125",
        "1130"
    ],
    [
        "133712",
        "2177",
        "2171",
        "2287",
        "64489",
        "1088",
        "1144",
        "1145",
        "69223",
        "1089",
        "1027",
        "1142"
    ],
    [
        "117520",
        "2284",
        "2127",
        "1910",
        "57558",
        "1184",
        "1051",
        "963",
        "59962",
        "1100",
        "1076",
        "947"
    ],
    [
        "121734",
        "2336",
        "2342",
        "2161",
        "59622",
        "1190",
        "1241",
        "1078",
        "62112",
        "1146",
        "1101",
        "1083"
    ],
    [
        "125516",
        "2343",
        "2379",
        "2395",
        "61473",
        "1215",
        "1214",
        "1257",
        "64043",
        "1128",
        "1165",
        "1138"
    ],
    [
        "127403",
        "2192",
        "2326",
        "2378",
        "62349",
        "1168",
        "1211",
        "1198",
        "65054",
        "1024",
        "1115",
        "1180"
    ],
    [
        "129807",
        "2234",
        "2229",
        "2330",
        "63452",
        "1168",
        "1180",
        "1207",
        "66355",
        "1066",
        "1049",
        "1123"
    ],
    [
        "6915",
        "104",
        "77",
        "79",
        "3312",
        "49",
        "45",
        "43",
        "3603",
        "55",
        "32",
        "36"
    ],
    [
        "7033",
        "79",
        "100",
        "82",
        "3389",
        "40",
        "53",
        "50",
        "3644",
        "39",
        "47",
        "32"
    ],
    [
        "7050",
        "89",
        "80",
        "102",
        "3386",
        "44",
        "43",
        "57",
        "3664",
        "45",
        "37",
        "45"
    ],
    [
        "7029",
        "76",
        "87",
        "81",
        "3397",
        "49",
        "45",
        "45",
        "3632",
        "27",
        "42",
        "36"
    ],
    [
        "7027",
        "60",
        "78",
        "99",
        "3401",
        "29",
        "48",
        "50",
        "3626",
        "31",
        "30",
        "49"
    ]
],
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
    };

    table.meta = Table(table);

    table.hopper = {
        Alue: create_header_hopper(table.levels.Alue, table.meta.stub_size, table.meta.hops.Alue),
        Vuosi: create_header_hopper(table.levels.Vuosi, table.meta.stub_size, table.meta.hops.Vuosi),
        Sukupuoli: create_header_hopper(table.levels.Sukupuoli, table.meta.heading_size, table.meta.hops.Sukupuoli),
        'Ikä': create_header_hopper(table.levels['Ikä'], table.meta.heading_size, table.meta.hops['Ikä'])
    };
    return table;
}