
import React from 'react';

export default class MatrixTable extends React.Component {

    render() {
        console.log(this)
        let table = this.props.table;
        var active_heading = {
            name: table.heading[0],
            hops: table.meta.hops[table.heading[0]]
        };

        let first_heading = table.hopper[active_heading.name].map(function (heading, index) {
            return (
                <th colSpan={active_heading.hops} key={index}>{heading.header}</th>
            );
        });

        //let headings = [];
        //for (var heading of table.heading) {
        //    table.hopper[active_heading.name].map(function (heading, index) {
        //        return (
        //            <th colSpan={active_heading.hops} key={index}>{heading.header}</th>
        //        );
        //    });
        //}

        return <table>
            <thead>
            <tr>
                <th colSpan={table.stub.length} />
                {first_heading}
            </tr>
            </thead>
            <tbody>

            </tbody>
            </table>;
  }
}

/*

 {
 three: 1,
 two: 2,
 one: 6,
 second: 1,
 first: 4
 }

 */