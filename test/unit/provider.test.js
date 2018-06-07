const expect = require('chai').expect;
const chai = require('chai');
const Provider = require('../../src/provider/eth-balance').default;
const nock = require('nock');
const should = chai.should();

describe('Balance provider', function () {

	const providerUrl = 'https://api.blockcypher.com';

	it('it should throw on undefined address', async () => {
		try {
			await Provider();
		} catch (e) {
			expect(e).to.be.an('error');
			expect(e.message).to.be.eq('Address is mandatory.');
		}
	});

	it('it should throw on response with status other than 200', async () => {
		//prepare
		nock(providerUrl)
			.get(/x\/balance/)
			.reply(400, {balance: 19254563000000000});

		try {
			//act
			await Provider('x');
		} catch (e) {

			//assert
			expect(e).to.be.an('error');
			expect(e.message).to.be.eq('Error status from provider.');
		}
	});

	it('it should throw on invalid balance from response', async () => {
		//prepare
		nock(providerUrl)
			.get(/x\/balance/)
			.reply(200, {balance: 'asdf'});

		//act
		try {
			await Provider('x');
		} catch (e) {
			//assert
			expect(e).to.be.an('error');
			expect(e.message).to.be.eq('Invalid balance.');
		}
	});

	it('it should receive 0 when "0" string is received', async () => {
		//prepare
		nock(providerUrl)
			.get(/x\/balance/)
			.reply(200, {balance: '0'});

		//act
		const balance = await Provider('x');

		//assert
		expect(balance).to.be.a('number');
		expect(balance).to.be.eq(0);
	});

	it('it should receive correct balance', async () => {
		//prepare
		nock(providerUrl)
			.get(/x\/balance/)
			.reply(200, {balance: 19254563000000000});

		//act
		const balance = await Provider('x');

		//assert
		expect(balance).to.be.a('number');
		expect(balance).to.be.eq(0.019254563);
	});
});
