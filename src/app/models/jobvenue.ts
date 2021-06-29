import {Venue} from './venue';

export class JobVenue {
  public id: string;
  public clientJobId: number;
  public clientVenueId: number;

  public clientVenue: Venue;
}