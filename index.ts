import restify from 'restify'
import { dropAnonymousHandler } from './src/handlers/drop-anonynmous.handler';
import { createCore } from './src/core/dependencies';

const server = restify.createServer();
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.fullResponse());

server.get("/public/*", restify.plugins.serveStatic({
  directory: './public',
}))

const core = createCore()
server.post("/api/drop", dropAnonymousHandler(core))

server.listen(8080, function() {
  console.info('%s listening at %s', server.name, server.url);
});