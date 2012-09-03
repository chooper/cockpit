Cockpit/Hub
===========

TODO


Getting Started
---------------

Here is how to get started:

#. Download this package and ``cd`` to it
#. ``cp cockpit/config.js.dist cockpit/config.js``
#. In one term: ``cd tools; zerorpc-client --server --bind 'tcp://0:1300' mock.MockServer``
#. In another: ``cd cockpit && sudo npm install && node app.js``


Sometimes you have to do ``sudo npm install`` twice for some reason, but I haven't gotten to the bottom of why and I haven't noticed any neggative effects yet.

After these steps, you should now have fake data being served to you at http://localhost:3000/ :-)

To configure, edit ``config.js``.

