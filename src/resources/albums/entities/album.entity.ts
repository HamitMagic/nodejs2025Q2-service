export class Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}
