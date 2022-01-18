const {
    ApolloServer,
} = require("apollo-server");
const {
    ApolloServerPluginLandingPageGraphQLPlayground
} = require("apollo-server-core");

const typeDefs = require("./graphql/schemas");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
    cors: true,
    typeDefs,
    resolvers,
    // dataSources: () => {
    //   return {
    //     cfqAPI: new CFQAPI(),
    //     nfMirrorPAI: new NFMirrorAPI()
    //   }
    // },
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
});

server.listen().then(({
    url
}) => {
    console.log(`Server ready at ${url}`);
});