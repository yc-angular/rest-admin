import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  InputSwitchModule,
  InputTextModule,
  InputTextareaModule,
  ButtonModule,
  DataTableModule,
  PaginatorModule,
  DialogModule,
  ConfirmDialogModule,
  DropdownModule,
  GrowlModule,
  ToolbarModule,
  MultiSelectModule,
  CalendarModule,
  SliderModule,
  ChipsModule,
  PickListModule,
  CheckboxModule,
  BlockUIModule,
  ProgressSpinnerModule,
} from 'primeng/primeng';
import { NgxTinymceModule } from 'ngx-tinymce';
import { RestAdminComponent } from './component';

export * from './component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    DataTableModule,
    PaginatorModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    GrowlModule,
    ToolbarModule,
    MultiSelectModule,
    CalendarModule,
    SliderModule,
    ChipsModule,
    PickListModule,
    CheckboxModule,
    NgxTinymceModule.forRoot({
      baseURL: '//cdn.bootcss.com/tinymce/4.7.4/',
    }),
  ],
  declarations: [
    RestAdminComponent
  ],
  exports: [
    RestAdminComponent
  ]
})
export class RestAdminModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RestAdminModule,
    };
  }
}
