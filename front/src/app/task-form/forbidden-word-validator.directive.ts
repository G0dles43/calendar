import { Directive, Input } from '@angular/core';
import {NG_VALIDATORS, AbstractControl, ValidationErrors, Validator} from '@angular/forms';

@Directive({
  selector: '[appForbiddenWordValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: ForbiddenWordValidatorDirective, multi: true}],
  standalone:true,
})
export class ForbiddenWordValidatorDirective implements Validator {
  @Input('appForbiddenWordValidator') forbiddenWordValidator: string = 'forbidden';

  validate(control: AbstractControl): ValidationErrors | null{
    if(control.value && control.value.includes(this.forbiddenWordValidator)){
      return {'forbiddenWord': {value: control.value}};
    }
    return null;
  }
  constructor() { }

}
