process.env.NODE_ENV==='production' && require("fix-esm").register();

import restify from 'restify'
import { createDropAnonymousHandler, DropAnonymousValidator } from './src/handlers/drop-anonynmous.handler';
import { createCore } from './src/core/dependencies';
import { GrabMessageValidator, createGrabMessageHandler } from './src/handlers/grab-message.handler';

const server = restify.createServer();
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.fullResponse());

server.get("/*", restify.plugins.serveStatic({
  directory: './public',
  default: 'index.html'
}))

const core = createCore()
server.post("/api/drop", DropAnonymousValidator.body, createDropAnonymousHandler(core))
server.put("/api/grab/:receiptId", GrabMessageValidator.params, createGrabMessageHandler(core))


server.listen(8080, function() {
  console.info('%s listening at %s', server.name, server.url);
});