
import * as React from "react";

interface Props {
    [name: string]: string,
}


export class TableHead extends React.Component<Props, {}> {
    render () {
        return <tr><th>Jee</th></tr>
    }
}


export class TableBody extends React.Component<Props, {}> {
    render () {
        return <tr><td>Jee</td></tr>
    }
}


export class HierarchicalTable extends React.Component<Props, {}> {
    render() {
        return <div id="datatable">
            <table className="pure-table pure-table-bordered">
                <thead>
                    <TableHead />
                </thead>
                <tbody>
                    <TableBody />
                </tbody>
                </table>
        </div>
    }
}