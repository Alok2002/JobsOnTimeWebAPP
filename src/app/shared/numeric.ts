import {Directive, ElementRef, HostListener} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[numeric]'
})

export class NumericDirective {

  constructor(
    private elementRef: ElementRef,
    private model: NgControl
  ) { }

  @HostListener('input') inputChange() {
    const newValue = this.elementRef.nativeElement.value.replace(/\D/g, '')
    this.model.control.setValue(newValue, {
      emitEvent: false,
      emitModelToViewChange: false,
      emitViewToModelChange: false
    });
  }

}
