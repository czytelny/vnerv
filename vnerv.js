"use strict";

var vnerv = (function() {
    var eventBus = {};
    var DEFAULT_ROUTE = "__root";

    function isString(object) {
        return (typeof object === 'string' || object instanceof String);
    }

    function isFunction(object) {
        return (typeof object === "function")
    }

    return {
        on: function(channel, route, callback) {
            var argLength = arguments.length;
            var _route, _callback;

            switch (argLength){
                case 0:
                    throw Error("Channel and callback must be specified");
                    break;
                case 1:
                    throw Error("Channel and callback must be specified");
                    break;
                case 2:
                    //channel and route specified
                    if(isString(route) || !isString(channel)){
                        throw Error("Channel and callback function must be specified");
                    }
                    //channel and callback specified
                    _route = DEFAULT_ROUTE;
                    _callback = route;
                    break;
                case 3:
                    if(isString(channel) && isString(route) && isFunction(callback)){
                        _route = route;
                        _callback = callback;
                    } else {
                        throw Error("Channel, route and callback function must be specified");
                    }
                    break;

            }
            //channel doesn't exist
            if(!eventBus[channel]) {
                eventBus[channel] = {};
            }
            //route doesn't exist
            if(!eventBus[channel][_route]){
                eventBus[channel][_route] = [];
            }

            eventBus[channel][_route].push({
                callback: _callback
            });

        },

        off: function(channel, route) {
            var argLength = arguments.length;

            switch(argLength) {
                case 0:
                    throw Error('A channel must be specified');
                    break;
                case 1:
                    if(!isString(channel)) {
                        throw Error('A channel cannot be an Object');
                    }
                    break;
                case 2:
                    if(!isString(channel)) {
                        throw Error('A channel cannot be an Object');
                    }
                    break;
            }

            if(typeof route === "undefined") {
                delete eventBus[channel];
            }

            if(isString(route)) {
                delete eventBus[channel][route];
            }

            if(typeof route === "object" && route.defaultRoute === true) {
                delete eventBus[channel][DEFAULT_ROUTE];
            }
        },

        send: function(channel, route, dto) {
            var _route, _dto;
            var argLength = arguments.length;

            var callListenersCallback = function(listenersArray) {
                for (var i = 0; i < listenersArray.length; i++) {
                    listenersArray[i].callback(_dto);
                }
            };

            switch (argLength) {
                case 0:
                    throw Error('A channel must be specified');
                    break;
                case 2:
                    if (isString(arguments[1])) {
                        _route = arguments[1];
                        break;
                    }
                    _dto = arguments[1];
                    break;
                case 3:
                    _route = route;
                    _dto = dto;
                    break;
            }
            //channel doesn't exist
            if (!eventBus[channel]) {
                return;
            }

            if (_route){
                var listenersArray = eventBus[channel][_route];
                callListenersCallback(listenersArray);
            } else {
                //calling for all routes on the channel
                var channelRoutes = eventBus[channel];
                for (var r in channelRoutes) {
                    if (channelRoutes.hasOwnProperty(r)) {
                        callListenersCallback(channelRoutes[r]);
                    }
                }
            }
        },

        getEventBus: function() {
            return eventBus;
        },

        resetEventBus: function() {
            eventBus = {};
            return eventBus;
        }
    };
}());
