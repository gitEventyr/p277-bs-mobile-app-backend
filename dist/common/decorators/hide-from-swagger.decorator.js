"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HideFromSwagger = HideFromSwagger;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function HideFromSwagger() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExcludeEndpoint)());
}
//# sourceMappingURL=hide-from-swagger.decorator.js.map