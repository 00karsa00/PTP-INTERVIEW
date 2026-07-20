import { RecommendationService } from './recommendation.service';
import { RecommendRequestDto } from './dto/recommend-request.dto';
import { RecommendResponseDto } from './dto/recommend-response.dto';
export declare class RecommendationController {
    private readonly recommendationService;
    constructor(recommendationService: RecommendationService);
    recommend(dto: RecommendRequestDto): Promise<RecommendResponseDto>;
}
