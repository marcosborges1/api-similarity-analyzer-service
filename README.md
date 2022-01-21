# MicroGraphQL - Api Similarity Analyzer Service

API Similarity Analyzer Service (ASAS) is a microservice that will analyze the similarities of requests and responses contained in OpenAPI description files.

<img src="https://github.com/marcosborges1/api-similarity-analyzer-service/blob/main/images/api_similarity.png" height="300"/>

## Note - Project Status

As it is a proof of concept, it is in a phase of improvement and evolution.

## Author

Marcos Borges

## Installation

Use the package manager [npm](https://www.npmjs.com) to install micrographlgateway.

```bash
npm install
```

## Usage

Before you start registering the microservices below, be sure to start them.

```javascript
//Ommited Details
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
//Ommited Details
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
