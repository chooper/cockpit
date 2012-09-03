
// Stream client
// Subscribes to ZeroRPC streaming REQ/REP and emits events
// with recv'd object as the message

var emitter = null;
var zpc = require('zerorpc');

var StreamClient = function(event_name, endpoint, call_name, call_args) {
    /* args: (event_name, endpoint, call_name, call_args)
     *
     *      event_name: What to name the registered events
     *
     *      endpoint:   Something the ZeroRPC client can connect to,
     *                  e.g. tcp://localhost:1024
     *
     *      call_name:  The name of the remote method
     *
     *      call_args:  A list of arguments to be passed to the remote method
     *                  LIMITATION: Currently not implemented.
     */
    this._event     = event_name;
    this._endpoint  = endpoint;
    this._call_name = call_name;

    this._call_args = [];
    if (call_args)
        this._call_args = call_args;

    this._client = new zpc.Client();
};
StreamClient.prototype = new Object;

/* ``StreamClient.run``
 * Call remote streaming method and submit a callback to emit events
 * on recv
 */
StreamClient.prototype.run = function () {
    var this_ = this; // Reference created for use in closure

    // ``invoke_callback`` returns closure that emits events on
    // received message or on error. May optionally retry.
    function invoke_callback () {
        function closure (error, res, more) {
            if (error) {
                var event_name = this_._event + '_error';
                console.log(event_name, error);
                emitter.emit(event_name, error);
                this_.run(); // retry
            } else {
                if (res) {
                    var event_name = this_._event + '_recv';
                    console.log(event_name, res);
                    emitter.emit(event_name, res);
                }
                if (!more) {
                    //this_.run(); // retry
                }
            }
        };
        return closure
    };

    // Connect to and invoke remote zerorpc method
    this._client.connect(this._endpoint);
    var invoke_args = [this._call_name].concat(this._call_args).concat(invoke_callback());
    this._client.invoke.apply(this._client, invoke_args);
};

// The magic below allows the app using this lib to pass in its own
// EventEmitter, else this is basically useless.
module.exports = function (EventEmitter) {
    emitter = EventEmitter;
    return {
        'StreamClient': StreamClient
    };
};

