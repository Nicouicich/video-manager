import { Test, TestingModule } from '@nestjs/testing';
import { VideoManagerService } from './video-manager.service';

describe('VideoManagerService', () => {
  let service: VideoManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoManagerService],
    }).compile();

    service = module.get<VideoManagerService>(VideoManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
