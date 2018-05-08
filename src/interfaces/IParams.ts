import { DataTable } from 'primeng/primeng';
import { RestAdminComponent } from '../component';
import {
  IPaginateData,
  IParamsCol,
  IParamsCustomButton,
  IParamsEditorButton,
} from './';

export interface IParams {
  /**
   * ycs restful api endpoint
   */
  api: string;

  /**
   * Titles
   */
  title: {
    /**
     * Title in list
     */
    list: string;

    /**
     * Title while editing
     */
    edit: string;
  };

  /**
   * Columns
   */
  cols: IParamsCol[];

  /**
   * Number of rows a page
   */
  rows?: number;

  /**
   * Event on modal show
   */
  onShow?: (self: RestAdminComponent) => void;

  /**
   * Hide button add
   */
  hideAdd?: boolean;

  /**
   * Hide count
   */
  hideCount?: boolean;

  /**
   * Hide button delete
   */
  hideDelete?: boolean;

  /**
   * Hide button save
   */
  hideSave?: boolean;

  /**
   * Hide button cancel
   */
  hideCancel?: boolean;

  /**
   * Hide button export cvs
   */
  hideExport?: boolean;

  /**
   * DataTable
   */
  dt?: DataTable;

  /**
   * Custom buttons in list
   */
  customButtons?: IParamsCustomButton[];

  /**
   * Custom buttons while editing
   */
  editorButtons?: IParamsEditorButton[];

  /**
   * Global filters for query
   */
  globalFilters?: any;

  /**
   * Global options for query
   */
  globalOptions?: any;

  /**
   * Whether post data as formdata. Default is json.
   */
  formdata?: boolean;

  /**
   * Before save a row
   */
  preSave?: (params: any) => void;

  /**
   * Before edit a row
   */
  preEdit?: (self: RestAdminComponent) => void;

  /**
   * Render paginated data after query
   */
  renderer?: (data: IPaginateData) => IPaginateData;
}
