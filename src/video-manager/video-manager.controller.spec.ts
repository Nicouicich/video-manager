import { Test, TestingModule } from '@nestjs/testing';
import { VideoManagerController } from './video-manager.controller';

describe('VideoManagerController', () => {
  let controller: VideoManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoManagerController],
    }).compile();

    controller = module.get<VideoManagerController>(VideoManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
