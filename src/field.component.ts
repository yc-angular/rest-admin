import { Component, OnInit, Input } from '@angular/core';
import {
  ConfirmationService,
  Message,
  LazyLoadEvent,
  SelectItem,
  DataTable,
} from 'primeng/primeng';
import { Auth } from '@yca/auth';
import { fetch } from '@yct/utils';
import * as lodash from 'lodash';
import { RestAdminComponent } from './component';
import { IParamsCol } from './interfaces';

@Component({
  selector: 'yca-rest-admin-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  providers: [ConfirmationService],
})
export class RestAdminFieldComponent implements OnInit {
  @Input() cols: IParamsCol[];
  @Input() rac: RestAdminComponent;
  @Input() selected: any;
  selectedIndex: any = {};

  ngOnInit() {
    for (let col of this.getFilteredCols()) {
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
            (col.editor as any).pickListSource = lodash.differenceWith(
              col.editor.options,
              this.selected[col.field],
              lodash.isEqual
            );
            break;
          case 'images':
          case 'videos':
          case 'objects':
            this.selected[col.field] = this.selected[col.field] || [];
            this.selectedIndex[col.field] = 0;
            break;
          case 'autoComplete':
            col.editor.autoComplete.prepare &&
              col.editor.autoComplete.prepare(this.rac, this.selected, col);
            break;
          case 'object':
            this.selected[col.field] = this.selected[col.field] || {};
            break;
        }
      }
    }
  }

  onChange(
    fn: (rac?: RestAdminComponent, selected?: any, cols?: IParamsCol[]) => any
  ): void {
    if (!fn) return;
    fn(this.rac, this.selected, this.cols);
  }

  onCustomClick(fn: any, selected: any, key: string) {
    if (!fn) return;
    fn(selected, key);
  }

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

  viewImage(url: string) {
    window.open(url, '_blank');
  }

  download(url: string) {
    window.open(url, '_blank');
  }

  getFilteredCols() {
    return this.cols.filter(x => {
      if(typeof x.editor.hidden === 'function') {
        return !x.editor.hidden(this.rac);
      }
      return !x.editor.hidden;
    });
  }
}
