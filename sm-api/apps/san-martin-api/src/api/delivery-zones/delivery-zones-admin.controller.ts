import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AdmitPanelGuard,
  CreateDeliveryZoneGuard,
  DeleteDeliveryZoneGuard,
  FindOneParamsDto,
  RouteName,
  SuccessDto,
  TransactionInspectors,
  TransactionParam,
  UpdateDeliveryZoneGuard,
  ViewDeliveryZoneGuard,
} from '@san-martin/san-martin-libs';
import { Transaction } from 'sequelize';

import { DeliveryZonesService } from './delivery-zones.service';
import { AllPolygonsQueryDto } from './dto/request/all-polygons.query.dto';
import { DeliverySubZoneTimeWorkUpdateDto } from './dto/request/delivery-sub-zone-time-work.update.dto';
import { DeliverySubZoneCreateDto } from './dto/request/delivery-sub-zone.create.dto';
import { DeliverySubZoneUpdateDto } from './dto/request/delivery-sub-zone.update.dto';
import { DeliveryZoneAndSubZoneParamsDto } from './dto/request/delivery-zone-and-sub-zone.params.dto';
import { DeliveryZoneChangeMainStoreDto } from './dto/request/delivery-zone-change-main-store.dto';
import { DeliveryZoneTimeWorkUpdateDto } from './dto/request/delivery-zone-time-work.update.dto';
import { DeliveryZoneCreateDto } from './dto/request/delivery-zone.create.dto';
import { DeliveryZoneFindManyDto } from './dto/request/delivery-zone.find-many.dto';
import { DeliveryZoneUpdateDto } from './dto/request/delivery-zone.update.dto';
import { DeliveryZoneFindManyResponseDto } from './dto/response/delivery-zone-find-many.response.dto';
import { DeliveryZoneResponseDto } from './dto/response/delivery-zone.response.dto';

@Controller(RouteName.ADMIN_DELIVERY_ZONES)
@ApiTags(RouteName.DELIVERY_ZONES)
@UseGuards(AdmitPanelGuard)
@ApiBearerAuth()
@UseGuards(AdmitPanelGuard)
export class DeliveryZonesAdminController {
  constructor(private readonly deliveryZoneService: DeliveryZonesService) {}

  @ApiResponse({ status: HttpStatus.CREATED, type: DeliveryZoneResponseDto })
  @Post()
  @UseGuards(CreateDeliveryZoneGuard)
  @UseInterceptors(TransactionInspectors)
  async create(
    @TransactionParam() transaction: Transaction,
    @Body() body: DeliveryZoneCreateDto,
  ): Promise<DeliveryZoneResponseDto> {
    const deliveryZone = await this.deliveryZoneService.create(transaction, body);
    return new DeliveryZoneResponseDto(deliveryZone);
  }

  @ApiResponse({ status: HttpStatus.CREATED, type: SuccessDto })
  @ApiBody({ type: [DeliverySubZoneUpdateDto] })
  @Post(':id/sub-zone')
  @UseGuards(UpdateDeliveryZoneGuard)
  @UseInterceptors(TransactionInspectors)
  async deliverySubZone(
    @TransactionParam() transaction: Transaction,
    @Param() { id }: FindOneParamsDto,
    @Body(new ParseArrayPipe({ items: DeliverySubZoneCreateDto })) body: DeliverySubZoneUpdateDto[],
  ) {
    await this.deliveryZoneService.deliverySubZone(transaction, id, body);
    return new SuccessDto({ message: 'ok' });
  }

  @ApiResponse({ status: HttpStatus.CREATED, type: SuccessDto })
  @Put(':id/sub-zone/:subZoneId/time-work')
  @UseGuards(UpdateDeliveryZoneGuard)
  @UseInterceptors(TransactionInspectors)
  async updateDeliverySubZoneTimeWork(
    @TransactionParam() transaction: Transaction,
    @Param() { id, subZoneId }: DeliveryZoneAndSubZoneParamsDto,
    @Body() body: DeliverySubZoneTimeWorkUpdateDto,
  ) {
    await this.deliveryZoneService.updateDeliverySubZoneTimeWork(transaction, id, subZoneId, body);
    return new SuccessDto({ message: 'ok' });
  }

  @ApiResponse({ status: HttpStatus.OK, type: DeliveryZoneFindManyResponseDto })
  @Get()
  @UseGuards(ViewDeliveryZoneGuard)
  @ApiExtraModels(DeliveryZoneFindManyDto)
  async getDeliveryZoneList(
    @Query() query: DeliveryZoneFindManyDto,
  ): Promise<DeliveryZoneFindManyResponseDto> {
    return this.deliveryZoneService.deliveryZoneList(query);
  }

  @ApiResponse({ status: HttpStatus.OK, type: [DeliveryZoneResponseDto] })
  @Get('polygons')
  @UseGuards(ViewDeliveryZoneGuard)
  async getAllPolygons(@Query() query: AllPolygonsQueryDto): Promise<DeliveryZoneResponseDto[]> {
    const allPolygons = await this.deliveryZoneService.getAllPolygons(query);

    return allPolygons.map((polygon) => new DeliveryZoneResponseDto(polygon));
  }

  @ApiResponse({ status: HttpStatus.OK, type: DeliveryZoneResponseDto })
  @Get(':id')
  @UseGuards(ViewDeliveryZoneGuard)
  async getById(@Param() { id }: FindOneParamsDto): Promise<DeliveryZoneResponseDto> {
    const deliveryZone = await this.deliveryZoneService.getById(id);
    return new DeliveryZoneResponseDto(deliveryZone);
  }

  @ApiResponse({ status: HttpStatus.OK, type: SuccessDto })
  @Put(':id')
  @UseGuards(UpdateDeliveryZoneGuard)
  @UseInterceptors(TransactionInspectors)
  async update(
    @TransactionParam() transaction: Transaction,
    @Param() { id }: FindOneParamsDto,
    @Body() body: DeliveryZoneUpdateDto,
  ) {
    await this.deliveryZoneService.update(transaction, id, body);
    return new SuccessDto({ message: 'ok' });
  }

  @ApiResponse({ status: HttpStatus.OK, type: SuccessDto })
  @Put(':id/time-work')
  @UseGuards(UpdateDeliveryZoneGuard)
  @UseInterceptors(TransactionInspectors)
  async updateDeliveryZoneTimeWork(
    @TransactionParam() transaction: Transaction,
    @Param() { id }: FindOneParamsDto,
    @Body() body: DeliveryZoneTimeWorkUpdateDto,
  ) {
    await this.deliveryZoneService.updateDeliveryZoneTimeWork(transaction, id, body);
    return new SuccessDto({ message: 'ok' });
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Delete(':id')
  @UseGuards(DeleteDeliveryZoneGuard)
  @UseInterceptors(TransactionInspectors)
  async delete(@TransactionParam() transaction: Transaction, @Param() { id }: FindOneParamsDto) {
    await this.deliveryZoneService.delete(transaction, id);
  }

  @ApiResponse({ status: HttpStatus.OK, type: SuccessDto })
  @Put(':id/change-main-store')
  @UseGuards(UpdateDeliveryZoneGuard)
  @UseInterceptors(TransactionInspectors)
  async changeMainStore(
    @TransactionParam() transaction: Transaction,
    @Param() { id }: FindOneParamsDto,
    @Body() body: DeliveryZoneChangeMainStoreDto,
  ) {
    await this.deliveryZoneService.changeMainStore(transaction, id, body);
    return new SuccessDto({ message: 'ok' });
  }
}
