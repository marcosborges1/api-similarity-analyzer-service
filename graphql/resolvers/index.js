const SwaggerParser = require("@apidevtools/swagger-parser");

const {
	getNewRequestsAPI,
	getNewResponseAPI,
	getRequests2,
	wait,
	isValidAPI,
	adapateToJson,
	saveJson,
} = require("../../utils");
const flatten = require("flat");

const resolvers = {
	Query: {
		getStructure: async (_, { dataAPI }) => {
			let resultJson = [];
			let arrayJson = [];
			return dataAPI.map(async (api, api_i) => {
				if (isValidAPI(SwaggerParser, api)) {
					let parser = new SwaggerParser();
					const apiRef = await parser.dereference(api.path);
					const apiBundle = await parser.bundle(api.path);

					const apiKeys = Object.keys(apiRef.paths);
					const apiValues = Object.values(apiRef.paths);

					let requests = [];
					let responses = [];

					apiValues.map(async (apiValue, i) => {
						["get", "post", "put"].map((method) => {
							getRequests2(apiValue, method, requests, apiKeys, i, apiBundle);
							getNewResponseAPI(
								apiValue,
								method,
								responses,
								apiKeys,
								i,
								apiBundle
							);
						});
					});

					requests = adapateToJson(requests);
					responses = adapateToJson(responses);

					//Object Json
					resultJson = {
						name: api.name,
						requests,
						responses,
					};

					arrayJson.push(resultJson);

					//Save JSON
					if (api_i + 1 == dataAPI.length) {
						saveJson("data/result.json", arrayJson, 4);
					}

					return resultJson;
				} else {
					return {
						name: "Error! Any API is invalid!",
						requests: "Error! Any API is invalid!",
						responses: "Error! Any API is invalid!",
					};
				}
			});
		},
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
				requests.push([reportRequestsAPI]);
				responses.push([reportResponsesAPI]);
			});
			// Time to ensure that requests and responses are integrated for each API
			await wait(200);

			const apisExample = [
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
								post: [{ mat: "string" }, { id: "int" }],
							},
						},
					],
				},
				{
					name: "TiTechC",
					requests: [{ "/api/request/C1": { post: [{ name: "string" }] } }],
					responses: [
						{ "/api/response/C1": { get: [{ user: "string" }] } },
						{ "/api/response/C2": { post: [Object] } },
						{ "/api/response/C3": { post: [Object] } },
					],
				},
			];

			let apis = apisExample;

			apis.map((currentApi, i) => {
				apis.slice(i + 1).map((targetApi) => {
					currentApi.responses.map((response, itRes) => {
						//Check response data on API
						if (!Object.values(Object.values(response)[0])[0]) {
							return;
						} else {
							targetApi.requests.map((request, itReq) => {
								// console.log(Object.values(Object.values(response)[0]));
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

			return {
				requests: requests,
				responses: responses,
				similarities: similarities,
			};
		},
	},
};

module.exports = resolvers;
