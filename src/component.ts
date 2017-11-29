import { Component, OnInit, Input } from '@angular/core';
import { ConfirmationService, Message, LazyLoadEvent, SelectItem, DataTable } from 'primeng/primeng';
import { Auth } from '@yca/auth';
import { fetch } from '@yct/utils';
import * as lodash from 'lodash';

@Component({
  selector: 'yca-rest-admin',
  templateUrl: './component.html',
  providers: [ConfirmationService]
})
export class RestAdminComponent implements OnInit {
  self: any;
  @Input() params: IParams;
  data: IPaginateData;
  lastOptions: any;
  lastFilters: any;
  lastEvent: any;
  selected: any;
  selectedIndex: any = {};
  showModal: boolean;
  msgs: Message[] = [];
  columnOptions: SelectItem[];
  now: Date = new Date();
  refs: any = {};

  width = window.innerWidth;
  height = window.innerHeight;

  constructor(
    public confirmationService: ConfirmationService,
    public auth: Auth
  ) {
    this.self = this;
  }

  ngOnInit(): void {
    this.columnOptions = [];
    for (let col of this.params.cols) {
      this.columnOptions.push({ label: col.header, value: col });
    }
    this.loadData(JSON.stringify({
      limit: 0,
      page: 1
    }), JSON.stringify({}));
  }

  loadData(options: any, filters: any): void {
    let url: string = `${this.params.api}?_options=${options}&_filters=${filters}`;
    fetch(
      'GET',
      url,
      null,
      { Authorization: `Bearer ${this.auth.jwt}` }
    )
      .then(res => {
        if (this.params.renderer) {
          this.data = this.params.renderer(res.data);
        } else {
          this.data = res.data;
        }
        this.lastFilters = filters;
        this.lastOptions = options;
        if (this.params.dt)
          this.params.dt.paginator = true;
      })
      .catch(console.error);
  }

  loadLazy(event: LazyLoadEvent, dt: DataTable): void {
    this.lastEvent = event;
    this.params.dt = dt;
    let page: number = Math.floor(event.first / event.rows) + 1;
    let limit: number = event.rows === 100 ? 99999999 : event.rows;
    let options: any = this.params.globalOptions || {};
    options.limit = limit;
    options.page = page;
    if (event.sortField) {
      let str: string = event.sortField;
      if (event.sortOrder === -1) str = '-' + str;
      options.sort = str;
    }

    let filters: any = this.params.globalFilters || {};
    for (let k of Object.keys(event.filters)) {
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
          filters[k] = { $gte: event.filters[k].value[0], $lt: event.filters[k].value[1] };
          break;
        case 'id':
          if (event.filters[k].value && event.filters[k].value.length === 24) {
            filters[k] = event.filters[k].value;
          } else {
            delete filters[k];
          }
          break;
      }
    }
    this.loadData(JSON.stringify(options), JSON.stringify(filters));
  }

  select(event: any): void {
    this.selected = JSON.parse(JSON.stringify(this.selected));
    if (this.params.preEdit)
      this.params.preEdit(this);
    for (let col of this.params.cols) {
      if (col.editor) {
        switch (col.editor.type) {
          case 'datetime':
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
            this.selected[col.field] = this.selected[col.field] || [];
            this.selectedIndex[col.field] = 0;
            break;
        }
      }
    }
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.showModal = true;
    if (this.params.onShow) this.params.onShow.bind(this)();
  }

  add(): void {
    this.selected = {};
    if (this.params.preEdit)
      this.params.preEdit(this);
    for (let col of this.params.cols) {
      if (col.editor) {
        switch (col.editor.type) {
          case 'pickList':
            this.selected[col.field] = this.selected[col.field] || [];
            (col.editor as any).pickListSource = lodash.differenceWith(col.editor.options, this.selected[col.field], lodash.isEqual);
            break;
          case 'images':
            this.selected[col.field] = this.selected[col.field] || [];
            this.selectedIndex[col.field] = 0;
            break;
        }
      }
    }
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.showModal = true;
    if (this.params.onShow) this.params.onShow.bind(this)();
  }

  getDisplayCols(): IParamsCol[] {
    return this.params.cols.filter(x => {
      if (!x.display) return true;
      if (x.display.type === 'hide') return false;
      return true;
    });
  }

  getEditorCols(): IParamsCol[] {
    return this.params.cols.filter(x => x.editor && !x.editor.hidden);
  }

  onChange(fn: Function): void {
    if (!fn) return;
    fn.bind(this)();
  }

  cancel(): void {
    this.showModal = false;
    this.selected = null;
  }

  save(): void {
    let url: string;
    let method: string;
    if (this.selected._id) {
      url = this.params.api + '/' + this.selected._id;
      method = 'PATCH';
    } else {
      url = this.params.api;
      method = 'POST';
    }
    let params: any = {};
    for (let key of Object.keys(this.selected)) {
      params[key] = this.selected[key];
    }
    if (this.params.preSave) this.params.preSave(params);
    fetch(method, url, params, { Authorization: `Bearer ${this.auth.jwt}` }, !this.params.formdata)
      .then(res => {
        if (params) {
          this.loadData(this.lastOptions, this.lastFilters);
        } else {
          this.loadData(JSON.stringify({
            limit: this.data.limit,
            page: 1,
            sort: '-_id'
          }), JSON.stringify({}));
        }
        this.cancel();
        this.msgs = [...this.msgs, {
          severity: 'success', summary: '保存成功'
        }];
      })
      .catch(error => {
        console.error(error);
        this.msgs = [...this.msgs, {
          severity: 'error', summary: '保存失败', detail: error.data.message
        }];
      });
  }

  delete(): void {
    this.confirmationService.confirm({
      message: '删除后不能返回，确定删除?',
      accept: () => {
        fetch('DELETE', `${this.params.api}/${this.selected._id}`, null, { Authorization: `Bearer ${this.auth.jwt}` })
          .then(res => {
            this.cancel();
            this.msgs = [...this.msgs, {
              severity: 'success', summary: '删除成功'
            }];
            this.loadData(this.lastOptions, this.lastFilters);
          })
          .catch(error => {
            console.error(error);
            this.msgs = [...this.msgs, {
              severity: 'error', summary: '删除失败', detail: error.data.message
            }];
          });
      }
    });
  }

  addDatetimeFilterRange(col: any): void {
    let fr: Date = col.filter.fr;
    let to: Date = col.filter.to;
    if (!fr || !to) return;
    let value: [number] = [fr.getTime(), to.getTime()];
    let field: Date = col.field;
    let mode: string = col.filter.mode;
    this.params.dt.filter(value, field, mode);
  }

  reload(): void {
    this.params.dt.filter(null, 'dummy', 'in');
    this.params.dt.paginator = false;
  }

  getRefOptions(col: any): any {
    if (this.refs[col.field]) return this.refs[col.field];
    this.refs[col.field] = [];
    fetch('GET', col.editor.ref.path, null, { Authorization: `Bearer ${this.auth.jwt}` })
      .then(res => {
        this.refs[col.field] = res.data.docs.map(x => {
          return {
            label: col.editor.ref.label.constructor === String ? x[col.editor.ref.label] : col.editor.ref.label(x),
            value: x._id
          };
        });
        this.refs[col.field].unshift({
          label: '请选择',
          value: null
        });
      })
      .catch(console.error);
    return this.refs[col.field];
  }

  exportCSV(dt: DataTable): void {
    let header: string = dt.columns.map(x => x.header).join(',');
    let rows: any = dt.value.map(obj => {
      return dt.columns.map(x => {
        let col: IParamsCol = this.params.cols.find(y => y.field === x.field);
        if (col.display && col.display.type === 'enum')
          return col.display.map(dt.resolveFieldData(obj, x.field));
        return dt.resolveFieldData(obj, x.field);
      }).join(',');
    }).join('\n');
    let body: string = [header, rows].join('\n');
    let blob: Blob = new Blob([body], {
      type: 'text/csv;charset=utf-8;'
    });
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, this.params.title.list + '.csv');
    } else {
      let link: HTMLAnchorElement = document.createElement('a');
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

  onFileChange(e: any, col: IParamsCol): void {
    if (e.target.files && e.target.files[0]) {
      col.editor.upload(e.target.files[0])
        .then(url => {
          this.selected[col.field] = url;
        })
        .catch(console.error);
    }
  }

  onFilesChange(e: any, col: IParamsCol, index: number): void {
    if (e.target.files && e.target.files[0]) {
      col.editor.upload(e.target.files[0])
        .then(url => {
          this.selected[col.field][index] = url;
          this.selectedIndex[col.field] = index;
        })
        .catch(console.error);
    }
  }

  viewImage(url) {
    window.open(url, '_blank');
  }

  download(url) {
    window.open(url, '_blank');
  }

  onCustomClick(fn, selected, key) {
    fn(selected[key])
      .then(v => {
        selected[key] = v;
      })
      .catch(console.error);
  }
}

export interface IParams {
  api: string;
  title: {
    list: string,
    edit: string
  };
  cols: IParamsCol[];
  rows?: number;
  onShow?: () => void;
  hideAdd?: boolean;
  hideCount?: boolean;
  hideDelete?: boolean;
  hideSave?: boolean;
  hideCancel?: boolean;
  hideExport?: boolean;
  dt?: DataTable;
  customButtons?: [IParamsCustomButton];
  editorButtons?: [IParamsEditorButton];
  globalFilters?: any;
  globalOptions?: any;
  formdata?: boolean;
  preSave?: (self: any) => void;
  preEdit?: (self: any) => void;
  renderer?: (data: IPaginateData) => IPaginateData;
}

export interface IParamsCustomButton {
  label: string;
  handler: (self: any) => void;
  class?: string;
  icon?: string;
}

export interface IParamsCol {
  field: string;
  header: string;
  style?: Object;
  sortable?: boolean;
  filter?: IParamsColFilter;
  display?: IParamsColDisplay;
  editor?: IParamsColEditor;
}

export interface IParamsEditorButton {
  label: string;
  handler: (self: any) => void;
  class?: string;
  icon?: string;
}

export interface IParamsColEditor {
  type: 'text' | 'chip' | 'textArea' | 'switch' | 'enum' | 'ref' | 'datetime' | 'logs' | 'file' | 'image' | 'images' | 'pickList' | 'custom';
  ref?: {
    label: ((x: any) => string) | String,
    path: string
  };
  custom?: {
    display: (item: any) => string;
    onClick: (item: any) => Promise<any>;
  };
  options?: any;
  onChange?: () => void;
  placeholder?: string;
  disabled?: boolean;
  hidden?: boolean;
  logs?: (item: any) => string;
  datetime?: {
    yearRange: string;
  };
  upload?: (file: Blob) => Promise<string>;
  display?: (item: any) => string;
}

export interface IParamsColFilter {
  placeholder: string;
  type: 'text' | 'single' | 'multiple' | 'datetime-range';
  mode: 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'in' | 'range' | 'id';
  options?: any;
  fr?: any;
  to?: any;
  yearRange?: string;
}

export interface IParamsColDisplay {
  type: 'text' | 'enum' | 'switch' | 'hide';
  map?: (x: any) => any;
}

export interface IPaginateData {
  docs: any[];
  total: number;
  limit: number;
  offset: number;
  page: number;
  pages: number;
}
