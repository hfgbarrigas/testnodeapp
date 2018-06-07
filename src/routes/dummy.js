import express from 'express';
import dummyMiddleware from '../middlewares/dummy';
import {Log} from "../logger";
import EthProvider from '../provider/eth-balance';

const router = express.Router();

router.get('/balance/:address', dummyMiddleware, async (req, res) => {

	const {
		address
	} = req.params;

	try {
		const balance = await EthProvider(address);
		res.send({balance: balance});
	} catch (e) {
		Log.error({
			message: e.message,
			error: e
		});
		res.status(502).send({
			code: "INTERNAL_SERVER_ERROR",
			message: "Balance provider error."
		});
	}
});

export default router;


