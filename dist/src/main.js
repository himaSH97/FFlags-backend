"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter());
    const corsOptions = {
        origin: ['https://fflagsbackend-x94aak4f.b4a.run', 'http://localhost:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['Content-Type', 'Authorization', 'X-FFLAGS-Project-Key'],
        exposedHeaders: ['set-cookie'],
    };
    app.enableCors(corsOptions);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('FFlags')
        .setDescription('FFlags API')
        .setVersion('1.0')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, documentFactory);
    await app.listen(4000);
}
bootstrap();
//# sourceMappingURL=main.js.map