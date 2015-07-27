
export function Table(table) {
    return getSize(table);
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
}
