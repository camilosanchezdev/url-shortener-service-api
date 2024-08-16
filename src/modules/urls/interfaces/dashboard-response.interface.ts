import { Url } from '@prisma/client';

export interface DashboardResponseInterface {
  count: number;
  clicks: number;
  urls: Url[];
}
