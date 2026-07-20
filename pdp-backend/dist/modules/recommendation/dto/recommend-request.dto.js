"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendRequestDto = exports.Frequency = exports.Goal = void 0;
const class_validator_1 = require("class-validator");
var Goal;
(function (Goal) {
    Goal["STRESS_CALM"] = "stress_calm";
    Goal["ENERGY_FOCUS"] = "energy_focus";
    Goal["SLEEP_QUALITY"] = "sleep_quality";
})(Goal || (exports.Goal = Goal = {}));
var Frequency;
(function (Frequency) {
    Frequency["ONCE_DAILY"] = "once_daily";
    Frequency["TWICE_DAILY"] = "twice_daily";
})(Frequency || (exports.Frequency = Frequency = {}));
class RecommendRequestDto {
}
exports.RecommendRequestDto = RecommendRequestDto;
__decorate([
    (0, class_validator_1.IsEnum)(Goal, {
        message: `goal must be one of: ${Object.values(Goal).join(', ')}`,
    }),
    __metadata("design:type", String)
], RecommendRequestDto.prototype, "goal", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(Frequency, {
        message: `frequency must be one of: ${Object.values(Frequency).join(', ')}`,
    }),
    __metadata("design:type", String)
], RecommendRequestDto.prototype, "frequency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'context must be 200 characters or fewer' }),
    __metadata("design:type", String)
], RecommendRequestDto.prototype, "context", void 0);
//# sourceMappingURL=recommend-request.dto.js.map