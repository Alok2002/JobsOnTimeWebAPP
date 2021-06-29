import { FilterMobileModule } from './filtermobile.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TextMaskModule } from 'angular2-text-mask';
import { TagInputModule } from 'ngx-chips';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxMaskModule } from '../../assets/ax-npm/ngx-mask';
import { ClientComponent } from '../client';
import { ClientAccountComponent } from '../client/clientaccount.component';
import { ClientAddressComponent } from '../client/clientaddress.component';
import { ClientContactComponent } from '../client/clientcontact.component';
import { ClientDetailsComponent } from '../client/clientdetails.component';
import { ClientDocumentComponent } from '../client/clientdocument.component';
import { ClientEditComponent } from '../client/clientedit.component';
import { ClientFeedbackComponent } from '../client/clientfeedback.component';
import { ClientJobComponent } from '../client/clientjob.component';
import { ClientNotesComponent } from '../client/clientnotes.component';
import { ClientQuoteComponent } from '../client/clientquote.component';
import { ClientVenueComponent } from '../client/clientvenue.component';
import { JobComponentModule } from './child/jobcomponent.module';
import { ClientContactModule } from './clientcontact.module';
import { ClientPOModule } from './clientpo.module';
import { ClientVenueModule } from './clientvenue.module';
import { FileuploadModule } from './fileupload.module';
import { FilterModule } from './filter.module';
import { NumericModule } from './numeric.module';
import { OrderbyModule } from './orderby.module';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { customCurrencyMaskConfig } from '../app.module';
import { CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ClientPrivateListComponent } from '../client/clientprivatelist.component';
import { CKEditorModule } from 'ckeditor4-angular';

export const route: Routes = [
    { path: '', component: ClientComponent, pathMatch: 'full' },
    { path: 'add', component: ClientDetailsComponent, pathMatch: 'full' },
    { path: 'edit/:id', component: ClientDetailsComponent, pathMatch: 'full' },
    { path: 'edit/:id/:selectedtab', component: ClientDetailsComponent, pathMatch: 'full' },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(route),
        NguiAutoCompleteModule,
        AngularMultiSelectModule,
        TagInputModule,
        GooglePlaceModule,
        NguiDatetimePickerModule,
        NgxMaskModule.forRoot(),
        FilterModule,
        OrderbyModule,
        ClientContactModule,
        FileuploadModule,
        ClientVenueModule,
        TextMaskModule,
        NumericModule,
        ClientPOModule,
        JobComponentModule,
        TableModule,
        MultiSelectModule,
        PaginatorModule,
        DateInputsModule,
        CurrencyMaskModule,
        CKEditorModule,
        FilterMobileModule
    ],
    declarations: [
        ClientComponent,
        ClientDetailsComponent,
        ClientEditComponent,
        ClientAddressComponent,
        ClientContactComponent,
        ClientAccountComponent,
        ClientNotesComponent,
        ClientDocumentComponent,
        ClientJobComponent,
        ClientFeedbackComponent,
        ClientVenueComponent,
        ClientQuoteComponent,
        ClientPrivateListComponent
    ],
    providers: [{ provide: CURRENCY_MASK_CONFIG, useValue: customCurrencyMaskConfig }]
})

export class ClientModule {
}
