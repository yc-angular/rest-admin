export interface IParamsColFilter {
  /**
   * Placeholder
   */
  placeholder: string;

  /**
   * Type of filter
   */
  type: 'text' | 'single' | 'multiple' | 'datetime-range';

  /**
   * Filter mode
   */
  mode:
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'equals'
    | 'in'
    | 'range'
    | 'id'
    | 'number'
    | 'custom';

  /**
   * Need this when type is 'single' or 'multiple'
   */
  options?: any;

  /**
   * Optional for type 'datetime-range'.
   */
  fr?: any;
  /**
   * Optional for type 'datetime-range'.
   */
  to?: any;
  /**
   * Optional for type 'datetime-range'. default: 2016:2020
   */
  yearRange?: string;

  /**
   * Need this when type is 'custom'
   */
  custom?: (x: string) => Promise<any>;
}
