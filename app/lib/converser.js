

import d3 from 'd3';
import queue from 'queue-async';

import lodash from 'lodash';
var _ = lodash;

export function create_dispatch (event_handlers) {
    /*
    Creates a dispatcher for given event type as key : handler function list object

    Each pair registers handler functions in the dispatcher for
    said events and returns it
     */
    let prefix;
    let event_types = _.keys(event_handlers);
    let dispatch = d3.dispatch.apply(this, event_types);

    _.forOwn(event_handlers, (handlers, ev_type) => {
        if (handlers.length > 1) prefix = true;
        _.map(handlers, (handler, index) => {
            if (prefix) dispatch.on(ev_type + '._' + index, handler);
            else dispatch.on(ev_type, handler)
        });
    });
    return dispatch;
}

export var dispatchers = {};

export function register_dispatch(name, event_handlers) {
    dispatchers[name] = create_dispatch(event_handlers);
}
