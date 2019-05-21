/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ObjectFields
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';

import {metadata} from '../services/metadata.service';
import {VersionManagerService} from '../services/versionmanager.service';

import {SystemComponents} from '../systemcomponents/systemcomponents';
import {DirectivesModule} from "../directives/directives";

import /*embed*/ {fieldGeneric} from './components/fieldgeneric';
import /*embed*/ {fieldSet} from './components/fieldset';
import /*embed*/ {field} from './components/field';
import /*embed*/ {fieldBlank} from './components/fieldblank';
import /*embed*/ {fieldLabel} from './components/fieldlabel';
import /*embed*/ {fieldContainer} from './components/fieldcontainer';
import /*embed*/ {fieldGenericDisplay} from './components/fieldgenericdisplay';
import /*embed*/ {fieldText} from './components/fieldtext';
import /*embed*/ {fieldNumber} from './components/fieldnumber';
import /*embed*/ {fieldHtml} from './components/fieldhtml';
import /*embed*/ {fieldHtmlEditor} from './components/fieldhtmleditor';
import /*embed*/ {fieldWYSIWYGEditor} from './components/fieldwysiwygeditor';
import /*embed*/ {fieldFloat} from './components/fieldfloat';
import /*embed*/ {fieldCurrency} from './components/fieldcurrency';
import /*embed*/ {fieldWeightedAmount} from './components/fieldweightedamount';
import /*embed*/ {fieldTotalAmount} from './components/fieldtotalamount';
import /*embed*/ {fieldEnum} from './components/fieldenum';
import /*embed*/ {fieldLanguage} from './components/fieldlanguage';
import /*embed*/ {fieldMailboxes} from './components/fieldmailboxes';
import /*embed*/ {fieldEmailTo} from './components/fieldemailto';
import /*embed*/ {fieldEmailTemplates} from './components/fieldemailtemplates';
import /*embed*/ {fieldMailRelais} from './components/fieldmailrelais';
import /*embed*/ {fieldMultienum} from './components/fieldmultienum';
import /*embed*/ {fieldMultienumCheckBox} from './components/fieldmultienumcheckbox';
import /*embed*/ {fieldEnumAlternate} from './components/fieldenumalternate';
import /*embed*/ {fieldEnumRadio} from './components/fieldenumradio';
import /*embed*/ {fieldBool} from './components/fieldbool';
import /*embed*/ {fieldParent} from './components/fieldparent';
import /*embed*/ {fieldModuleFilter} from './components/fieldmodulefilter';
import /*embed*/ {fieldRelate} from './components/fieldrelate';
import /*embed*/ {fieldRelateList} from './components/fieldrelatelist';
import /*embed*/ {fieldModifiedBy} from './components/fieldmodifiedby';
import /*embed*/ {fieldLookup} from './components/fieldlookup';
import /*embed*/ {fieldDate} from './components/fielddate';
import /*embed*/ {fieldTime} from './components/fieldtime';
import /*embed*/ {fieldDateTime} from './components/fielddatetime';
import /*embed*/ {fieldDateTimeDuration} from './components/fielddatetimeduration';
import /*embed*/ {fieldDuration} from './components/fieldduration';
import /*embed*/ {fieldDateTimeSpan} from './components/fielddatetimespan';
import /*embed*/ {fieldAddress} from './components/fieldaddress';
import /*embed*/ {fieldFullName} from './components/fieldfullname';
import /*embed*/ {fieldTitle} from './components/fieldtitle';
import /*embed*/ {fieldFile} from './components/fieldfile';
import /*embed*/ {fieldUrl} from './components/fieldurl';
import /*embed*/ {fieldEmail} from './components/fieldemail';
import /*embed*/ {fieldEmailAddresses} from './components/fieldemailaddresses';
import /*embed*/ {fieldEmailEmailAddress} from './components/fieldemailemailaddress';
import /*embed*/ {fieldEmailRecipients} from './components/fieldemailrecipients';
import /*embed*/ {fieldEmailRecipientsShort} from './components/fieldemailrecipientsshort';
import /*embed*/ {fieldCurrencies} from './components/fieldcurrencies';
import /*embed*/ {fieldCompanies} from './components/fieldcompanies';
import /*embed*/ {fieldVat} from './components/fieldvat';
import /*embed*/ {fieldBarcode} from './components/fieldbarcode';
import /*embed*/ {fieldBarcodeRenderer} from './components/fieldbarcoderenderer';
import /*embed*/ {fieldRating} from './components/fieldrating';
import /*embed*/ {fieldLookupRecent} from './components/fieldlookuprecent';
import /*embed*/ {fieldLookupSearch} from './components/fieldlookupsearch';
import /*embed*/ {fieldLookupSearchAdd} from './components/fieldlookupsearchadd';
import /*embed*/ {fieldModelFooterPopover} from './components/fieldmodelfooterpopover';
import /*embed*/ {fieldMediaFileImage} from './components/fieldmediafileimage';
import /*embed*/ {FieldMessagesComponent} from "./components/fieldmessages";
import /*embed*/ {FieldModuleLookupComponent} from "./components/fieldmodulelookup";
import /*embed*/ {FieldSignatureComponent} from "./components/fieldsignature";
import /*embed*/ {fieldServiceCategories,} from "./components/fieldcategories";
import /*embed*/ {fieldServiceCategoryTree} from "./components/fieldcategorytree";
import /*embed*/ {fieldServiceCategorySearch} from "./components/fieldcategorysearch";
import /*embed*/ {fieldWorklog} from "./components/fieldworklog";
import /*embed*/ {FieldModelInfoComponent} from "./components/fieldmodelinfo";
import /*embed*/ {FieldEnumModulesComponent} from "./components/fieldenummodules";
import /*embed*/ {FieldEnumOutputTemplates} from "./components/fieldenumoutputtemplates";
import /*embed*/ {fieldGDPR} from "./components/fieldgdpr";
import /*embed*/ {fieldServiceQueue} from "./components/fieldservicequeue";
import /*embed*/ {fieldTerritory} from "./components/fieldterritory";
import /*embed*/ {fieldTerritorySearch} from "./components/fieldterritorysearch";
import /*embed*/ {fieldSelectTree,} from "./components/fieldselecttree";
import /*embed*/ {fieldSelectTreeSearch} from "./components/fieldselecttreesearch";
import /*embed*/ {fieldSelectTreeTree} from "./components/fieldselecttreetree";
import /*embed*/ {fieldTerritorySecondary, fieldTerritorySecondaryPipe} from "./components/fieldterritorysecondary";
import /*embed*/ {fieldColorEnum} from "./components/fieldcolorenum";
import /*embed*/ {fieldBase64} from "./components/fieldbase64";
import /*embed*/ {fieldNotAuthorized} from "./components/fieldnotauthorized";
import /*embed*/ {fieldModuleIcon} from "./components/fieldmoduleicon";
import /*embed*/ {fieldRichText} from "./components/fieldrichtext";
import /*embed*/ {fieldEnumMulti} from "./components/fieldenummulti";
import /*embed*/ {fieldPhone} from "./components/fieldphone";
import /*embed*/ {fieldCronInterval} from "./components/fieldcroninterval";
import /*embed*/ {fieldGooglePlacesSearch} from "./components/fieldgoogleplacessearch";
import /*embed*/ {fieldTextID} from "./components/fieldtextid";

/**
* @ignore
*/
declare var _: any;

/**
 * the ObjectFields module holds all components taht are relevant for rendering fields. So they are resonsible for the display and editing of information tied to the metadata of a model
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SystemComponents,
        DirectivesModule,
    ],
    declarations: [
        fieldSet,
        field,
        fieldBlank,
        fieldNotAuthorized,
        fieldLabel,
        fieldContainer,
        fieldGeneric,
        fieldGenericDisplay,
        fieldText,
        fieldNumber,
        fieldHtml,
        fieldHtmlEditor,
        fieldWYSIWYGEditor,
        fieldFloat,
        fieldCurrency,
        fieldWeightedAmount,
        fieldTotalAmount,
        fieldCurrencies,
        fieldCompanies,
        fieldEnum,
        fieldLanguage,
        fieldMailboxes,
        fieldEmailTo,
        fieldEmailTemplates,
        fieldMailRelais,
        fieldMultienum,
        fieldMultienumCheckBox,
        fieldEnumAlternate,
        fieldEnumRadio,
        fieldBool,
        fieldDate,
        fieldTime,
        fieldDateTime,
        fieldDateTimeDuration,
        fieldDuration,
        fieldDateTimeSpan,
        fieldParent,
        fieldModuleFilter,
        fieldRelate,
        fieldRelateList,
        fieldModifiedBy,
        fieldLookup,
        fieldLookupRecent,
        fieldLookupSearch,
        fieldLookupSearchAdd,
        fieldAddress,
        fieldModelFooterPopover,
        fieldFullName,
        fieldTitle,
        fieldFile,
        fieldUrl,
        fieldEmail,
        fieldEmailAddresses,
        fieldEmailRecipients,
        fieldEmailRecipientsShort,
        fieldEmailEmailAddress,
        fieldVat,
        fieldBarcode,
        fieldBarcodeRenderer,
        fieldRating,
        fieldMediaFileImage,
        FieldMessagesComponent,
        FieldModuleLookupComponent,
        FieldSignatureComponent,
        fieldServiceCategories,
        fieldServiceCategoryTree,
        fieldServiceCategorySearch,
        fieldWorklog,
        FieldModelInfoComponent,
        FieldEnumModulesComponent,
        FieldEnumOutputTemplates,
        FieldModelInfoComponent,
        fieldGDPR,
        fieldServiceQueue,
        fieldTerritory,
        fieldTerritorySearch,
        fieldTerritorySecondary,
        fieldTerritorySecondaryPipe,
        fieldSelectTree,
        fieldSelectTreeSearch,
        fieldSelectTreeTree,
        fieldColorEnum,
        fieldBase64,
        fieldModuleIcon,
        fieldRichText,
        fieldEnumMulti,
        fieldPhone,
        fieldCronInterval,
        fieldGooglePlacesSearch,
        fieldTextID
    ],
    exports: [
        fieldSet,
        field,
        fieldLabel,
        fieldContainer,
        fieldGeneric,
        fieldGenericDisplay,
        fieldHtml,
        fieldMediaFileImage,
        FieldMessagesComponent,
        FieldModuleLookupComponent,
        FieldEnumOutputTemplates,
    ]
})
export class ObjectFields {
    private readonly  version = '1.0';
    private readonly build_date = '/*build_date*/';

    constructor(
        public metadata: metadata,
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
