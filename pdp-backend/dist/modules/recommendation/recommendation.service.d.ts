import { ConfigService } from '@nestjs/config';
import { RecommendRequestDto, Goal, Frequency } from './dto/recommend-request.dto';
import { RecommendResponseDto } from './dto/recommend-response.dto';
export declare class RecommendationService {
    private readonly config;
    private readonly logger;
    private openai;
    constructor(config: ConfigService);
    buildRecommendation(goal: Goal, frequency: Frequency): Omit<RecommendResponseDto, 'blurb' | 'blurbSource'>;
    getRecommendation(dto: RecommendRequestDto): Promise<RecommendResponseDto>;
    private generateBlurb;
}
