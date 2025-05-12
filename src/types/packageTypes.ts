
export type City = {
  CityID: number;
  CityName: string;
};

export type Transportation = {
  TransportationID: number;
  TransportationName: string;
  Price: string;
  DepartureTime: string;
  ArrivalTime: string;
  AvailableSeats: number;
};

export type Accommodation = {
  AccommodationID: number;
  AccommodationName: string;
  PricePerNight: string;
};

export type Experience = {
  // Experience details will be added as needed
};

export type PackageTran = {
  PackageTranID: number;
  PackageID: number;
  AccommodationID: number | null;
  TransportationID: number | null;
  IsAccommodation: boolean;
  IsTransportation: boolean;
  Sequence: string;
  Status: string;
  Created: string;
  Modified: string;
  ModifiedBy: number;
  FromCityID: number;
  ToCityID: number;
  IsTourGuideRequired: boolean;
  Transportation: Transportation | null;
  Accommodation: Accommodation | null;
  FromCity: City;
  ToCity: City;
  Experiences: Experience[];
};

export type Package = {
  PackageID: number;
  PackageName: string;
  SourceCityID: number;
  DestinationCityID: number;
  Price: string;
  RegistrationCap: number;
  Registered: number;
  Status: string;
  Created: string;
  Modified: string;
  ModifiedBy: number;
  IsTourGuide: boolean;
  PhotoURL: string;
  SourceCity: City;
  DestinationCity: City;
  PackageTrans: PackageTran[];
  Duration: number;
};
