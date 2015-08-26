"use strict";

var vnerv = (function() {
    var routes = {};
    var DEFAULT_ROUTE = "__root";

    function isString(object) {
        return (typeof object === 'string' || object instanceof String);
    }

    return {
        on: function(channel, route, callback) {
            var argLength = arguments.length;
            var _route;

            switch (argLength){
                case 0:
                    throw Error("Channel and callback must be specified");
                    break;
                case 1:
                    throw Error("Channel and callback must be specified");
                    break;

            }
        },

        off: function(channel, route, scope) {
            //todo
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
            if (!routes[channel]) {
                return;
            }

            if (_route){
                var listenersArray = routes[channel][_route];
                callListenersCallback(listenersArray);
            } else {
                //calling for all routes on the channel
                var channelRoutes = routes[channel];
                for (var r in channelRoutes) {
                    if (channelRoutes.hasOwnProperty(r)) {
                        callListenersCallback(channelRoutes[r]);
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
