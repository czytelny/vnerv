"use strict";


describe("general", function() {
    it("lib is available", function() {
        expect(vnerv).toBeDefined();
    });
});

describe("SEND function", function() {
    var RANDOM_CHANNEL = "even";
    var RANDOM_ROUTE = "rrr";

    it("should throw error if no argument is provided", function() {
        expect(function() {
            vnerv.send()
        }).toThrowError();
    });

    it("should not call listener callback for not existing channels", function() {
        //given
        var listenerObj = {
            callback: function() {
                return "anything";
            }
        };
        spyOn(listenerObj, 'callback');
        var routes = vnerv.getRoutes();
        routes["channel"] = {};
        routes["channel"]["randomRoute"] = [listenerObj];

        //when
        vnerv.send(RANDOM_CHANNEL, RANDOM_ROUTE);

        //then
        expect(listenerObj.callback).not.toHaveBeenCalled();
    });

    it ("should call listener callback for existing channel", function() {
        //given
        var listenerObj = {
            callback: function() {
                return "anything";
            }
        };
        spyOn(listenerObj, 'callback').and.callThrough();

        var routes = vnerv.getRoutes();
        routes[RANDOM_CHANNEL] = {};
        routes[RANDOM_CHANNEL][RANDOM_ROUTE] = [];
        routes[RANDOM_CHANNEL][RANDOM_ROUTE].push(listenerObj);

        //when
        vnerv.send(RANDOM_CHANNEL, RANDOM_ROUTE);

        //then
        expect(listenerObj.callback).toHaveBeenCalled();
    });
});