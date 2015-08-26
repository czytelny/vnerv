"use strict";

var vnerv = (function() {
    var routes = {};
    var DEFAULT_ROUTE = "__root";

    function isString(object) {
        return (typeof object === 'string' || object instanceof String);
    }

    return {
        on: function(channel, route, callback, scope) {
            //todo
        },

        off: function(channel, route, scope) {
            //todo
        },

        send: function(channel, route, dto) {
            var _route, _dto;
            var argsLength = arguments.length;
            var callListenersCallback = function(listenersArray) {
                console.log("LISTERENSAARAY "+JSON.stringify(listenersArray));
                for (var i = 0; i < listenersArray.length; i++) {
                    listenersArray[i].callback(_dto);
                }
            };
            switch (argsLength) {
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
            if (!routes[channel]) {
                return;
            }

            if (_route){
                var listeners = routes[channel][_route];
                callListenersCallback(listeners);
            } else {
                var channelListeners = routes[channel];

                for (var routeListener in channelListeners) {
                    if (channelListeners.hasOwnProperty(routeListener)) {
                        callListenersCallback(channelListeners[routeListener]);
                    }
                }
            }
        },

        getRoutes: function() {
            return routes;
        },

        resetRoutes: function() {
            routes = {};
            return routes;
        }
    };
})();
