
import './stylesheets/pure/pure-min.css';
import './stylesheets/main.css';

import React from 'react';
import csp from 'js-csp';
import {
    MatrixTable,
    HeaderTable,
    HiddenTable,
    HoppingTable
} from './components/matrix_table.jsx';
import App from './components/App.jsx'
import Menu from './components/Menu.jsx';
import TableSelect from './components/TableSelect.jsx'

import lodash from 'lodash';
var _ = lodash;

import {
    Table,
    generate_headers,
    create_header_hopper,
    remove_hidden_from_matrix
} from '../app/lib/utils';
import {
    generate_matrix_headers,
    generate_hidden_check,
    generate_hidden_index,
    get_heading_hopper,
    get_header_mask
} from '../app/lib/matrix_header';

import {build, handle_visibility, get_table} from './lib/table_utils';
import {register_dispatch, get_dispatcher, del_dispatcher} from './lib/converser';
import {TABLES, fetch_table_previews, FullTable, get_preview_table_levels} from './lib/table_utils';
import {TableStore} from './lib/table_store';
import {VizBase} from './components/viz';

let Main = React.createClass({
    getInitialState : function () {
        return {
            table: null,
            tables: this.props.store.get_list(),
            chosen_table: null,
            vizdata: null
        };
    },
    componentDidMount: function () {
        let update_cb = () => {
            if (!this.state.tables && this.props.store.is_open()) {
                let tables = this.props.store.get_list();
                this.setState({tables: tables});
            }
            else if (this.props.store.is_open() && this.state.chosen_table) {
                let table = this.props.store.get_table(this.state.chosen_table);
                if (table) {
                    this.setState(
                        {table: table});
                }
            }
        };
        this.props.store.on_change(update_cb);
    },

    on_table_change: function(tableid) {
        this.setState({
            chosen_table: tableid
        });
        let table = this.props.store.get_table(tableid);
        if (table) {
            let vizdata = this.props.store.viz_data(tableid);
            console.log("chosen stuff", vizdata);
            this.setState({
                table: table,
                vizdata: vizdata
            });
        }
    },

    on_choice: function(heading, headers) {
        this.props.store.set_choices(this.state.table, heading, headers);
    },

    componentWillUnmount: function () {
        del_dispatcher('app');
    },
    render: function () {
        let table = null;
        if (this.state.table) {
            table = <div>
                <MenuBar table={this.state.table} on_choice={this.on_choice} />
                <HoppingTable table={this.state.table} />
                <VizBase data={this.state.vizdata} />
            </div>;
        }
        return <div>
            <div className="top_header"><TableSelect
                tables={this.state.tables}
                on_change={this.on_table_change}
                chosen_table={this.state.table ? this.state.table.name : null}/></div>
            {table}
        </div>
    }
});

let MenuBar = React.createClass({
    render: function () {
        return <div>
            <div className="header_menu">
            <div>Rows</div>
            {this.props.table.stub.map((heading, index) => {
                return <Menu on_choice={this.props.on_choice} key={index}
                             visible={this.props.table.levels[heading]}
                             menu={this.props.table.base.levels[heading]}
                             name={heading}/>
            })}</div>
            <div className="header_menu">
                <div>Columns</div>
                {this.props.table.heading.map((heading, index) => {
                    return <Menu on_choice={this.props.on_choice} key={index}
                                 visible={this.props.table.levels[heading]}
                                 menu={this.props.table.base.levels[heading]}
                                 name={heading}/>
                })}</div>
        </div>
    }
});

function main() {
    var app = document.createElement('div');
    document.body.appendChild(app);

    // TODO: just to help with testing, remove at earliest convenience
    //let table = helper();

    let store = TableStore();
    React.render(<div>
        <h1>React Table Viewer</h1>
        <Main store={store} />
    </div>, app);

}

function helper() {
    let full_table = FullTable(big_table);
    let preview = get_preview_table_levels(full_table, 10);

    let small_table = FullTable(_.clone(full_table), preview);

    return small_table;

    let basetable = get_table("test");
    let headings = _.map(basetable.heading, (heading, index) => {
       return {
           heading: heading,
           headers: basetable.levels[heading]
       }
    });
    let stubs = _.map(basetable.stub, (heading, index) => {
        return {
            heading: heading,
            headers: basetable.levels[heading]
        }
    });

    basetable.heading_hopper = get_heading_hopper(headings, basetable.meta.hops);
    basetable.stub_hopper = get_heading_hopper(stubs, basetable.meta.hops);

    return basetable;
}

let big_table = {
    "heading": [
        "Talotyyppi",
        "Vuosi"
    ],
    "levels": {
        "Alue": [
            "Helsinki",
            "Espoo",
            "Vantaa",
            "Kauniainen",
            "Hyvink\u00e4\u00e4",
            "J\u00e4rvenp\u00e4\u00e4",
            "Kerava",
            "Kirkkonummi",
            "M\u00e4nts\u00e4l\u00e4",
            "Nurmij\u00e4rvi",
            "Pornainen",
            "Sipoo",
            "Tuusula",
            "Vihti",
            "P\u00e4\u00e4kaupunkiseutu",
            "Kehysalue",
            "Helsingin seutu",
            "Uusimaa",
            "Suomi"
        ],
        "Henkil\u00f6luku": [
            "Asuntokunnat yhteens\u00e4",
            "Henkil\u00f6luku 1",
            "Henkil\u00f6luku 2",
            "Henkil\u00f6luku 3",
            "Henkil\u00f6luku 4",
            "Henkil\u00f6luku 5",
            "Henkil\u00f6luku 6",
            "Henkil\u00f6luku 7+"
        ],
        "Talotyyppi": [
            "Asuntokunnat yhteens\u00e4",
            "Erillinen pientalo",
            "Rivi- tai ketjutalo",
            "Asuinkerrostalo",
            "Muu tai tuntematon"
        ],
        "Vuosi": [
            "1980",
            "1985",
            "1986",
            "1987",
            "1988",
            "1989",
            "1990",
            "1991",
            "1992",
            "1993",
            "1994",
            "1995",
            "1996",
            "1997",
            "1998",
            "1999",
            "2000",
            "2001",
            "2002",
            "2003",
            "2004",
            "2005",
            "2006",
            "2007",
            "2008",
            "2009",
            "2010",
            "2011",
            "2012",
            "2013",
            "2014"
        ]
    },
    "matrix": [
        [
            "218572",
            "225710",
            "228798",
            "232290",
            "234966",
            "237589",
            "240550",
            "243759",
            "246878",
            "251391",
            "256219",
            "262795",
            "265257",
            "268288",
            "271794",
            "274615",
            "277647",
            "282251",
            "284449",
            "286167"
        ],
        [
            "84283",
            "90392",
            "93052",
            "95852",
            "99288",
            "102813",
            "105718",
            "108517",
            "111929",
            "114772",
            "118359",
            "122902",
            "124782",
            "125956",
            "127896",
            "129890",
            "131541",
            "134736",
            "136973",
            "138808"
        ],
        [
            "63830",
            "68510",
            "69843",
            "71290",
            "72026",
            "72692",
            "73344",
            "74332",
            "74393",
            "75484",
            "76763",
            "78454",
            "78888",
            "80069",
            "81283",
            "82505",
            "83840",
            "85665",
            "86261",
            "87098"
        ],
        [
            "36251",
            "34344",
            "34022",
            "33651",
            "32730",
            "31855",
            "31457",
            "31020",
            "30586",
            "30746",
            "30587",
            "30652",
            "30752",
            "30817",
            "31040",
            "30726",
            "30811",
            "30761",
            "30629",
            "29958"
        ],
        [
            "25346",
            "24305",
            "24040",
            "23708",
            "23156",
            "22519",
            "22112",
            "21679",
            "21665",
            "21652",
            "21651",
            "21778",
            "21814",
            "22205",
            "22058",
            "21976",
            "21801",
            "21552",
            "21244",
            "20908"
        ],
        [
            "6757",
            "6279",
            "6097",
            "6079",
            "6069",
            "5986",
            "6046",
            "6204",
            "6232",
            "6496",
            "6554",
            "6584",
            "6668",
            "6766",
            "7000",
            "7027",
            "7104",
            "7042",
            "6919",
            "6905"
        ],
        [
            "1416",
            "1125",
            "1158",
            "1112",
            "1129",
            "1114",
            "1214",
            "1288",
            "1307",
            "1422",
            "1499",
            "1577",
            "1555",
            "1622",
            "1665",
            "1638",
            "1686",
            "1669",
            "1577",
            "1608"
        ],
        [
            "689",
            "755",
            "586",
            "598",
            "568",
            "610",
            "659",
            "719",
            "766",
            "819",
            "806",
            "848",
            "798",
            "853",
            "852",
            "853",
            "864",
            "826",
            "846",
            "882"
        ],
        [
            "50181",
            "59017",
            "60962",
            "63170",
            "65068",
            "66493",
            "68112",
            "69803",
            "71810",
            "73955",
            "76071",
            "78489",
            "80586",
            "82527",
            "84386",
            "86704",
            "88554",
            "90762",
            "93592",
            "95561"
        ],
        [
            "11165",
            "14200",
            "14871",
            "15723",
            "16682",
            "17622",
            "18586",
            "19499",
            "20693",
            "22005",
            "23301",
            "24479",
            "25289",
            "26033",
            "26637",
            "27433",
            "28050",
            "28995",
            "30284",
            "31631"
        ],
        [
            "13115",
            "16111",
            "17098",
            "18279",
            "19134",
            "19784",
            "20430",
            "21138",
            "21908",
            "22566",
            "23040",
            "23843",
            "24582",
            "25262",
            "26110",
            "27205",
            "28049",
            "29133",
            "30435",
            "30885"
        ],
        [
            "11150",
            "12222",
            "12249",
            "12305",
            "12480",
            "12373",
            "12306",
            "12349",
            "12255",
            "12305",
            "12559",
            "12681",
            "12844",
            "13091",
            "13193",
            "13468",
            "13592",
            "13735",
            "13765",
            "13953"
        ],
        [
            "10823",
            "12046",
            "12246",
            "12333",
            "12183",
            "12038",
            "11871",
            "11706",
            "11680",
            "11689",
            "11620",
            "11796",
            "12041",
            "12157",
            "12366",
            "12511",
            "12757",
            "12754",
            "12900",
            "12942"
        ],
        [
            "3128",
            "3419",
            "3479",
            "3482",
            "3568",
            "3593",
            "3727",
            "3817",
            "3867",
            "3945",
            "4029",
            "4140",
            "4214",
            "4297",
            "4389",
            "4427",
            "4460",
            "4521",
            "4631",
            "4620"
        ],
        [
            "614",
            "713",
            "713",
            "716",
            "713",
            "742",
            "779",
            "819",
            "869",
            "883",
            "898",
            "913",
            "963",
            "1006",
            "1006",
            "1023",
            "1033",
            "1031",
            "1044",
            "1021"
        ],
        [
            "186",
            "306",
            "306",
            "332",
            "308",
            "341",
            "413",
            "475",
            "538",
            "562",
            "624",
            "637",
            "653",
            "681",
            "685",
            "637",
            "613",
            "593",
            "533",
            "509"
        ],
        [
            "48101",
            "54323",
            "55759",
            "57386",
            "59058",
            "60448",
            "62404",
            "64020",
            "65951",
            "67565",
            "69689",
            "71008",
            "72149",
            "73142",
            "74488",
            "75757",
            "77148",
            "78460",
            "79928",
            "81639"
        ],
        [
            "10112",
            "12384",
            "12876",
            "13701",
            "14654",
            "15768",
            "16970",
            "17795",
            "19319",
            "20769",
            "22216",
            "23147",
            "23758",
            "24211",
            "24730",
            "25211",
            "25932",
            "26653",
            "27486",
            "28704"
        ],
        [
            "12233",
            "15189",
            "15989",
            "16747",
            "17785",
            "18628",
            "19454",
            "20287",
            "20980",
            "21064",
            "21701",
            "22040",
            "22553",
            "22866",
            "23604",
            "24354",
            "24908",
            "25751",
            "26428",
            "26989"
        ],
        [
            "11585",
            "12120",
            "12276",
            "12339",
            "12258",
            "11954",
            "11958",
            "11981",
            "11794",
            "11861",
            "11791",
            "11815",
            "11784",
            "11798",
            "11850",
            "11868",
            "11914",
            "11817",
            "11840",
            "11926"
        ],
        [
            "10609",
            "11087",
            "11030",
            "10958",
            "10758",
            "10467",
            "10286",
            "10157",
            "10097",
            "10015",
            "10088",
            "9992",
            "9896",
            "9999",
            "9980",
            "9790",
            "9827",
            "9722",
            "9666",
            "9543"
        ],
        [
            "2767",
            "2805",
            "2823",
            "2863",
            "2820",
            "2804",
            "2861",
            "2860",
            "2855",
            "2938",
            "2950",
            "3026",
            "3117",
            "3212",
            "3198",
            "3296",
            "3370",
            "3307",
            "3298",
            "3300"
        ],
        [
            "564",
            "537",
            "561",
            "574",
            "562",
            "567",
            "584",
            "632",
            "621",
            "634",
            "668",
            "709",
            "725",
            "734",
            "753",
            "820",
            "838",
            "846",
            "840",
            "827"
        ],
        [
            "231",
            "201",
            "204",
            "204",
            "221",
            "260",
            "291",
            "308",
            "285",
            "284",
            "275",
            "279",
            "316",
            "322",
            "373",
            "418",
            "359",
            "364",
            "370",
            "350"
        ],
        [
            "2480",
            "2704",
            "2724",
            "2802",
            "2873",
            "2888",
            "2913",
            "2930",
            "3056",
            "3071",
            "3088",
            "3104",
            "3132",
            "3173",
            "3179",
            "3196",
            "3220",
            "3234",
            "3274",
            "3278"
        ],
        [
            "564",
            "607",
            "603",
            "655",
            "694",
            "700",
            "721",
            "743",
            "793",
            "783",
            "796",
            "794",
            "804",
            "819",
            "825",
            "850",
            "859",
            "862",
            "877",
            "890"
        ],
        [
            "555",
            "660",
            "696",
            "749",
            "769",
            "789",
            "815",
            "822",
            "870",
            "900",
            "902",
            "940",
            "934",
            "951",
            "958",
            "975",
            "1016",
            "1025",
            "1046",
            "1042"
        ],
        [
            "455",
            "464",
            "466",
            "467",
            "494",
            "512",
            "508",
            "482",
            "501",
            "511",
            "504",
            "476",
            "474",
            "482",
            "489",
            "463",
            "456",
            "460",
            "466",
            "440"
        ],
        [
            "596",
            "637",
            "617",
            "611",
            "610",
            "571",
            "550",
            "544",
            "541",
            "532",
            "530",
            "549",
            "554",
            "558",
            "535",
            "536",
            "526",
            "520",
            "528",
            "527"
        ],
        [
            "249",
            "272",
            "274",
            "258",
            "246",
            "247",
            "255",
            "258",
            "261",
            "241",
            "253",
            "240",
            "254",
            "265",
            "271",
            "272",
            "266",
            "261",
            "263",
            "291"
        ]
    ],
    "name": "asunnot.px",
    "stub": [
        "Alue",
        "Henkil\u00f6luku"
    ],
    "title": "Asuntokunnat henkil\u00f6luvun ja talotyypin mukaan 31.12.",
    "url": "/asunnot.px"
};

main();
