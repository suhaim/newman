var fs = require('fs');

/* global beforeEach, afterEach, describe, it, expect, newman */
describe('HTML reporter', function () {
    var outFile = 'out/newman-report.html';

    beforeEach(function (done) {
        fs.stat('out', function (err) {
            if (err) {
                return fs.mkdir('out', done);
            }

            done();
        });
    });

    afterEach(function (done) {
        fs.stat(outFile, function (err) {
            if (err) {
                return done();
            }

            fs.unlink(outFile, done);
        });
    });

    it('should correctly generate the html report for a successful run', function (done) {
        newman.run({
            collection: 'test/fixtures/run/single-get-request.json',
            reporters: ['html'],
            reporter: { html: { export: outFile } }
        }, function (err) {
            if (err) { return done(err); }

            fs.stat(outFile, done);
        });
    });

    it('should correctly generate the html report for a failed run', function (done) {
        newman.run({
            collection: 'test/fixtures/run/single-request-failing.json',
            reporters: ['html'],
            reporter: { html: { export: outFile } }
        }, function (err, summary) {
            expect(err).to.be(null);
            expect(summary.run.failures).to.have.length(1);
            fs.stat(outFile, done);
        });
    });

    it('should correctly produce the html report for a run with TypeError', function (done) {
        newman.run({
            collection: 'test/fixtures/run/newman-report-test.json',
            reporters: ['html'],
            reporter: { html: { export: outFile } }
        }, function (err, summary) {
            expect(err).to.be(null);
            expect(summary.run.failures).to.have.length(1);
            fs.stat(outFile, done);
        });
    });
});
