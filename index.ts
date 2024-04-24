import fastify from 'fastify'
import path from 'node:path'
import fastifyStatic from '@fastify/static'


const filename = process.cwd(); // get the resolved path to the file
const dirname = path.dirname(filename); // get the name of the directory
const server = fastify({logger:true})

console.log("__dirname", dirname)


server.register(fastifyStatic, {
    root: path.join(dirname, 'public/build'),
    prefix: '/', // optional: default '/'
    constraints: {} // optional: default {}
  })

// Declare a route  
server.get('/', function (_request, reply) {  
	reply.sendFile('index.html')
})  
  
// Run the server!  
server.listen({ port: 4000 }, function (err, address) {  
	if (err) {  
		server.log.error(err)  
		process.exit(1)  
	}
	
	console.log(`Server is now listening on ${address}`)  
})