
interface DataHandlerCallback {
    (data:any): void;
}

declare module piper {
    export function get_data (callback: DataHandlerCallback): void;
    export function piping (start:Object, callback: DataHandlerCallback): void;
    export function clsnames (...all: any[]): any;
    export function get_chosen (...all: any[]): any;
    export function select_data (e:any): any;
}

export = piper;
