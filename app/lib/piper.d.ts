
interface DataHandlerCallback {
    (data:any): void;
}

declare module piper {
    export function get_data (callback: DataHandlerCallback): void;
    export function piping (start:Object, callback: DataHandlerCallback): void;
    export function clsnames (...all: any[]): any;
}

export = piper;
