import { Song } from 'Types';

// Ensures index is valid for the current # of songs
export const validIndex = (index: number, arrayLength: number) => {
  if (!index || !arrayLength || arrayLength === 1) {
    return 0;
  }
  const remainder = Math.abs(index % arrayLength);
  return index >= 0 ? remainder : arrayLength - remainder;
};

// Returns songs from the array that match the query
// Optionally pass in songs to exclude from the search
export const filterSongs = (
  songs: Song[],
  query: string,
  excludedSongs: Song[] | null,
) => {
  if (!songs) {
    return [] as Song[];
  }

  // Grab ID's from excluded songs
  const excludedSongIDs = excludedSongs ? excludedSongs.map((s) => s.id) : [];

  // Remove songs that are excluded or don't match query
  const filteredSongs = songs.filter((song) => {
    const matchesQuery = query === '' || song.name.toLowerCase().includes(query.toLowerCase());
    const excluded = excludedSongs && excludedSongIDs.includes(song.id);
    return matchesQuery && !excluded;
  });

  return filteredSongs;
};
