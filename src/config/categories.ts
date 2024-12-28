import { LabelCategory } from '../types/audio';

export const categories: {
  value: LabelCategory;
  label: string;
  color: string;
}[] = [
  { value: 'evil', label: 'Evil', color: 'bg-red-500 hover:bg-red-600' },
  { value: 'rich', label: 'Rich', color: 'bg-green-500 hover:bg-green-600' },
  { value: 'poor', label: 'Poor', color: 'bg-yellow-500 hover:bg-yellow-600' },
];