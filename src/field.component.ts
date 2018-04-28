import { Component, OnInit, Input } from '@angular/core';
import { ConfirmationService, Message, LazyLoadEvent, SelectItem, DataTable } from 'primeng/primeng';
import { Auth } from '@yca/auth';
import { fetch } from '@yct/utils';
import * as lodash from 'lodash';
import { IParamsCol, RestAdminComponent } from './component';

@Component({
  selector: 'yca-rest-admin-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  providers: [ConfirmationService]
})
export class RestAdminFieldComponent implements OnInit {
  @Input() cols: IParamsCol[];
  @Input() rac: RestAdminComponent;
  @Input() selected: any;
  selectedIndex: any = {};

  ngOnInit() {
    for (let col of this.cols) {
      if (col.editor) {
        switch (col.editor.type) {
          case 'datetime':
            if (this.selected[col.field])
              this.selected[col.field] = new Date(this.selected[col.field]);
            break;
          case 'chip':
            this.selected[col.field] = this.selected[col.field] || [];
            break;
          case 'pickList':
            this.selected[col.field] = this.selected[col.field] || [];
            (col.editor as any).pickListSource = lodash.differenceWith(col.editor.options, this.selected[col.field], lodash.isEqual);
            break;
          case 'images':
          case 'videos':
          case 'objects':
            this.selected[col.field] = this.selected[col.field] || [];
            this.selectedIndex[col.field] = 0;
            break;
          case 'autoComplete':
            col.editor.autoComplete.prepare && col.editor.autoComplete.prepare(this.rac, this.selected, col);
            break;
          case 'object':
            this.selected[col.field] = this.selected[col.field] || {};
            break;
        }
      }
    }
  }

  onChange(fn: (rac?: RestAdminComponent, selected?: any, cols?: IParamsCol[]) => any): void {
    if (!fn) return;
    fn(this.rac, this.selected, this.cols);
  }

  onCustomClick(fn: any, selected: any, key: string) {
    if (!fn) return;
    fn(selected, key);
  }


  /**
   * On file changed
   * @param e {any} $event
   * @param col {IParamsCol} IParamsCol
   */
  async onFileChange(e: any, col: IParamsCol): Promise<void> {
    if (e.target.files && e.target.files[0]) {
      this.rac.blocked = true;
      try {
        const url = await col.editor.upload(e.target.files[0]);
        this.rac.blocked = false;
        this.selected[col.field] = url;
      } catch (e) {
        this.rac.blocked = false;
        console.error(e);
      }
    }
  }

  /**
   * On files changed
   * @param e {any} $event
   * @param col {IParamsCol} IParamsCol
   * @param index {number} file index
   */
  async onFilesChange(e: any, col: IParamsCol, index: number): Promise<void> {
    if (e.target.files && e.target.files[0]) {
      this.rac.blocked = true;
      try {
        const url = await col.editor.upload(e.target.files[0]);
        this.rac.blocked = false;
        this.selected[col.field][index] = url;
        this.selectedIndex[col.field] = index;
      } catch (e) {
        this.rac.blocked = false;
        console.error(e);
      }
    }
  }

  /**
   * View image
   * @param url {string} url
   */
  viewImage(url: string) {
    window.open(url, '_blank');
  }

  /**
   * Download file
   * @param url {string} url
   */
  download(url: string) {
    window.open(url, '_blank');
  }
}