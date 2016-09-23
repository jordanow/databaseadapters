# Database Adapters
### Advanced Data models project
Transform and save JSON data to Mongo, HBase and Neo4J.

## Prerequisites
- [MongoDB Community Edition v3.2](https://docs.mongodb.com/manual/installation/)
- [Robomongo](https://robomongo.org/)
- [NodeJS](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/downloads)

## How to setup
- Install all the above
- Clone this project `git clone https://github.com/jordanow/databaseadapters.git`

## How to run - Mongodb
- Start a mongod server.
- Open robomongo and make a connection to address : "localhost", port : 27071. Test connection to see if its available.
- Open the project folder. Run npm install. (May require administrator privileges to run). 
- `npm start` or `npm start mongo` - This will copy all data, transform it and save it in mongoDB.
- Go to robomongo, refresh databases.
- If the above processes were successful, you should see 'adm' database with all the collections.
- Run the queries on different collections.

## How to run - Neo4j
- Start neo4J Community Edition server
- To run the project, `npm start neo` or `npm start neo4j` - This will copy all data, transform it and save it in neo4J.
- Go to `http://localhost:7474`.
- If the above processes are successful, you should see labels - Tags, Users, Artists in the database.
