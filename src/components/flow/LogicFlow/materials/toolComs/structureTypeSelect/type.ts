import type { FieldType } from '@/config/enum/flow-fields';

export interface IMenuItem  {
    name: string;
    key: string;
    pKey?: string;
    isRoot?: boolean;
    type: FieldType | 'set' | 'base' | 'apihub'
    children?: IMenuItem[]
  }