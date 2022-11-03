import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IPeelUpcomingEventsProps {
  isDarkTheme: boolean;
  hasTeamsContext: boolean;
  userDisplayName: string;

  wpTitle: string;
  context: WebPartContext;
  siteUrl: string;
  eventsList: string;
  dateRange: string;
  numEvents: number;
  showPaging: boolean;
  pageSize: number;
  targetAudience: any;
}
