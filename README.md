# vnerv 
[![Build Status](https://travis-ci.org/czytelny/vnerv.svg?branch=master)](https://travis-ci.org/czytelny/vnerv)


Tiny library for event broadcasting

I started this library as a fork of nice micro framework called Nerve - https://github.com/jstandish/nerve. 
I decided to create a separate repository because of a fundamental change - drop support for changing scope of the subscription function. Another difference is that vnerv is ES5 compliant and it has Gulp based build system.

Nevertheless basic idea is the same - sending events along channels and routes.

## It is a 'WIP' repo. Library is not ready for usage

## Attach listeners
To attach listener use `on` function and specify channel with callback:
```javascript
  vnerv.on("channel", function(dto) {
     console.log('I'm a callback function and I received: ' + dto);
  });
```
The callback function will be executed when a message appear on that channel.

Optionally, you can also specify a route:
```javascript
  vnerv.on("channel", 'route', function(dto) {
     console.log('I'm a callback function and I received: ' + dto);
  });
```

## Sending an event
You have two basic options:
##### Send an event to a channel
It will call every callback from all routes on that channel
```javascript
  vnerv.send("channel");
```

##### Send an event to a route on a specific channel
It will call every callback on a specific channel/route combination
```javascript
  vnerv.send("channel", "route");
```

As a addition in both cases you can attach DTO object which is passed to a callback function, eg.
```javascript
  vnerv.send("channel", "route", {message:'hi'} );
```
