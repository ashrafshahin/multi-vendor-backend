const { version } = require('mongoose')
const swaggerJsdoc = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Multivendor eCommerce API',
            version: '1.0.0',
            description: ' API for large scale multivendor eCommerce (MERN Stack) ',
            contact: {
                name: 'Md Ashraf Shahin',
                email: 'ashraf.shahin.dev@gmail.com',
            }
        },
        servers: [
            //{  url: `http://ashrafshahin.com`  } real domain use...
            {
                url: `http://localhost:${process.env.PORT || 5000}`,
                description: 'Development server'
            },

        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js']
}

const specification = swaggerJsdoc(options)

module.exports = specification

