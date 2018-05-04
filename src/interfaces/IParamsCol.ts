import { IParamsColDisplay, IParamsColEditor, IParamsColFilter } from './';

export interface IParamsCol {
  /**
   * field name
   */
  field: string;

  /**
   * Column header
   */
  header: string;

  /**
   * css style
   */
  style?: Object;

  /**
   * Whether it is sortable
   */
  sortable?: boolean;

  /**
   * Column filter
   */
  filter?: IParamsColFilter;

  /**
   * Display
   */
  display?: IParamsColDisplay;

  /**
   * Editor
   */
  editor?: IParamsColEditor;
}
