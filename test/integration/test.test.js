const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../src/server');
const nock = require('nock');
const should = chai.should();

chai.use(chaiHttp);

describe('Balance suit', function () {

	const providerUrl = 'https://api.blockcypher.com';

	it('it should GET balance correctly', function (done) {
		//prepare
		nock(providerUrl)
			.get(/738d145faabb1e00cf5a017588a9c0f998318012\/balance/)
			.reply(200, {balance: 19254563000000000});

		//act
		chai.request(server)
			.get('/api/balance/738d145faabb1e00cf5a017588a9c0f998318012')
			.end((err, res) => {
				//assert
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.balance.should.be.a('number');
				res.body.balance.should.be.eq(0.019254563);
				done();
			});
	});

	it('it should GET 502 on provider error', function (done) {
		//prepare
		nock(providerUrl)
			.get(/x\/balance/)
			.reply(333);

		//act
		chai.request(server)
			.get('/api/balance/x')
			.end((err, res) => {
				//assert
				res.should.have.status(502);
				res.body.should.be.a('object');
				res.body.message.should.be.a('string');
				res.body.code.should.be.eq('INTERNAL_SERVER_ERROR');
				done();
			});
	});
});
