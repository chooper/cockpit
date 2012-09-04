/*
 * cockpit/cockpit/app.js
 *
 * Gather and serve stats.
 *
 * Charles Hooper <charles@dotcloud.com>
 */

// config
// TODO: Move to config/environment
var HTTP_PORT = 3000;

// imports
var events = require('events');
var emitter = new events.EventEmitter;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var util = require('util');
var StreamClient = require('./stream_client')(emitter).StreamClient;
var config = require('./config');

emitter.on('error', function (error) {
    console.log('!ERROR!', error);
});

/* ``init_stream_clients``
 * Instantiate StreamClient objects and start start streaming data from
 * sources defined in the config.
 */
function init_stream_clients (callback) {
    console.log('init streamers');
    for (name in config.ClientList) {
        console.log('init streamer for', name);

        var call_args = ('args' in config.ClientList[name]) ? // } 
            config.ClientList[name]['args'] : [];             // }

        var sc = new StreamClient(
            name,
            config.ClientList[name]['endpoint'],
            config.ClientList[name]['call_name'],
            call_args );
        sc.run();
    }
    console.log('end init streamers');
    if (callback) callback();
};

/* ``init_ws_events``
 * Register an event handler for receiving messages on each stream.
 */
function init_ws_events (socket, callback) {
    for (event_group in config.ClientList) {
        var event_name = event_group + '_recv';
        console.log('init eventListener', event_name);

        // event_callback() returns a closure with ref to event_name
        var event_callback = function () {
            var local_event_name = event_name;
            var event_callback_closure = function (msg) {
                socket.emit(local_event_name, msg);
            };
            return event_callback_closure;
        };

        emitter.on(event_name, event_callback());
    }
    console.log('end init', event_name);
    if (callback) callback();
};

/* Event: Websocket connection
 * Register event handlers for stream on each connection.
 *
 * TODO: Do I need to unregister them on disconnect?
 */
io.sockets.on('connection', function (socket) {
    socket.emit('hi!'); // be polite
    init_ws_events(socket);
});

/* GET /
 * Send the front (and currently only) page.
 */
app.get('/', function(req, res) {
    console.log('Got request for /');
    res.sendfile('hud/index.html'); // TODO: fix path
});

// Configure and start service
app.use('/static', express.static(__dirname + '/hud/assets/static'));
server.listen(HTTP_PORT);
console.log('Listening on port', HTTP_PORT);
init_stream_clients();
