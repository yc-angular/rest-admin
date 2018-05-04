import { RestAdminComponent } from '../component';
import { IParamsCol, IParamsColEditorAutoComplete } from './';

export interface IParamsColEditor {
  /**
   * Type of editor.
   */
  type:
    | 'autoComplete'
    | 'checkBox'
    | 'chip'
    | 'custom'
    | 'datetime'
    | 'enum'
    | 'file'
    | 'image'
    | 'images'
    | 'layeredCheckBox'
    | 'logs'
    | 'object'
    | 'objects'
    | 'pickList'
    | 'ref'
    | 'switch'
    | 'text'
    | 'textArea'
    | 'tinymce'
    | 'videos'
    | 'virtual';

  /**
   * On field changed
   */
  onChange?: (self: RestAdminComponent) => void;

  /**
   * Placeholder
   */
  placeholder?: string;

  /**
   * Set as disabled
   */
  disabled?: boolean;

  /**
   * Hide column while editing
   */
  hidden?: boolean;

  /**
   * Need this if type is 'enum'
   */
  options?: Array<{
    /**
     * Label
     */
    label: string;

    /**
     * value
     */
    value: any;
  }>;

  /**
   * Need this if type is 'logs'
   */
  logs?: (item: any) => string;

  /**
   * Need this if type is 'datetime'
   */
  datetime?: {
    /**
     * eg. 2016:2020
     */
    yearRange: string;
  };

  /**
   * Need this when type is 'file', 'files', 'image', or 'images', 'videos'
   */
  upload?: (file: Blob) => Promise<string>;

  /**
   * Need this when type is 'pickList'
   */
  display?: (item: any) => string;

  /**
   * Need this if type is 'ref'
   */
  ref?: {
    /**
     * Reference label
     */
    label: ((x: any) => string) | String;

    /**
     * Reference data field
     */
    path: string;
  };

  /**
   * Need this if type is 'custom'
   */
  custom?: {
    /**
     * Display
     */
    display: (selected: any, key: string) => string;

    /**
     * Click
     */
    onClick: (selected: any, key: string) => Promise<any>;
  };

  /**
   * Need this if type is 'switch'
   */
  onLabel?: string;
  offLabel?: string;

  /**
   * for pickList
   */
  filterBy?: string;

  /**
   * for Tinymce
   */
  config?: any;

  /**
   * for autoComplete
   */
  autoComplete?: IParamsColEditorAutoComplete;

  /**
   * for object and objects
   */
  title?: (selected: any) => string;
  cols?: IParamsCol[];

    /**
   * Need this if type is 'virtual'
   */
  virtual?: (selected: any, key: string) => string;

  /**
   * custom ngClass
   */
  class?: any;
}
