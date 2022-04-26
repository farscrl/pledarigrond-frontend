import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlighter'
})
export class HighlighterPipe implements PipeTransform {

  transform(value: any, args: string, apply: boolean): unknown {
    if(!args || !apply) return value;
    const re = new RegExp("("+args+")", 'igm');
      value= value.replace(re, '<span class="highlighted-text">$1</span>');
      return value;
  }

}
