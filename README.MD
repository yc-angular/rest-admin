# @yca/rest-admin

## Documentation
[https://yc-angular.github.io/rest-admin/](https://yc-angular.github.io/rest-admin/)

## Installation

To install this library, run:

```bash
$ npm install @yca/rest-admin --save
```

## Usage

Once your library is imported, you can use its components, directives and pipes in your Angular application:

```ts
import { IParams } from '@yca/rest-admin'

params: IParams = {
  ...
}
```
```xml
<yca-rest-admin [params]="params"></yca-rest-admin>
```

## interfaces
```ts
interface IParams {
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

interface IParamsCustomButton {
  label: string;
  handler: (self: any) => void;
  class?: string;
  icon?: string;
}

interface IParamsCol {
  field: string;
  header: string;
  style?: Object;
  sortable?: boolean;
  filter?: IParamsColFilter;
  display?: IParamsColDisplay;
  editor?: IParamsColEditor;
}

interface IParamsEditorButton {
  label: string;
  handler: (self: any) => void;
  class?: string;
  icon?: string;
}

interface IParamsColEditor {
  type: 'text' | 'chip' | 'textArea' | 'switch' | 'enum' | 'ref' | 'datetime' | 'logs' | 'image' | 'images';
  ref?: {
    label: ((x: any) => string) | String,
    path: string
  };
  options?: any;
  onChange?: () => void;
  placeholder?: string;
  disabled?: boolean;
  logs?: (x: any) => string;
  upload?: (x: any) => Promise<string>;
}

interface IParamsColFilter {
  placeholder: string;
  type: 'text' | 'single' | 'multiple' | 'datetime-range';
  mode: 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'in' | 'range' | 'id';
  options?: any;
  fr?: any;
  to?: any;
}

interface IParamsColDisplay {
  type: 'text' | 'enum' | 'switch' | 'hide';
  map?: (x: any) => any;
}

interface IPaginateData {
  docs: any[];
  total: number;
  limit: number;
  offset: number;
  page: number;
  pages: number;
}
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Yu Chen](mailto:yu.chen@live.ie)
