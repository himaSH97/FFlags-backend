"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const express_1 = require("@clerk/express");
const platform_express_1 = require("@nestjs/platform-express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter());
    const corsOptions = {
        origin: 'http://localhost:3000',
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['Content-Type', 'Authorization', 'X-FFLAGS-Project-Key'],
    };
    app.enableCors(corsOptions);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    app.use((0, express_1.clerkMiddleware)());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('FFlags')
        .setDescription('FFlags API')
        .setVersion('1.0')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, documentFactory);
    await app.listen({ port: 4000 });
}
bootstrap();
//# sourceMappingURL=main.js.map