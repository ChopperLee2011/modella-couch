const adaptor = require('../lib/index'),
    model = require('modella'),
    CouchDB = require('../lib/couchdb');

var User = model('User')
    .attr('name')
    .attr('nick');
var UserTwo = model('User')
    .attr('name')
    .attr('nick')
    .attr('_id');
var couchdb = new CouchDB();
User.use(adaptor(couchdb));
UserTwo.use(adaptor(couchdb));

describe('modella CouchDB', function () {

    describe('sync layer operations', function () {
        it('defines the required sync layer operations', function (done) {
            User.save.should.be.a.function;
            User.update.should.be.a.function;
            User.remove.should.be.a.function;
            User.find.should.be.a.function;
            User.get.should.be.a.function;
            //User.all.should.be.a.function;
            done();
        });
    });

    describe('save', function () {
        it('should save the model without primaryKey attribute', function (done) {
            let user = new User();
            user.name('foo');
            user.nick('baz');
            user.save(function (err, res) {
                user.primary().should.be.ok;
                res.should.be.ok;
                couchdb.get(user.primary(), function (err, doc) {
                    doc.should.be.ok;
                    doc.should.have.property('name', 'foo');
                    doc.should.have.property('nick', 'baz');
                    done();
                });
            });
        });

        it('should save the model with primaryKey attribute', function (done) {
            let user = new UserTwo();
            user.name('foo');
            user.nick('baz');
            user.save(function (err, res) {
                user.primary().should.be.ok;
                res.should.be.ok;
                couchdb.get(user.primary(), function (err, doc) {
                    doc.should.be.ok;
                    doc.should.have.property('name', 'foo');
                    doc.should.have.property('nick', 'baz');
                    done();
                });
            });
        });
    });

    //describe('update', function () {
    //    it('should update the model', function (done) {
    //        let user = new User({name: 'foo', nick: 'baz'});
    //        user.save(function (err, res) {
    //            user.primary().should.be.ok;
    //            user.name('bar');
    //            user.save(function (err, res) {
    //                user.primary().should.be.ok;
    //                res.should.be.ok;
    //                couchdb.get(user.primary(), function (err, doc) {
    //                    doc.should.be.ok;
    //                    doc.should.have.property('name', 'bar');
    //                    doc.should.have.property('nick', 'baz');
    //                    done();
    //                });
    //            });
    //        });
    //    });
    //});
    //
    describe('get', function () {
        var user;

        before(function (done) {
            user = new User({name: 'chewie', nick: 'dobs'});
            user.save(function (err, res) {
                user.primary().should.be.ok;
                res.should.be.ok;
                done();
            });
        });

        it('should work with the oid as a string', function (done) {
            var id = user.primary();

            User.get(id, function (err, model) {
                if (err) {
                    return done(err);
                }
                model.name().should.equal(user.name());
                user.name().should.equal('chewie');
                done();
            });
        });
    });
    //
    //describe('all', function () {
    //    it('should get all models', function (done) {
    //        User.all(function (err, users) {
    //            (err === null).should.be.true;
    //            users.should.have.length(4);
    //            users[0].should.be.an.instanceof(User);
    //            done();
    //        });
    //    });
    //});
    //
    describe('remove', function () {
        it('should remove the model from the db', function (done) {
            let user = new User({name: 'foo', nick: 'baz'});
            user.save(function (err, res) {
                user.primary().should.be.ok;
                res.should.be.ok;
                user.remove(function (err) {
                    (err === null).should.be.true;
                    //TODO: bug
                    couchdb.get(user.primary(), function (doc, err) {
                        //(doc === undefined).should.be.true;
                        (doc === null ).should.be.true;
                        err.should.be.ok;
                        err.should.have.property('reason', 'deleted');
                        done();
                    });
                });
            });
        });
    });
    describe('createDesignDoc', function () {
        it('should create a design document', function () {
            let expected = {
                _id: '_design/foo',
                views: {
                    foo: {
                        map: 'function (doc) {\nemit(bar);\n}'
                    }
                }
            };
            var designDoc = User.createDesignDoc('foo', function (doc) {
                emit('bar');
            }, function (err, res) {
                console.info('test res'.res);
                let expectedId = '_design/foo';
                res.ok.should.equal.true;
                res.id.should.equal.expectedId;
            });
        });
    });
    describe('query', function () {
        it('should query the db using a design document', function (done) {
            let designDoc = User.createDesignDoc('foo2', function () {
                emit(doc._id);
            }, function (err, res) {
                console.info('err',err);
                User.query('foo', {}, function (err, docs) {
                    const expected = 4;
                    const length = docs.length;
                    (err === null).should.be.true;
                    length.should.equal.expected;
                    done();
                });
            });
        });
    });
});