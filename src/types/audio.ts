export type LabelCategory = 'evil' | 'rich' | 'poor';

export interface AudioFile {
  id: string;
  name: string;
  path: string;
  duration: number;
}