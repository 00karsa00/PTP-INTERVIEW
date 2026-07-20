"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug'],
        cors: {
            origin: (origin, callback) => {
                const allowed = [
                    process.env.FRONTEND_URL || 'http://localhost:5174',
                    'http://localhost:5173',
                    'http://localhost:3000',
                ];
                if (!origin)
                    return callback(null, true);
                if (allowed.includes(origin) ||
                    /\.myshopify\.com$/.test(origin) ||
                    /\.shopify\.com$/.test(origin)) {
                    return callback(null, true);
                }
                callback(new Error(`CORS: origin ${origin} not allowed`));
            },
            credentials: true,
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        stopAtFirstError: false,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.setGlobalPrefix('api/v1');
    const port = process.env.PORT || 3001;
    await app.listen(port);
    logger.log(`🌿 Kerala Ayurveda PDP backend running on port ${port}`);
    logger.log(`   POST /api/v1/recommendation`);
    logger.log(`   GET  /api/v1/health`);
    logger.log(`   GET  /api/v1/products/ashwagandha`);
    logger.log(`   GET  /api/v1/wishlist?sessionId=xxx`);
    logger.log(`   POST /api/v1/wishlist`);
    logger.log(`   DELETE /api/v1/wishlist`);
    process.on('SIGTERM', async () => { await app.close(); process.exit(0); });
    process.on('SIGINT', async () => { await app.close(); process.exit(0); });
}
bootstrap();
//# sourceMappingURL=main.js.map