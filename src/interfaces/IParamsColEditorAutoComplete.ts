import { RestAdminComponent } from '../component';
import { IParamsCol } from './';

export interface IParamsColEditorAutoComplete {
  search: (
    str: string,
    self?: RestAdminComponent,
    selected?: any,
    col?: IParamsCol
  ) => any;
  results: any[];
  prepare?: (
    self?: RestAdminComponent,
    selected?: any,
    col?: IParamsCol
  ) => any;
  forceSelection?: boolean;
  multiple?: boolean;
  placeholder?: string;
  dataKey?: string;
  field?: string;
}
