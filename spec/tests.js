"use strict";


describe("general", function() {
    it("lib is available", function() {
        expect(vnerv).toBeDefined();
    });
});

describe("ON function", function() {
    var CHANNEL = "myChannel";
    var ROUTE = "myRoute";
    var DEFAULT_ROUTE = "__root";
    var routes;

    beforeEach(function() {
        routes = vnerv.resetEventBus();
    });

    it("should throw error if no argument is passed", function() {
        expect(function() {
            vnerv.on();
        }).toThrowError();
    });

    it("should throw error if only one argument is passed", function() {
        expect(function() {
            vnerv.on(CHANNEL);
        }).toThrowError();
    });

    it("should throw error if two strings are passed", function() {
        expect(function() {
            vnerv.on(CHANNEL, ROUTE);
        }).toThrowError();
    });

    it("should attach listener on a channel on a default route", function() {
        //given
        var callbackFun = jasmine.createSpy('callbackFun');

        //when
        vnerv.on(CHANNEL, callbackFun);

        //then
        expect(vnerv.getEventBus()[CHANNEL][DEFAULT_ROUTE].length).toBe(1);
    });

    it("should attach listener on a route of a channel", function() {
        //given
        var callbackFun = jasmine.createSpy('callbackFun');

        //when
        vnerv.on(CHANNEL, ROUTE, callbackFun);

        //then
        expect(vnerv.getEventBus()[CHANNEL][ROUTE].length).toBe(1);
    });

    it("should attach listener with specific callback on a route of a channel", function() {
        //given
        var callbackFun = function() {
        };


        //when
        vnerv.on(CHANNEL, ROUTE, callbackFun);

        //then
        expect(vnerv.getEventBus()[CHANNEL][ROUTE].shift().callback).toBe(callbackFun);
    });

});

describe("OFF function", function() {
    var DEFAULT_ROUTE = "__root";
    var CHANNEL = "myChannel";
    var CHANNEL2 = "myChannel2";
    var ROUTE = "myRoute";
    var ROUTE2 = "myRoute2";
    var routes;
    var DTO = {};

    beforeEach(function() {
        routes = vnerv.resetEventBus();

        routes[CHANNEL] = {};
        routes[CHANNEL][DEFAULT_ROUTE] = [{}];
        routes[CHANNEL][ROUTE] = [{}, {}];

        routes[CHANNEL2] = {};
        routes[CHANNEL2][DEFAULT_ROUTE] = [{}];
        routes[CHANNEL2][ROUTE2] = [{}];
    });

    it("should throw error if no argument is passed", function() {
        expect(function() {
            vnerv.off();
        }).toThrowError();
    });

    it("should throw error if only object is passed as an argument", function() {
        expect(function() {
            vnerv.off(DTO);
        }).toThrowError();
    });

    it("should throw error if object is passed as the first argument", function() {
        expect(function() {
            vnerv.off(DTO, CHANNEL);
        }).toThrowError();
    });

    it("should remove entire channel for specified channel only", function() {
        //when
        vnerv.off(CHANNEL);

        //then
        expect(routes[CHANNEL]).toBeUndefined();
        expect(routes[CHANNEL2]).toBeDefined();
    });

    it("should remove channel's route, for specified route&channel", function() {
        //when
        vnerv.off(CHANNEL, ROUTE);

        //then
        expect(routes[CHANNEL]).toBeDefined();
        expect(routes[CHANNEL][DEFAULT_ROUTE]).toBeDefined();
        expect(routes[CHANNEL][ROUTE]).toBeUndefined();
    });

    it("should remove channel's default route , for defined route & configuration object", function() {
        //given
        DTO = {defaultRoute: true};

        //when
        vnerv.off(CHANNEL, DTO);

        //then
        expect(routes[CHANNEL]).toBeDefined();
        expect(routes[CHANNEL][ROUTE]).toBeDefined();
        expect(routes[CHANNEL][DEFAULT_ROUTE]).toBeUndefined();

    });

    it("should leave all channels untouched if channel definition does not match any of them", function() {
        //when
        vnerv.off("NOT_EXISTING");

        //then
        expect(routes[CHANNEL]).toBeDefined();
        expect(routes[CHANNEL][ROUTE]).toBeDefined();
        expect(routes[CHANNEL][DEFAULT_ROUTE]).toBeDefined();
        expect(routes[CHANNEL2]).toBeDefined();
        expect(routes[CHANNEL2][ROUTE2]).toBeDefined();
        expect(routes[CHANNEL2][DEFAULT_ROUTE]).toBeDefined();
    });

    it("should leave channel untouched if route inside it is non-existent", function() {
        //when
        vnerv.off(CHANNEL, "NOT_EXISTING");

        //then
        expect(routes[CHANNEL]).toBeDefined();
        expect(routes[CHANNEL][ROUTE]).toBeDefined();
        expect(routes[CHANNEL][DEFAULT_ROUTE]).toBeDefined();
    });
});

describe("SEND function", function() {
    var CHANNEL = "myChannel";
    var CHANNEL2 = "myChannel2";
    var ROUTE = "myRoute";
    var ROUTE2 = "myRoute2";
    var listener1Route1, listener2Route1, listener1Route2;
    var routes;

    beforeEach(function() {
        routes = vnerv.resetEventBus();

        listener1Route1 = {
            callback: function() {
            }
        };

        listener2Route1 = {
            callback: function() {
            }
        };

        listener1Route2 = {
            callback: function() {

            }
        };

        routes[CHANNEL] = {};
        routes[CHANNEL][ROUTE] = [listener1Route1, listener2Route1];
        routes[CHANNEL2] = {};
        routes[CHANNEL2][ROUTE2] = [listener1Route2];

        spyOn(listener1Route1, 'callback');
        spyOn(listener2Route1, 'callback');
        spyOn(listener1Route2, 'callback');
    });

    it("should throw an error if no argument is provided", function() {
        expect(function() {
            vnerv.send()
        }).toThrowError();
    });

    it("should not call listener callback for not existing channel&route", function() {
        //when
        vnerv.send("NOT_EXISTING", "NOT_EXISTING");

        //then
        expect(listener1Route1.callback).not.toHaveBeenCalled();
        expect(listener1Route2.callback).not.toHaveBeenCalled();
    });

    it("should not call any callback for not existing channel", function() {
        //when
        vnerv.send("NOT_EXISTING");

        //then
        expect(listener1Route1.callback).not.toHaveBeenCalled();
        expect(listener1Route2.callback).not.toHaveBeenCalled();
    });

    it("should call listener callback for existing channel and route without DTO", function() {
        //when
        vnerv.send(CHANNEL, ROUTE);

        //then
        expect(listener1Route1.callback).toHaveBeenCalled();
        expect(listener2Route1.callback).toHaveBeenCalled();
        expect(listener1Route2.callback).not.toHaveBeenCalled();
    });

    it("should call listeners callback for existing channel&route with DTO", function() {
        //given
        var dto = {message: "ddd"};

        //when
        vnerv.send(CHANNEL, ROUTE, dto);

        //then
        expect(listener1Route1.callback).toHaveBeenCalledWith(dto);
        expect(listener2Route1.callback).toHaveBeenCalledWith(dto);
        expect(listener1Route2.callback).not.toHaveBeenCalled();
    });

    it("should call all listeners callbacks for existing channel without DTO", function() {
        //when
        vnerv.send(CHANNEL);

        //then
        expect(listener1Route1.callback).toHaveBeenCalled();
        expect(listener2Route1.callback).toHaveBeenCalled();
        expect(listener1Route2.callback).not.toHaveBeenCalled();
    });

    it("should call all listeners callbacks for existing channel along with DTO", function() {
        //given
        var dto = {message: "ddd"};

        //when
        vnerv.send(CHANNEL, dto);

        //then
        expect(listener1Route1.callback).toHaveBeenCalledWith(dto);
        expect(listener2Route1.callback).toHaveBeenCalledWith(dto);
        expect(listener1Route2.callback).not.toHaveBeenCalled();
    });
});