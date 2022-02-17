const SwaggerParser = require("@apidevtools/swagger-parser");

const { getResponsesApi, getRequestsAPI, wait } = require("../../utils");
const flatten = require("flat");

const resolvers = {
	Query: {
		getSimilaritiesFromAPIs: async (_, { dataAPI }) => {
			const len = dataAPI.length;
			if (len <= 1) {
				throw new Error("You need to pass at least two api for the analyzer");
			}
			const similarities = [];
			const requests = [];
			const responses = [];

			const similiaritiesBack = [];
			const requestsBack = [];
			const responsesBack = [];

			dataAPI.map(async (api, i) => {
				//Parser each API
				const parser = new SwaggerParser();
				const apiRef = await parser.dereference(api.path);
				const apiKeys = Object.keys(apiRef.paths);
				const apiValues = Object.values(apiRef.paths);

				//Report requests and responses from each API
				let reportRequestsAPI = {};
				let reportResponsesAPI = {};

				apiValues.map(async (value, i) => {
					reportResponsesAPI[apiKeys[i]] = "";
					["get", "post"].map((method) => {
						getResponsesApi(value, method, reportResponsesAPI, apiKeys, i);
						getRequestsAPI(value, method, reportRequestsAPI, apiKeys, i);
					});
					api["requests"] = [reportRequestsAPI];
					api["responses"] = [reportResponsesAPI];
				});
			});
			// Time to ensure that requests and responses are integrated for each API
			await wait(200);

			dataAPI.map((currentApi, i) => {
				dataAPI.slice(i + 1).map((targetApi) => {
					currentApi.responses.map((response, itRes) => {
						//Check response data on API
						if (Object.values(Object.values(response)[0])[0]) {
							return;
						} else {
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
											similarities.push({
												originAPI: origin,
												targetAPI: target,
											});
										}
									});
								});
							});
						}
					});
				});
			});
			console.log(similarities);

			return {
				requests: null,
				responses: null,
				similarities,
			};
		},
	},
};

module.exports = resolvers;

// dataAPI.map(async (origin, i) => {
// 	await dataAPI.slice(i + 1).map(async (target) => {
// 		let reportRequestsAPI = {};
// 		let reportResponsesAPI = {};
// 		const parser = new SwaggerParser();
// 		const originRef = await parser.dereference(origin.path);
// 		const originKeys = Object.keys(originRef.paths);
// 		const originValues = Object.values(originRef.paths);

// 		originValues.map(async (value, i) => {
// 			reportResponsesAPI[originKeys[i]] = "";
// 			["get", "post"].map((method) => {
// 				getResponsesApi(
// 					origin.name,
// 					value,
// 					method,
// 					reportResponsesAPI,
// 					originKeys,
// 					i
// 				);
// 				getRequestsAPI(value, method, reportRequestsAPI, originKeys, i);
// 			});
// 		});
// 		origin["requests"] = reportRequestsAPI;
// 		origin["responses"] = reportResponsesAPI;

// 		// responses.push(reportResponsesAPI);

// 		reportRequestsAPI = {};
// 		reportResponsesAPI = {};
// 		const targetRef = await parser.dereference(target.path);
// 		const targetKeys = Object.keys(targetRef.paths);
// 		const targetValues = Object.values(targetRef.paths);
// 		targetValues.map(async (value, i) => {
// 			reportRequestsAPI[targetKeys[i]] = "";
// 			["get", "post"].map(async (method) => {
// 				getRequestsAPI(value, method, reportRequestsAPI, targetKeys, i);
// 			});
// 		});

// 		// requests.push(reportRequestsAPI);

// 		// console.log(reportResponsesAPI, reportRequestsAPI);
// 	});
// });
// await wait(200);

// console.log(dataAPI);

// const apis = [
// 	{
// 		name: "TiTechNF",
// 		requests: [
// 			{ "/api/request/NF1": { get: [{ id: "int" }] } },
// 			{ "/api/request/NF2": { get: [{ num: "int" }] } },
// 			{ "/api/request/NF3": { post: [Object] } },
// 		],
// 		responses: [
// 			{ "/api/response/NF1": { get: [{ name: "string" }] } },
// 			{ "/api/response/NF2": { get: [{ email: "string" }] } },
// 			{
// 				"/api/response/NF3": {
// 					post: [{ name: "string" }, { id: "int" }],
// 				},
// 			},
// 		],
// 	},
// 	{
// 		name: "TiTechC",
// 		requests: [{ "/api/request/C1": { post: [{ email: "string" }] } }],
// 		responses: [
// 			{ "/api/response/C1": { get: [{ user: "string" }] } },
// 			{ "/api/response/C2": { post: [Object] } },
// 			{ "/api/response/C3": { post: [Object] } },
// 		],
// 	},
// ];
// const similarities = [];
// apis.map((currentApi, i) => {
// 	apis.slice(i + 1).map((targetApi) => {
// 		currentApi.responses.map((response, itRes) => {
// 			targetApi.requests.map((request, itReq) => {
// 				Object.values(Object.values(response)[0])[0].map((res) => {
// 					Object.values(Object.values(request)[0])[0].map((req) => {
// 						if (Object.keys(res)[0] == Object.keys(req)[0]) {
// 							let origin = {};
// 							origin["api"] = currentApi.name;
// 							origin["url"] = Object.keys(response)[0];
// 							origin["method"] = Object.keys(
// 								Object.values(response)[0]
// 							)[0];
// 							origin["parametersIn"] = Object.values(
// 								Object.values(currentApi.requests[itRes])[0]
// 							)[0];
// 							origin["parametersOut"] = Object.values(
// 								Object.values(currentApi.responses[itRes])[0]
// 							)[0];
// 							let target = {};
// 							target["api"] = targetApi.name;
// 							target["url"] = Object.keys(request)[0];
// 							target["method"] = Object.keys(
// 								Object.values(request)[0]
// 							)[0];
// 							target["parametersIn"] = Object.values(
// 								Object.values(targetApi.requests[itReq])[0]
// 							)[0];
// 							target["parametersOut"] = Object.values(
// 								Object.values(targetApi.responses[itReq])[0]
// 							)[0];
// 							similarities.push({ originAPI: origin, targetAPI: target });
// 						}
// 					});
// 				});
// 			});
// 		});
// 	});
// });

// const parametersOutByAPI = dataAPI.map(async (api, i) => {
// 	const parser = new SwaggerParser();
// 	const currentAPI = await parser.dereference(api.path);
// 	const currentAPIKeys = Object.keys(currentAPI.paths);
// 	const currentAPIValues = Object.values(currentAPI.paths);
// 	let reportparametersInAPI = [];
// 	currentAPIValues.map(async (apiValue, j) => {
// 		["get", "post"].map((method) =>
// 			getRequestsAPI(apiValue, reportparametersInAPI, currentAPIKeys, i)
// 		);
// 	});
// 	// console.log(reportparametersInAPI.map((r) => r));

// 	// console.log(currentAPIValues.map((val) => Object.keys(val)));
// 	// const x = {};
// 	// x["reponse"] = reportparametersOutByAPI;
// 	// x[api.name] = x["reponse"];
// 	// console.log(x);

// 	// console.log(Object.values(reportparametersInAPI)[0]);
// });

// const similaritiesIda = [];

// const similarities2 = await dataAPI.map(async (origin, i) => {
// 	await dataAPI.slice(i + 1).map(async (target) => {
// 		let reportResponsesAPI = {};

// 		const parser = new SwaggerParser();
// 		const originRef = await parser.dereference(origin.path);
// 		const originKeys = Object.keys(originRef.paths);
// 		const originValues = Object.values(originRef.paths);

// 		originValues.map(async (value, i) => {
// 			reportResponsesAPI[originKeys[i]] = "";
// 			["get", "post"].map((method) => {
// 				getResponsesApi(
// 					origin.name,
// 					value,
// 					method,
// 					reportResponsesAPI,
// 					originKeys,
// 					i
// 				);
// 			});
// 		});

// 		let reportRequestsAPI = {};
// 		const targetRef = await parser.dereference(target.path);
// 		const targetKeys = Object.keys(targetRef.paths);
// 		const targetValues = Object.values(targetRef.paths);
// 		targetValues.map(async (value, i) => {
// 			reportRequestsAPI[targetKeys[i]] = "";
// 			["get", "post"].map(async (method) => {
// 				getRequestsAPI(value, method, reportRequestsAPI, targetKeys, i);
// 			});
// 		});
// 		similaritiesIda.push(reportResponsesAPI);
// 		// console.log(reportResponsesAPI, reportRequestsAPI);
// 	});
// });
// await wait(200);
// console.log(similaritiesIda);

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
