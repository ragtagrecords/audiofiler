export interface Song {
  id?: number;
  name: string;
  file?: File;
  fileName?: string;
  zipFile?: File;
  zipFileName?: string;
  path?: string;
  tempo?: number;
  artist?: string;
  zipPath?: string;
  isParent?: boolean;
  parentID?: number | null;
  playlistIDs?: Array<string> | null;
  position?: number;
  notes?: string | null;
  error?: string;
}

export type Playlist = {
  id: number;
  name: string;
  songs?: Song[];
};

export interface SongPlaylist {
  id?: number;
  songID: number;
  playlistID: number;
  position?: number;
}

export type MenuOption = {
  href: string;
  text: string;
  state?: any;
  onClick?: any;
}

export type Task = {
  id?: number;
  name: string;
  stage: number;
  songID: number;
  position: number;
  description?: string;
  parentID?: number;
  createTimestamp: string;
};

export type Column = {
  title: string;
  tasks: Task[];
}

export type User = {
  id: number;
  username: string;
}

export type FetchableObject<T extends {}> = T & {
  isLoading: boolean;
  error: string | null;
}

// Used for accordion body
export type BodyType = 'info' | 'versions' | 'upload' | 'download' | 'collapsed';
