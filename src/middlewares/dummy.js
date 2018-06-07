import {Log} from "../logger";

export default (req, res, next) => {
	Log.debug({
		message: 'Running the middleware'
	});

	next();
};
