import { z as zod } from 'zod';

export const WeatherDataSchema = zod.object({
  location: zod.string(),
  date: zod.coerce.date(),
  temperature: zod.coerce.number(),
  humidity: zod.coerce.number(),
});

export type WeatherData = zod.infer<typeof WeatherDataSchema>;

export const WeatherFilterSchema = zod.object({
  from: zod.coerce.date().optional(),
  to: zod.coerce.date().optional(),
});

export type WeatherFilter = zod.infer<typeof WeatherFilterSchema>;
