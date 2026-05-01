import { HttpStatus } from '@nestjs/common';
import {
  ErrorMessageEnum,
  getDayOfWeek,
  OperationError,
  StoreOrderPerHoursEntity,
  TimeWorkCreateDto,
} from '@san-martin/san-martin-libs';
import ct from 'countries-and-timezones';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
import * as timezonePlugin from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezonePlugin);
dayjs.extend(isBetween);

export { dayjs };

// date is in UTC format
export const validateDate = (
  countryCode: string,
  timeWork: TimeWorkCreateDto,
  date: dayjs.Dayjs,
) => {
  const timeZone: ct.Country = ct.getCountry(countryCode) as ct.Country;
  if (!timeZone) {
    throw new OperationError(ErrorMessageEnum.COUNTRY_CODE_ISSUE, HttpStatus.BAD_REQUEST);
  }
  const tzDate = date.tz(timeZone.timezones[0]);
  const { day, open, close } = getDayOfWeek(tzDate);
  if (!timeWork[day]) {
    return false;
  }

  const { isBetween } = isTimeBetween(tzDate, timeWork[open], timeWork[close]);
  return isBetween;
};

// date is in UTC format
export const validateMaxOrderAmount = (
  countryCode: string,
  storeOrderPerHours: Pick<StoreOrderPerHoursEntity, 'weekName' | 'listOrderPerHours'>[],
  date: dayjs.Dayjs,
) => {
  const timeZone: ct.Country = ct.getCountry(countryCode) as ct.Country;
  if (!timeZone) {
    throw new OperationError(ErrorMessageEnum.COUNTRY_CODE_ISSUE, HttpStatus.BAD_REQUEST);
  }
  const tzDate = date.tz(timeZone.timezones[0]);
  const { day } = getDayOfWeek(tzDate);
  const storeOrderPerHoursPerDay = storeOrderPerHours.find(
    (s) => s.weekName == day,
  )?.listOrderPerHours;

  if (!storeOrderPerHoursPerDay) {
    return null;
  }

  const config = storeOrderPerHoursPerDay.find((o) => {
    // '06:00-06:30'
    if (!o.timePeriod.match(/\d{2}\:\d{2}\-\d{2}\:\d{2}/)) {
      return false;
    }
    const [start, end] = o.timePeriod.split('-');
    const { isBetween } = isTimeBetween(tzDate, start, end);
    return isBetween;
  });

  return config;
};

export const isTimeBetween = (date: dayjs.Dayjs, startTime?: string, endTime?: string) => {
  const [startHours, startMinutes] = startTime.split(':');
  const [endHours, endMinutes] = endTime.split(':');

  const startDate = date.set('h', +startHours).set('m', +startMinutes);
  const endDate = date.set('h', +endHours).set('m', +endMinutes);
  const isBetween = date.isBetween(startDate, endDate, 'minute', '[)');

  return {
    date,
    startDate,
    endDate,
    isBetween,
  };
};
