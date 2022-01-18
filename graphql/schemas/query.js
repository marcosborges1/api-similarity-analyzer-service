const { gql } = require("apollo-server");

const querySchema = gql`
	scalar JSON
	type Report {
		requests: JSON
		responses: JSON
	}
	type Similarities {
		originAPI: API
		targetAPI: API
	}
	type API {
		url: String
		method: String
		inputParameters: JSON
		outuputParameters: JSON
	}
	input inputAPI {
		name: String
		path: String
	}
	type Query {
		getSimilaritiesFromAPIs(dataAPI: [inputAPI]): Report!
	}
`;

module.exports = querySchema;
