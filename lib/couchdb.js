var debug = require('debug')('couchdb');
const request = require('http').request;

class CouchDB {
    save(json) {
        const postData = '{"test": "test"}';
        const options = {
            hostname: '127.0.0.1',
            port: 5984,
            path: '/test',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let req = request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
        });
        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });
        req.write(postData);
        req.end();
    }

    post(json, cb) {
        const options = {
            hostname: '127.0.0.1',
            port: 5984,
            path: '/test',
            method: 'POST',
            auth: 'chopper:chopper',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let req = request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                cb(null, JSON.parse(chunk));
            });
        });
        req.on('error', function (e) {
            cb(e, null);

        });
        req.write(JSON.stringify(json));
        req.end();
    }

    put(json, cb) {
        const options = {
            hostname: '127.0.0.1',
            port: 5984,
            path: '/test',
            method: 'PUT',
            auth: 'chopper:chopper',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let req = request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.info('chunk', chunk);
                cb(null, JSON.parse(chunk));
            });
        });
        req.on('error', function (e) {
            console.info('e', e);
            cb(e, null);
        });
        req.write(JSON.stringify(json));
        req.end();
    }

//TODO: get removed doc seems return 'on data'
    get(id, cb) {
        const options = {
            hostname: '127.0.0.1',
            port: 5984,
            path: '/test/' + id,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let req = request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.info('chunk', chunk);
                cb(null, JSON.parse(chunk));
            });
        });
        req.on('error', function (e) {
            console.info('e', e);
            cb(e, null);
        });
        req.end();
    }
        //TODO: not finish yet
    query(name, ops, cb) {
        const options = {
            hostname: '127.0.0.1',
            port: 5984,
            path: '/test/_design/' + name + '/_view/' + name,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let req = request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                //console.info('chunk', chunk);
                //console.info('chunk.rows', chunk.rows);
                cb(null, chunk.rows);
                //cb(null, JSON.parse(chunk));
            });
        });
        req.on('error', function (e) {
            console.info('e', e);
            cb(e, null);
        });
        req.end();
    }

    delete(json, cb) {
        const options = {
            hostname: '127.0.0.1',
            port: 5984,
            path: '/test/' + json._id + '?rev=' + json._rev,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let req = request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                cb(null, JSON.parse(chunk));
            });
        });
        req.on('error', function (e) {
            cb(e, null);
        });
        req.end();
    }

}
module.exports = CouchDB;