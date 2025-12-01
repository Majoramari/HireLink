export default function errorUtils(promise) {
	return promise
		.then((data) => [undefined, data])
		.catch((error) => [error, undefined]);
}
