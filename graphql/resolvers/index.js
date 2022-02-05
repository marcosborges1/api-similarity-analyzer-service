const SwaggerParser = require("@apidevtools/swagger-parser");

const { getResponsesApi } = require("../../utils");

const resolvers = {
	Query: {
		getSimilaritiesFromAPIs: async (_, { dataAPI }) => {
			const len = dataAPI.length;
			if (len <= 1) {
				throw new Error("You need to pass at least two api for the analyzer");
			}

			const similarities = dataAPI.map((origin, i) => {
				return dataAPI.slice(i + 1).map(async (target) => {
					let parser = new SwaggerParser();
					let originRef = await parser.dereference(origin.path);
					const originKeys = Object.keys(originRef.paths);
					const originValues = Object.values(originRef.paths);

					let reportResponsesAPI = {};
					originValues.map(async (value, i) => {
						reportResponsesAPI[originKeys[i]] = "";
						["get", "post"].map((method) =>
							getResponsesApi(method, value, reportResponsesAPI, originKeys, i)
						);
					});
					// console.log(reportResponsesAPI);

					// let targetRef = await parser.dereference(target.path);
					// const targetKeys = Object.keys(targetRef.paths);
					// const targetValues = Object.values(targetRef.paths);

					// console.log(targetValues);
					// return origin.name + " " + target.name;
				});
			});
			// .splice(0, newDataAPI.length - 1);
			// const reverse = newDataAPI.reverse();
			// console.log(similarities);

			//Get Request and Response on the first time
			// let reportAPItotal = [];
			// newDataAPI.map(async (api, k) => {
			// 	let parser = new SwaggerParser();
			// 	let ref = await parser.dereference(api.path);
			// 	const keys = Object.keys(ref.paths);
			// 	const values = Object.values(ref.paths);
			// 	let reportAPI = {};
			// 	let keyMethod = {};
			// 	values.map(async (value, i) => {
			// 		keyMethod = {};
			// 		reportAPI[keys[i]] = "";

			// 		["get", "post"].map((method) =>
			// 			getRequestsApi(method, value, keyMethod, reportAPI, keys, i)
			// 		);
			// 	});
			// 	newDataAPI[k].res = reportAPI;
			// 	// reportAPItotal.push("marcos");
			// 	console.log(newDataAPI[k]);
			// });
			// console.log(reportAPItotal);

			// let parser = new SwaggerParser();

			// // let api = await parser.dereference("/Users/marcosviniciusborges/Documents/MyApplications/micrographql/openapi/events-api-from-web.json");
			// let api = await parser.dereference(
			// 	"/Users/marcosviniciusborges/Documents/MyApplications/micrographql/openapi/events-api-from-web.json"
			// );

			// const keys = Object.keys(api.paths);
			// const values = Object.values(api.paths);

			// let reportAPI = {};
			// let keyMethod = {};

			// values.map((value, i) => {
			// 	keyMethod = {};
			// 	reportAPI[keys[i]] = "";

			// 	["get", "post"].map((method) =>
			// 		getRequestsApi(method, value, keyMethod, reportAPI, keys, i)
			// 	);
			// });
			// console.log(reportAPI);
			// return {
			// 	requests: reportAPI,
			// 	responses: reportAPI,
			// 	similarities: [
			// 		{
			// 			originAPI: {
			// 				name: "APITechC",
			// 				method: "get",
			// 				inputParameters: [{ buid: "int", customerID: "int" }],
			// 			},
			// 		},
			// 	],
			// };
			return {
				requests: "",
				responses: "",
				similarities: [
					{
						originAPI: {
							api: "APITechC",
							url: "X",
							method: "get",
							parametersIn: [{ buid: "int", customerID: "int" }],
							parametersOut: [
								{
									email: "string",
								},
							],
						},
						targetAPI: {
							api: "APITechNF",
							url: "X",
							method: "get",
							parametersIn: [{ email: "string" }],
							parametersOut: [
								{
									id: "int",
									user_name: "string",
								},
							],
						},
					},
				],
			};
		},
	},
};

module.exports = resolvers;
