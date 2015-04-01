var debug = require('debug')('modella:couchdb');
const request = require('http').request,
    querystring = require('querystring');

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
                cb(null, JSON.parse(chunk));
            });
        });
        req.on('error', function (e) {
            cb(e, null);
        });
        req.end();
    }

    delete(json, cb) {
        const qs = querystring.stringify({rev: json._rev});
        const options = {
            hostname: '127.0.0.1',
            port: 5984,
            path: '/test/' + json._id,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let req = request(options, function (res) {
            res.setEncoding('utf8');
            console.info('res',res);
            res.on('data', function (chunk) {
                cb(null, JSON.parse(chunk));
            });
        });
        req.on('error', function (e) {
            cb(e, null);
        });
        console.info('qs',qs);
        req.write(qs);
        req.end();
    }

}
module.exports = CouchDB;