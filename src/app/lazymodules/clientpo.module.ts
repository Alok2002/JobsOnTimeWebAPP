import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { ClientPOComponent } from './../client/clientpo.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { customCurrencyMaskConfig } from '../app.module';

// export const route: Routes = [
//   {path: '', component: FilterComponent}
// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    //RouterModule.forChild(route),
    NguiDatetimePickerModule,
    AngularMultiSelectModule,
    TableModule,
    MultiSelectModule,
    DateInputsModule,
    CurrencyMaskModule,
  ],
  exports: [ClientPOComponent],
  declarations: [
    ClientPOComponent
  ],
  providers: [{ provide: CURRENCY_MASK_CONFIG, useValue: customCurrencyMaskConfig }]
})

export class ClientPOModule {
}
