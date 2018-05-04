import { RestAdminComponent } from '../component';

export interface IParamsEditorButton {
  /**
   * Label of button
   */
  label: string;

  /**
   * Click handler
   */
  handler: (self: RestAdminComponent) => void;

  /**
   * css class
   */
  class?: string;

  /**
   * fa icon
   */
  icon?: string;

  /**
   * Whether it is available
   */
  when?: (self: RestAdminComponent) => boolean;
}
