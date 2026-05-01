import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RouteName } from '@san-martin/san-martin-libs';
import { Request } from 'express';

import { GuestService } from './guest.service';

@Controller(RouteName.GUEST)
@ApiTags('Guest')
export class GuestController {
  constructor(private guestService: GuestService) {}

  @Get('token')
  async createGuestToken(@Req() req: Request) {
    const {
      headers: { platform },
    } = req;
    return this.guestService.createGuestToken(platform);
  }
}
