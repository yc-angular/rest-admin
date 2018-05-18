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
import { IPaginateData, IParams, IParamsCol } from './interfaces';

@Component({
  selector: 'yca-rest-admin',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  providers: [ConfirmationService],
})
export class RestAdminComponent implements OnInit {
  /**
   * Component params
   */
  @Input() public params: IParams;

  /**
   * Paginated data from query
   */
  public data: IPaginateData;

  /**
   * Current selected row
   */
  public selected: any;

  /**
   * Whether the modal is showing
   */
  public showModal: boolean;

  /**
   * Primeng Message array
   */
  public msgs: Message[] = [];

  /**
   * Colum options
   */
  private columnOptions: SelectItem[];

  /**
   * Current Date
   */
  public now: Date = new Date();

  /**
   * References
   */
  public refs: { [x: string]: any[] } = {};

  /**
   * Point to this
   */
  private self: RestAdminComponent;

  /**
   * Last options used for query
   */
  private lastOptions: any;

  /**
   * Last filters used for query
   */
  private lastFilters: any;

  /**
   * Last LazyLoadEvent event
   */
  private lastEvent: any;

  /**
   * Modal width
   */
  private width = window.innerWidth;

  /**
   * Modal Height
   */
  private height = window.innerHeight;

  blocked: boolean;

  constructor(
    public confirmationService: ConfirmationService,
    public auth: Auth
  ) {
    this.self = this;
  }

  ngOnInit(): void {
    this.columnOptions = [];
    for (const col of this.params.cols) {
      this.columnOptions.push({ label: col.header, value: col });
    }
    this.loadData(
      JSON.stringify({
        limit: 0,
        page: 1,
      }),
      JSON.stringify({})
    );
  }

  /**
   * Query paginated data
   * @param options {any} query options
   * @param filters {any} query filters
   */
  async loadData(options: any, filters: any): Promise<void> {
    const url: string = `${
      this.params.api
    }?_options=${options}&_filters=${filters}`;
    try {
      const res = await fetch('GET', url, null, {
        Authorization: `Bearer ${this.auth.jwt}`,
      });
      if (this.params.renderer) {
        this.data = this.params.renderer(res.data);
      } else {
        this.data = res.data;
      }
      this.lastFilters = filters;
      this.lastOptions = options;
      if (this.params.dt) this.params.dt.paginator = true;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * DataTable lazy load
   * @param event {LazyLoadEvent} LazyLoadEvent
   * @param dt {DataTable} DataTable
   */
  async loadLazy(event: LazyLoadEvent, dt: DataTable): Promise<void> {
    this.lastEvent = event;
    this.params.dt = dt;
    const page: number = Math.floor(event.first / event.rows) + 1;
    const limit: number = event.rows === 100 ? 99999999 : event.rows;
    const options: any = this.params.globalOptions || {};
    options.limit = limit;
    options.page = page;
    if (event.sortField) {
      let str: string = event.sortField;
      if (event.sortOrder === -1) str = '-' + str;
      options.sort = str;
    }

    const filters: any = this.params.globalFilters || {};
    for (const k of Object.keys(event.filters)) {
      switch (event.filters[k].matchMode) {
        case 'in':
          filters[k] = { $in: event.filters[k].value };
          break;
        case 'startsWith':
          filters[k] = { $regex: '^' + event.filters[k].value };
          break;
        case 'endsWith':
          filters[k] = { $regex: event.filters[k].value + '$' };
          break;
        case 'equals':
          filters[k] = event.filters[k].value;
          break;
        case 'range':
          filters[k] = {
            $gte: event.filters[k].value[0],
            $lt: event.filters[k].value[1],
          };
          break;
        case 'id':
          if (event.filters[k].value && event.filters[k].value.length === 24) {
            filters[k] = event.filters[k].value;
          } else {
            delete filters[k];
          }
          break;
        case 'number':
          filters[k] = parseFloat(event.filters[k].value);
          break;
        case 'custom':
          const col = this.params.cols.find(x => x.field === k);
          if (col) {
            filters[k] = await col.filter.custom(event.filters[k].value);
          } else {
            delete filters[k];
          }
          break;
      }
    }
    this.loadData(JSON.stringify(options), JSON.stringify(filters));
  }

  /**
   * Select a row
   * @param event {any} $event
   */
  select(event: any): void {
    this.selected = JSON.parse(JSON.stringify(this.selected));
    if (this.params.preEdit) this.params.preEdit(this);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.showModal = true;
    if (this.params.onShow) this.params.onShow(this);
  }

  /**
   * Add a row
   */
  add(): void {
    this.selected = {};
    if (this.params.preEdit) this.params.preEdit(this);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.showModal = true;
    if (this.params.onShow) this.params.onShow(this);
  }

  /**
   * Columns to display
   */
  getDisplayCols(): IParamsCol[] {
    return this.params.cols.filter(x => {
      if (!x.display) return true;
      if (x.display.type === 'hide') return false;
      return true;
    });
  }

  /**
   * Columns to be edited
   */
  isEditorHidden(editor) {
    if(typeof editor.hidden === 'function') {
      return editor.hidden(this);
    } else {
      return editor.hidden;
    }
  }
  getEditorCols(): IParamsCol[] {
    return this.params.cols.filter(x => x.editor && !this.isEditorHidden(x.editor));
  }

  /**
   * Close modal and unselect row
   */
  cancel(): void {
    this.showModal = false;
    this.selected = null;
  }

  /**
   * Save a row
   */
  async save(): Promise<any> {
    let url: string;
    let method: string;
    if (this.selected._id) {
      url = this.params.api + '/' + this.selected._id;
      method = 'PATCH';
    } else {
      url = this.params.api;
      method = 'POST';
    }
    const params: any = {};
    for (const key of Object.keys(this.selected)) {
      params[key] = this.selected[key];
    }
    if (this.params.preSave) this.params.preSave(params);
    this.blocked = true;
    try {
      const res = await fetch(
        method,
        url,
        params,
        { Authorization: `Bearer ${this.auth.jwt}` },
        !this.params.formdata
      );
      this.blocked = false;
      this.loadData(this.lastOptions, this.lastFilters);
      this.cancel();
      this.msgs = [
        ...this.msgs,
        {
          severity: 'success',
          summary: '保存成功',
        },
      ];
      return res;
    } catch (error) {
      this.blocked = false;
      console.error(error);
      this.msgs = [
        ...this.msgs,
        {
          severity: 'error',
          summary: '保存失败',
          detail: error.data.message,
        },
      ];
      return null;
    }
  }

  /**
   * Delete a row
   */
  delete(): void {
    this.confirmationService.confirm({
      message: '删除后不能返回，确定删除?',
      accept: async () => {
        this.blocked = true;
        try {
          const res = await fetch(
            'DELETE',
            `${this.params.api}/${this.selected._id}`,
            null,
            { Authorization: `Bearer ${this.auth.jwt}` }
          );
          this.blocked = false;
          this.cancel();
          this.msgs = [
            ...this.msgs,
            {
              severity: 'success',
              summary: '删除成功',
            },
          ];
          this.loadData(this.lastOptions, this.lastFilters);
        } catch (error) {
          this.blocked = false;
          console.error(error);
          this.msgs = [
            ...this.msgs,
            {
              severity: 'error',
              summary: '删除失败',
              detail: error.data.message,
            },
          ];
        }
      },
    });
  }

  /**
   * Add Datetime filter range
   * @param col {any} column
   */
  addDatetimeFilterRange(col: any): void {
    const fr: Date = col.filter.fr;
    const to: Date = col.filter.to;
    if (!fr || !to) return;
    const value: number[] = [fr.getTime(), to.getTime()];
    const field: Date = col.field;
    const mode: string = col.filter.mode;
    this.params.dt.filter(value, field, mode);
  }

  /**
   * Reload data
   */
  reload(): void {
    this.params.dt.filter(null, 'dummy', 'in');
    this.params.dt.paginator = false;
  }

  /**
   * Get reference options
   * @param col {any} column
   */
  getRefOptions(col: any): any {
    if (this.refs[col.field]) return this.refs[col.field];
    this.refs[col.field] = [];
    fetch('GET', col.editor.ref.path, null, {
      Authorization: `Bearer ${this.auth.jwt}`,
    })
      .then(res => {
        this.refs[col.field] = res.data.docs.map(x => {
          return {
            label:
              col.editor.ref.label.constructor === String
                ? x[col.editor.ref.label]
                : col.editor.ref.label(x),
            value: x._id,
          };
        });
        this.refs[col.field].unshift({
          label: '请选择',
          value: null,
        });
      })
      .catch(console.error);
    return this.refs[col.field];
  }

  /**
   * Export csv
   * @param dt {DataTable} DataTable
   */
  exportCSV(dt: DataTable): void {
    const header: string = dt.columns.map(x => x.header).join(',');
    const rows: any = dt.value
      .map(obj => {
        return dt.columns
          .map(x => {
            const col: IParamsCol = this.params.cols.find(
              y => y.field === x.field
            );
            if (col.display && col.display.type === 'enum')
              return col.display.map(dt.resolveFieldData(obj, x.field));
            return dt.resolveFieldData(obj, x.field);
          })
          .join(',');
      })
      .join('\n');
    let body: string = [header, rows].join('\n');
    const blob: Blob = new Blob([body], {
      type: 'text/csv;charset=utf-8;',
    });
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, this.params.title.list + '.csv');
    } else {
      const link: HTMLAnchorElement = document.createElement('a');
      link.style.display = 'none';
      document.body.appendChild(link);
      if (link.download !== undefined) {
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', this.params.title.list + '.csv');
        document.body.appendChild(link);
        link.click();
      } else {
        body = 'data:text/csv;charset=utf-8,' + body;
        window.open(encodeURI(body));
      }
      document.body.removeChild(link);
    }
  }
}
