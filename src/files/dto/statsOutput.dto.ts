import { ApiProperty } from '@nestjs/swagger';

export class TopFileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  viewCount: number;
}

export class StatsResponseDto {
  @ApiProperty()
  totalUploads: number;

  @ApiProperty({
    example: {
      conflict_resolution: 40,
      communication: 25,
      leadership: 15,
    },
  })
  categoryBreakdown: Record<string, number>;

  @ApiProperty({ type: [TopFileDto] })
  topFiles: TopFileDto[];
}
