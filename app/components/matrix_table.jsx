
import React from 'react';
import {generate_headers, PositionChecker} from '../lib/utils';

export default class MatrixTable extends React.Component {

    render() {
        let table = this.props.table;
        var active_heading = {
            name: table.heading[0],
            hops: table.meta.hops[table.heading[0]]
        };

        let first_heading = table.hopper[active_heading.name].map(
            function (heading, index) {
                return (
                    <th colSpan={active_heading.hops} key={index}>{heading.header}</th>
            );
        });

        let middle_headings = [];
        table.heading.slice(1, table.heading.length - 1).forEach((heading) => {

            let hops = table.meta.hops[heading];

            middle_headings[middle_headings.length] = <tr>{
                table.hopper[heading].map(function (heading, index) {
                return (
                    <th colSpan={hops} key={index}>{heading.header}</th>
                );
                })
            }</tr>
        });


        let last_headers = table.levels[table.heading[table.heading.length -1]];
        let last_header_gen = generate_headers(last_headers);
        let last_heading = [];
        for (var i=0; i < table.matrix[0].length; i++) {
            last_heading[last_heading.length] = <th key={i}>{
                last_header_gen.next().value
            }</th>
        }


        let checks = table.stub.slice(0, table.stub.length - 1).map((key, index) => {
            return PositionChecker(table.hopper[key]);
        });
        let last_row_headers = table.levels[table.stub[table.stub.length -1]];
        let last_rowheader_gen = generate_headers(last_row_headers);

        let data = table.matrix.map((row, index) => {
            let span_headings = get_span_headings(index, table, checks);

            let low_heading = <th key={i}>{
                last_rowheader_gen.next().value
            }</th>;


            return <tr key={index}>{
                [span_headings,
                 low_heading,
                 row.map((cell, cindex) => {
                    return <td key={index + '_' + cindex}>
                        {cell}
                    </td>})
                ]
            }</tr>
        });

        return <table>
            <thead>

            <tr>
                <th rowSpan={table.heading.length} colSpan={table.stub.length} />
                {first_heading}
            </tr>

            {middle_headings}

            <tr>
            {last_heading}
            </tr>
            </thead>
            <tbody>
            {data}
            </tbody>
            </table>;
  }
}

let get_span_headings = function (index, table, checks) {
    return checks.map((check) => {
        var heading = check(index + 1);
        if (heading) {
            return <th rowSpan={heading.hop}>{heading.header}</th>
        } else {
            return null;
        }
    })
};

/*

 {
 three: 1,
 two: 2,
 one: 6,
 second: 1,
 first: 4
 }

 */