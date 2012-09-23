#!/usr/bin/env python

"""
Mock ZeroRPC server
===================
Exposes some really basic and simple calls. Mainly for testing cockpit.

Usage: ``zerorpc --server --bind "tcp://0:$PORT" mock.MockServer``

Depends
-------
* zerorpc <http://zerorpc.dotcloud.com/>
"""

import time
from random import randint
import zerorpc

class MockServer(object):

    mock_data_len = 10000

    def simple_req(self):
        mock_data = [randint(0,42) for i in xrange(self.mock_data_len)]
        time.sleep(5)   # pretend it takes some time to process the request
        return mock_data

    @zerorpc.stream
    def simple_req_streaming(self):
        for i in xrange(self.mock_data_len):
            yield randint(0,42)


