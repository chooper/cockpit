Cockpit/Hub
===========

TODO


Getting Started
---------------

Here is how to get started:

1. Download this package and ``cd`` to it
2. ``cp cockpit/config.js.dist cockpit/config.js``
3. In one term set up the mock stream server: ``cd tools; pip install -r requirements.txt; zerorpc --server --bind 'tcp://0:1300' mock.MockServer``
4. In another term run cockpit: ``cd cockpit && sudo npm install && node app.js``


Sometimes you have to do ``sudo npm install`` twice for some reason, but I haven't gotten to the bottom of why and I haven't noticed any negative effects yet.

After these steps, you should now have fake data being served to you at http://localhost:3000/ :-)

To configure, edit ``config.js``.

