import dayjs from 'dayjs';

export const getDayOfWeek = (date: dayjs.Dayjs): { open: string; close: string; day: string } => {
  const days = {
    0: { open: 'sundayOpen', close: 'sundayClose', day: 'sunday' },
    1: { open: 'mondayOpen', close: 'mondayClose', day: 'monday' },
    2: { open: 'tuesdayOpen', close: 'tuesdayClose', day: 'tuesday' },
    3: { open: 'wednesdayOpen', close: 'wednesdayClose', day: 'wednesday' },
    4: { open: 'thursdayOpen', close: 'thursdayClose', day: 'thursday' },
    5: { open: 'fridayOpen', close: 'fridayClose', day: 'friday' },
    6: { open: 'saturdayOpen', close: 'saturdayClose', day: 'saturday' },
  };

  return days[date.day()];
};
