const SwaggerParser = require("@apidevtools/swagger-parser");
const { unflatten } = require("flat");
const {
	replaceRange,
	extractArrayType,
	removeArrayType,
} = require("../../utils");
const flatten = require("flat");

const resolvers = {
	Query: {
		getSimilaritiesFromAPIs: async (_, { dataAPI }) => {
			const len = dataAPI.length;
			if (len <= 1) {
				throw new Error("You need to pass at least two api for the analyzer");
			}
			let parser = new SwaggerParser();

			// let api = await parser.dereference("/Users/marcosviniciusborges/Documents/MyApplications/micrographql/openapi/events-api-from-web.json");
			let api = await parser.dereference(
				"/Users/marcosviniciusborges/Documents/MyApplications/micrographql/openapi/events-api-from-web.json"
			);

			const keys = Object.keys(api.paths);
			const values = Object.values(api.paths);

			let reportAPI = {};
			let keyMethod = {};

			values.map((value, i) => {
				keyMethod = {};
				reportAPI[keys[i]] = "";

				["get", "post"].map((method) =>
					getRequestsApi(method, value, keyMethod, reportAPI, keys, i)
				);
			});
			console.log(reportAPI["/api/v1/itemusages"]);
			return {
				requests: reportAPI,
				responses: reportAPI,
			};
		},
	},
};

module.exports = resolvers;

function getRequestsApi(method, value, keyMethod, reportAPI, keys, i) {
	if (value.hasOwnProperty(method)) {
		infoValuesa = {};
		const aux =
			value[method]["responses"]["200"]["content"]["application/json"][
				"schema"
			];

		const entries = Object.entries(flatten(aux));

		entries.map((entry) => {
			const key = entry[0];
			const value = entry[1];

			if (RegExp(/.type/).test(key)) {
				const keyWord = "properties";
				const indexBegin = key.indexOf(keyWord);
				const newKey = replaceRange(key, 0, indexBegin + 11, "")
					.replace(/properties./gi, "")
					.replace(".type", "");
				infoValuesa[newKey] = value;
			}
		});

		const extractedArray = extractArrayType(infoValuesa);
		const newCorrectArray = removeArrayType(infoValuesa, extractedArray);

		let newA = {};
		newCorrectArray.map((entry) => {
			newA[entry[0]] = entry[1];
		});

		keyMethod["response"] = unflatten(newA);
		const methodAux = {};
		methodAux[method] = keyMethod;
		reportAPI[keys[i]] = methodAux;
	}
}
