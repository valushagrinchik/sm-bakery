import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AdmitPanelGuard,
  CreateCountriesGuard,
  ErrorResponseBody,
  RouteName,
  UpdateCountriesGuard,
  ViewCountriesGuard,
} from '@san-martin/san-martin-libs';

import { CountriesService } from './countries.service';
import { CountriesCreateDto } from './dto/request/countries.create.dto';
import { CountriesSearchDto } from './dto/request/countries.search.dto';
import { CountriesUpdateDto } from './dto/request/countries.update.dto';
import { CountryResponseDto } from './dto/response/country.response.dto';
import { FindManyCountriesResponseDto } from './dto/response/find-many-countries.response.dto';

@Controller(RouteName.ADMIN_COUNTRIES)
@ApiBearerAuth()
@UseGuards(AdmitPanelGuard)
@ApiTags('Countries')
export class CountriesAdminController {
  constructor(private readonly service: CountriesService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CountryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: ErrorResponseBody,
  })
  @UseGuards(CreateCountriesGuard)
  @Post()
  async create(@Body() dto: CountriesCreateDto): Promise<CountryResponseDto> {
    const country = await this.service.create(dto);
    return new CountryResponseDto(country);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: FindManyCountriesResponseDto,
  })
  @UseGuards(ViewCountriesGuard)
  @Get()
  @ApiExtraModels(CountriesSearchDto)
  async search(@Query() dto: CountriesSearchDto): Promise<FindManyCountriesResponseDto> {
    return await this.service.search(dto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(UpdateCountriesGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: CountriesUpdateDto): Promise<void> {
    await this.service.update(id, dto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: CountryResponseDto,
  })
  @UseGuards(ViewCountriesGuard)
  @Get(':id')
  async get(@Param('id') id: number): Promise<CountryResponseDto> {
    const country = await this.service.get(id);
    return new CountryResponseDto(country);
  }
}
