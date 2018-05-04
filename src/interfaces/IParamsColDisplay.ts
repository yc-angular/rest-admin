export interface IParamsColDisplay {
  /**
   * Type of display
   */
  type: 'text' | 'enum' | 'switch' | 'hide';

  /**
   * Need this if type is 'enum'
   */
  map?: (x: any) => string;
}
