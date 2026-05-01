import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Platform } from '@san-martin/san-martin-libs';

export const initSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('San Martin Bakery API')
    .setDescription(`
    ## Overview
    San Martin Bakery is a comprehensive microservices-based platform for bakery management.
    
    ## Architecture
    - **Main API Gateway**: Handles all client requests and routing
    - **Microservices**: Email, SMS, Notification, and Catalog Parsing services
    - **Authentication**: JWT-based with role-based access control
    - **Database**: PostgreSQL with Sequelize ORM
    - **Caching**: Redis for session management and temporary data
    - **Message Queue**: RabbitMQ for inter-service communication
    
    ## Features
    - User authentication and authorization
    - Role-based access control (Customer, Store Manager, Country Manager, etc.)
    - Email and SMS notifications
    - Real-time updates via WebSockets
    - File upload and management (AWS S3)
    - Address management and delivery zones
    - Multi-platform support (Web, Mobile)
    
    ## Security
    - Rate limiting (100 requests per minute)
    - Security headers (Helmet.js)
    - Input validation and sanitization
    - CORS protection
    - JWT token authentication
    
    ## Usage
    1. Obtain a JWT token via authentication endpoints
    2. Include the token in the Authorization header: \`Bearer <token>\`
    3. Include the platform header: \`platform: <platform_type>\`
    4. Make requests to the appropriate endpoints
    `)
    .setVersion('2.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT authentication token',
      in: 'header',
    })
    .addApiKey({
      type: 'apiKey',
      name: 'platform',
      in: 'header',
      description: 'Platform identifier for the request',
    })
    .addServer('http://localhost:3000', 'Development Server')
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Users', 'User management and profile operations')
    .addTag('Stores', 'Store management operations')
    .addTag('Countries', 'Country and region management')
    .addTag('Delivery Zones', 'Delivery zone configuration')
    .addTag('Notifications', 'User notification management')
    .addTag('Guest', 'Guest user operations')
    .addTag('Health', 'Application health and monitoring')
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    deepScanRoutes: true,
    ignoreGlobalPrefix: false,
  });

  SwaggerModule.setup('api-doc', app, document, {
    swaggerOptions: {
      syntaxHighlight: true,
      docExpansion: 'list',
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'San Martin Bakery API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #2c5aa0; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
    `,
  });

  // Serve Swagger JSON for external tools
  app.use('/api-json', (req, res, next) => {
    if (req.path === '/api-json') {
      res.setHeader('Content-Type', 'application/json');
      res.send(document);
    } else {
      next();
    }
  });
};
