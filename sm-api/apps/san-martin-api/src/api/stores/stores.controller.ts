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
  CreateStoresGuard,
  DeleteStoresGuard,
  ErrorResponseBody,
  FindOneParamsDto,
  RouteName,
  StoresEntity,
  SuccessDto,
  TransactionInspectors,
  TransactionParam,
  UpdateStoresGuard,
  ViewStoresGuard,
} from '@san-martin/san-martin-libs';
import { Transaction } from 'sequelize';

import { ConfigureAddressAndDeliveryZoneDto } from './dto/request/configure-address-and-delivery-zone.dto';
import { StoreOrderPerHoursDto } from './dto/request/store-order-per-hours.dto';
import { StoresTimeWorkCreateDto } from './dto/request/stores-time-work.create.dto';
import { StoresCreateDto } from './dto/request/stores.create.dto';
import { StoresFindManyDto } from './dto/request/stores.find-many.dto';
import { StoresUpdateDto } from './dto/request/stores.update.dto';
import { StoresFindManyResponseDto } from './dto/response/stores-find-many.responce.dto';
import { StoresResponseDto } from './dto/response/stores.response.dto';
import { StoresService } from './stores.service';

@Controller(RouteName.ADMIN_STORES)
@ApiBearerAuth()
@UseGuards(AdmitPanelGuard)
@ApiTags('Stores')
export class StoresController {
  constructor(private storeService: StoresService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    type: StoresResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseBody,
  })
  @UseGuards(CreateStoresGuard)
  @Post()
  @UseInterceptors(TransactionInspectors)
  async create(
    @TransactionParam() transaction: Transaction,
    @Body() body: StoresCreateDto,
  ): Promise<StoresResponseDto> {
    const stores = await this.storeService.create(transaction, body);
    return new StoresResponseDto(stores);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: StoresFindManyResponseDto,
  })
  @UseGuards(ViewStoresGuard)
  @Get()
  @ApiExtraModels(StoresFindManyDto)
  getStoresList(@Query() query: StoresFindManyDto): Promise<StoresFindManyResponseDto> {
    return this.storeService.getStoresList(query);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: [StoresResponseDto],
  })
  @UseGuards(ViewStoresGuard)
  @Get('no-delivery-zone-pins')
  async getStoreForAssigneeDeliveryZone(): Promise<StoresResponseDto[]> {
    const stores = await this.storeService.getStoreForAssigneeDeliveryZone();

    return stores.map((store) => new StoresResponseDto(store));
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseBody,
  })
  @UseGuards(UpdateStoresGuard)
  @Put(':id')
  @UseInterceptors(TransactionInspectors)
  async updateStore(
    @TransactionParam() transaction: Transaction,
    @Param() { id }: FindOneParamsDto,
    @Body() body: StoresUpdateDto,
  ) {
    await this.storeService.update(transaction, id, body);
    return new SuccessDto({ message: 'ok' });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseBody,
  })
  @UseGuards(UpdateStoresGuard)
  @Put(':id/stores-time-work')
  @UseInterceptors(TransactionInspectors)
  async updateStoreTimeWork(
    @TransactionParam() transaction: Transaction,
    @Param() { id }: FindOneParamsDto,
    @Body() body: StoresTimeWorkCreateDto,
  ) {
    await this.storeService.updateStoreTimeWork(transaction, id, body);
    return new SuccessDto({ message: 'ok' });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseBody,
  })
  @UseGuards(UpdateStoresGuard)
  @Put(':id/store-order-per-hours')
  @UseInterceptors(TransactionInspectors)
  @ApiBody({ type: [StoreOrderPerHoursDto] })
  async updateStoreOrderPerHours(
    @TransactionParam() transaction: Transaction,
    @Param() { id }: FindOneParamsDto,
    @Body(new ParseArrayPipe({ items: StoreOrderPerHoursDto })) body: StoreOrderPerHoursDto[],
  ) {
    await this.storeService.updateStoreOrderPerHours(transaction, id, body);
    return new SuccessDto({ message: 'ok' });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: StoresResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseBody,
  })
  @UseGuards(ViewStoresGuard)
  @Get(':id')
  async getStoreById(@Param() { id }: FindOneParamsDto): Promise<StoresResponseDto> {
    const store = await this.storeService.getById(id);
    return new StoresResponseDto(store);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: StoresEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseBody,
  })
  @UseGuards(DeleteStoresGuard)
  @Delete(':id')
  @UseInterceptors(TransactionInspectors)
  async delete(
    @TransactionParam() transaction: Transaction,
    @Param() { id }: FindOneParamsDto,
  ): Promise<void> {
    await this.storeService.delete(transaction, id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseBody,
  })
  @UseGuards(UpdateStoresGuard)
  @Put(':id/configure-address-and-delivery-zone')
  @UseInterceptors(TransactionInspectors)
  async configureAddressAndDeliveryZoneByStore(
    @TransactionParam() transaction: Transaction,
    @Param() { id }: FindOneParamsDto,
    @Body() body: ConfigureAddressAndDeliveryZoneDto,
  ) {
    await this.storeService.configureAddressAndDeliveryZoneByStore(transaction, id, body);
    return new SuccessDto({ message: 'ok' });
  }
}
