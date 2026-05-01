import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RouteName } from '@san-martin/san-martin-libs';

import { ResetChangeQueryDto } from './dto/request/reset-change.query.dto';
import { UserImageResponseDto } from './dto/user-image.response.dto';
import { UsersService } from './users.service';

@ApiTags(RouteName.USERS)
@Controller(RouteName.USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('reset-change')
  async resetChange(@Query() query: ResetChangeQueryDto) {
    return this.usersService.resetChange(query);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          required: ['true'],
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserImageResponseDto })
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File): Promise<UserImageResponseDto> {
    return this.usersService.uploadImage(file);
  }
}
