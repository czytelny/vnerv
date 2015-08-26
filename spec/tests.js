"use strict";


describe("general", function() {
    it("lib is available", function() {
        expect(vnerv).toBeDefined();
    });
});

describe("SEND function", function() {
    var RANDOM_CHANNEL = "even";
    var RANDOM_ROUTE = "rrr";
    var listenerObj, listenerObj2;
    var routes;

    beforeEach(function() {
        routes = vnerv.resetRoutes();
        listenerObj = {
            callback: function() {
                return null;
            }
        };

        listenerObj2 = {
            callback: function() {
                return null;
            }
        };
    });

    it("should throw an error if no argument is provided", function() {
        expect(function() {
            vnerv.send()
        }).toThrowError();
    });

    it("should not call listener callback for not existing channels", function() {
        //given
        spyOn(listenerObj, 'callback');
        routes["notExistingChannel"] = {};
        routes["notExistingChannel"]["notExistingRoute"] = [listenerObj];

        //when
        vnerv.send(RANDOM_CHANNEL, RANDOM_ROUTE);

        //then
        expect(listenerObj.callback).not.toHaveBeenCalled();
    });

    it("should call listener callback for existing channel and route without DTO", function() {
        //given
        spyOn(listenerObj, 'callback');
        spyOn(listenerObj2, 'callback');

        routes[RANDOM_CHANNEL] = {};
        routes[RANDOM_CHANNEL][RANDOM_ROUTE] = [];
        routes[RANDOM_CHANNEL][RANDOM_ROUTE].push(listenerObj);

        //when
        vnerv.send(RANDOM_CHANNEL, RANDOM_ROUTE);

        //then
        expect(listenerObj.callback).toHaveBeenCalled();
        expect(listenerObj2.callback).not.toHaveBeenCalled();
    });

    it("should call listener callback for existing channel and route with DTO", function() {
        //given
        spyOn(listenerObj, 'callback');
        var dto = {message: "ddd"};

        routes[RANDOM_CHANNEL] = {};
        routes[RANDOM_CHANNEL][RANDOM_ROUTE] = [];
        routes[RANDOM_CHANNEL][RANDOM_ROUTE].push(listenerObj);

        //when
        vnerv.send(RANDOM_CHANNEL, RANDOM_ROUTE, dto);

        //then
        expect(listenerObj.callback).toHaveBeenCalledWith(dto);
    });

    it("should call all listener callbacks for existing channel", function() {
       //given
        spyOn(listenerObj, 'callback');
        spyOn(listenerObj2, 'callback');
        var ANOTHER_ROUTE = "ANOTHER_RANDOM_ROUTE";
        routes[RANDOM_CHANNEL] = {};
        routes[RANDOM_CHANNEL][RANDOM_ROUTE] = [];
        routes[RANDOM_CHANNEL][ANOTHER_ROUTE] = [];

        routes[RANDOM_CHANNEL][RANDOM_ROUTE].push(listenerObj);
        routes[RANDOM_CHANNEL][ANOTHER_ROUTE].push(listenerObj2);

        //when
        vnerv.send(RANDOM_CHANNEL);

        //then
        expect(listenerObj.callback).toHaveBeenCalled();
        expect(listenerObj2.callback).toHaveBeenCalled();
    });
});