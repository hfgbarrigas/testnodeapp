import fetch from 'node-fetch';

const parseResponse = async (res) => {
	if (res.status !== 200) {
		throw new Error('Error status from provider.');
	}

	const json = await res.json();
	let balance = json.balance;

	if (!balance || isNaN(balance)) {
		throw new Error('Invalid balance.');
	}
	balance = +balance;

	return balance === 0 ? 0 : balance / Math.pow(10, 18);
};

export default async (address) => {
	if (!address) {
		throw new Error('Address is mandatory.');
	}

	const url = `https://api.blockcypher.com/v1/eth/main/addrs/${address}/balance`;
	const response = await fetch(url);
	return parseResponse(response);
};
