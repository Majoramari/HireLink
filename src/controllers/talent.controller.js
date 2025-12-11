import { talentService } from "../services/index.js";
import { fail, success } from "../utils/response.utils.js";

export async function updateProfile(req, res) {
	const result = await talentService.updateProfile(req.user.id, req.body);
	if (!result.ok) {
		return fail({
			res,
			statusCode: result.statusCode,
			message: result.message,
			details: result.payload,
		});
	}

	return success({
		res,
		statusCode: result.statusCode,
		message: result.message,
		data: result.payload,
	});
}

export async function updateFile(req, res) {
	const result = await talentService.updateFile(
		req.file.fieldname,
		req.user.id,
		req.file,
	);

	if (!result.ok) {
		return fail({
			res,
			statusCode: result.statusCode,
			message: result.message,
			details: result.payload,
		});
	}

	return success({
		res,
		statusCode: result.statusCode,
		message: result.message,
		data: result.payload,
	});
}

export async function getFile(req, res) {
	const type = req.url.includes("avatar") ? "avatar" : "resume";
	const result = await talentService.getFile(type, req.user.id, {
		width: req.query.width || 200,
		height: req.query.height || 200,
	});

	if (!result.ok) {
		return fail({
			res,
			statusCode: result.statusCode,
			message: result.message,
			details: result.payload,
		});
	}

	return success({
		res,
		statusCode: result.statusCode,
		message: result.message,
		data: result.payload,
	});
}

export async function deleteFile(req, res) {
    const type = req.url.includes("avatar") ? "avatar" : "resume";
	const result = await talentService.deleteFile(
        type,
		req.user.id,
	);

	if (!result.ok) {
		return fail({
			res,
			statusCode: result.statusCode,
			message: result.message,
			details: result.payload,
		});
	}

	return success({
		res,
		statusCode: result.statusCode,
		message: result.message,
		data: result.payload,
	});
}
