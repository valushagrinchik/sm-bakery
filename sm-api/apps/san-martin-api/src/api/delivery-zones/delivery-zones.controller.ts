import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RouteName } from '@san-martin/san-martin-libs';

import { DeliveryZonesService } from './delivery-zones.service';
import { ValidateDeliveryZoneDto } from './dto/request/validate-delivery-zone.dto';

@Controller(RouteName.DELIVERY_ZONES)
@ApiTags('Delivery Zones')
@ApiBearerAuth()
@Controller('delivery-zones')
export class DeliveryZonesController {
  constructor(private readonly deliveryZoneService: DeliveryZonesService) {}

  @Get('fast-validate-address')
  fastValidateAddress(@Query() query: ValidateDeliveryZoneDto) {
    return this.deliveryZoneService.fastValidateAddress(query);
  }

  @Get('validate-address')
  validateDeliveryAddress(@Query() query: ValidateDeliveryZoneDto) {
    return this.deliveryZoneService.validateDeliveryAddress(query);
  }
}
