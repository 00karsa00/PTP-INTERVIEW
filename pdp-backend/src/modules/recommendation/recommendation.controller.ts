import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendRequestDto } from './dto/recommend-request.dto';
import { RecommendResponseDto } from './dto/recommend-response.dto';

/**
 * POST /api/v1/recommendation
 *
 * Request:
 *   { goal: "stress_calm"|"energy_focus"|"sleep_quality",
 *     frequency: "once_daily"|"twice_daily",
 *     context?: string (optional, max 200 chars) }
 *
 * Response (wrapped by ResponseInterceptor):
 *   { success: true, data: RecommendResponseDto, timestamp: "..." }
 */
@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async recommend(
    @Body() dto: RecommendRequestDto,
  ): Promise<RecommendResponseDto> {
    return this.recommendationService.getRecommendation(dto);
  }
}
