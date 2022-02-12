const SwaggerParser = require("@apidevtools/swagger-parser");

const { getResponsesApi, getParameterIn } = require("../../utils");
const flatten = require("flat");

const resolvers = {
	Query: {
		getSimilaritiesFromAPIs: async (_, { dataAPI }) => {
			const len = dataAPI.length;
			if (len <= 1) {
				throw new Error("You need to pass at least two api for the analyzer");
			}

			const apis = [
				{
					name: "TiTechNF",
					requests: [
						{ "/api/request/NF1": { get: [{ id: "int" }] } },
						{ "/api/request/NF2": { get: [{ num: "int" }] } },
						{ "/api/request/NF3": { post: [Object] } },
					],
					responses: [
						{ "/api/response/NF1": { get: [{ name: "string" }] } },
						{ "/api/response/NF2": { get: [{ email: "string" }] } },
						{
							"/api/response/NF3": {
								post: [{ name: "string" }, { id: "int" }],
							},
						},
					],
				},
				{
					name: "TiTechC",
					requests: [{ "/api/request/C1": { post: [{ email: "string" }] } }],
					responses: [
						{ "/api/response/C1": { get: [{ user: "string" }] } },
						{ "/api/response/C2": { post: [Object] } },
						{ "/api/response/C3": { post: [Object] } },
					],
				},
			];
			const similarities = [];
			apis.map((currentApi, i) => {
				apis.slice(i + 1).map((targetApi) => {
					currentApi.responses.map((response, itRes) => {
						targetApi.requests.map((request, itReq) => {
							Object.values(Object.values(response)[0])[0].map((res) => {
								Object.values(Object.values(request)[0])[0].map((req) => {
									if (Object.keys(res)[0] == Object.keys(req)[0]) {
										let origin = {};
										origin["api"] = currentApi.name;
										origin["url"] = Object.keys(response)[0];
										origin["method"] = Object.keys(
											Object.values(response)[0]
										)[0];
										origin["parametersIn"] = Object.values(
											Object.values(currentApi.requests[itRes])[0]
										)[0];
										origin["parametersOut"] = Object.values(
											Object.values(currentApi.responses[itRes])[0]
										)[0];
										let target = {};
										target["api"] = targetApi.name;
										target["url"] = Object.keys(request)[0];
										target["method"] = Object.keys(
											Object.values(request)[0]
										)[0];
										target["parametersIn"] = Object.values(
											Object.values(targetApi.requests[itReq])[0]
										)[0];
										target["parametersOut"] = Object.values(
											Object.values(targetApi.responses[itReq])[0]
										)[0];
										similarities.push({ originAPI: origin, targetAPI: target });
									}
								});
							});
						});
					});
				});
			});

			console.log(similarities);

			const parametersOutByAPI = dataAPI.map(async (api, i) => {
				const parser = new SwaggerParser();
				const currentAPI = await parser.dereference(api.path);
				const currentAPIKeys = Object.keys(currentAPI.paths);
				const currentAPIValues = Object.values(currentAPI.paths);
				let reportparametersOutByAPI = [];
				currentAPIValues.map(async (apiValue, j) => {
					["get", "post"].map((method) =>
						getResponsesApi(
							api.name,
							apiValue,
							method,
							reportparametersOutByAPI,
							currentAPIKeys,
							j
						)
					);
				});
				// const x = {};
				// x["reponse"] = reportparametersOutByAPI;
				// x[api.name] = x["reponse"];
				// console.log(x);

				// console.log(api.name, reportparametersOutByAPI);
			});

			// const similarities = dataAPI.map((origin, i) => {
			// 	return dataAPI.slice(i + 1).map(async (target) => {
			// 		const parser = new SwaggerParser();
			// 		const originRef = await parser.dereference(origin.path);
			// 		const originKeys = Object.keys(originRef.paths);
			// 		const originValues = Object.values(originRef.paths);

			// 		let reportResponsesAPI = {};
			// 		originValues.map(async (value, i) => {
			// 			// reportResponsesAPI[originKeys[i]] = "";
			// 			// ["get", "post"].map((method) =>
			// 			// 	getResponsesApi(method, value, reportResponsesAPI, originKeys, i)
			// 			// );
			// 			if (i == 0) {
			// 				const parserTarget = new SwaggerParser();
			// 				const targetRef = await parserTarget.dereference(target.path);
			// 				const targetValues = Object.values(targetRef.paths);
			// 				targetValues.map((res) =>
			// 					["get", "post"].map((method) => getParameterIn(res))
			// 				);
			// 			}
			// 		});

			// 		// let targetRef = await parser.dereference(target.path);
			// 		// const targetKeys = Object.keys(targetRef.paths);
			// 		// const targetValues = Object.values(targetRef.paths);

			// 		// console.log(targetValues);
			// 		// return origin.name + " " + target.name;
			// 	});
			// });
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
				similarities: similarities,
			};
		},
	},
};

module.exports = resolvers;
