const { ApolloServer } = require("apollo-server");
const {
	ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const { buildSubgraphSchema } = require("@apollo/subgraph");

const typeDefs = require("./graphql/schemas");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
	cors: true,
	typeDefs,
	resolvers,
	schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
	plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen(4001).then(({ url }) => {
	console.log(`Server ready at ${url}`);
});
