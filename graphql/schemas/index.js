const { gql } = require("apollo-server");

const querySchema = require("./query");

const typeDefs = gql`
	${querySchema}
`;
module.exports = typeDefs;
