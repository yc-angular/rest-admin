import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Generated class for the SafePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) { }

  transform(v: string, e: string): SafeHtml {
    if (!e || e === 'html')
      return this._sanitizer.bypassSecurityTrustHtml(v);
  }
}
