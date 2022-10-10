const { gql } = require("apollo-server");

const querySchema = gql`
	scalar JSON
	type Report {
		requests: JSON
		responses: JSON
		similarities: [Similarities]
	}
	type Similarities {
		originAPI: API
		targetAPI: API
	}
	type API {
		url: String
		method: String
		parametersIn: JSON
		parametersOut: JSON
	}
	input inputAPI {
		name: String
		path: String
	}
	type Query {
		getSimilaritiesFromAPIs(dataAPI: [inputAPI]): Report!
		getStructure(dataAPI: [inputAPI]): [APINew]
	}

	type APINew {
		name: String
		requests: JSON
		responses: JSON
	}
`;

module.exports = querySchema;
