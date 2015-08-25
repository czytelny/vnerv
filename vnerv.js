"use strict";

var vnerv = (function() {

        var routes = {};
        var DEFAULT_ROUTE = "root";

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
                var r = DEFAULT_ROUTE, transferObject = null;

                var argLength = arguments.length;
                if (argLength === 0) {
                    throw Error('A channel must be specified');
                }

                if (argLength === 2) {
                    if (isString(arguments[1])) {
                        r = arguments[1];
                    } else {
                        transferObject = arguments[1];
                    }
                }
                else if (arguments.length == 3) {
                    r = route;
                    transferObject = dto;
                }

                if (!routes[channel] || !routes[channel][r]) {
                    return;
                }

                var listeners = routes[channel][r], len = listeners.length;

                for (var i = 0; i < len; i++) {
                    routes[channel][r][i].callback(transferObject);
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
