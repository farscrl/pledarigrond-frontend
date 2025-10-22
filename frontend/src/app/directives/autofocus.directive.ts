import { Directive, ElementRef, inject } from '@angular/core';

@Directive({ selector: '[autofocus]' })
export class AutofocusDirective {
  private host = inject(ElementRef);


  ngAfterViewInit() {
    this.host.nativeElement.focus();
  }

}
