import { HttpStatus } from '@nestjs/common';
import {
  ErrorMessageEnum,
  getDayOfWeek,
  OperationError,
  TimeWorkCreateDto,
} from '@san-martin/san-martin-libs';
import ct from 'countries-and-timezones';
import * as dayjs from 'dayjs';
import * as timezonePlugin from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

//TODO:Will continue in the future
export const checkTimeWork = (countryCode: string, timeWork: TimeWorkCreateDto) => {
  const timeZone: ct.Country = ct.getCountry(countryCode) as ct.Country;
  const dateNow = dayjs();

  const today = dateNow.tz(timeZone.timezones[0]);

  const currentDayOfWeek = getDayOfWeek(today);

  if (!timeWork[currentDayOfWeek.day]) {
    throw new OperationError(ErrorMessageEnum.DELIVERY_ZONE_NOT_WORK, HttpStatus.BAD_REQUEST);
  }

  const openTime = today.set('h', timeWork[currentDayOfWeek.open]);
  const closeTime = today.set('h', timeWork[currentDayOfWeek.open]);
};
