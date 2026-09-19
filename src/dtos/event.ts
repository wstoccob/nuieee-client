export interface EventPhoto {
  id: string;
  photoUrl: string;
  altText: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  registrationLink: string | null;
  hasRegistrationLink: boolean;
  photos: EventPhoto[];
}

export interface EventPhotoInput {
  photoUrl: string;
  altText: string;
}

export interface EventInput {
  title: string;
  description: string;
  startsAt: string;
  registrationLink?: string | null;
  photos: EventPhotoInput[];
}
