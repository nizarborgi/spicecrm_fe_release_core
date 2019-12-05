/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/*(c) aac services 2019. All Rights reserved)*/
"use strict";var __decorate=this&&this.__decorate||function(e,t,a,s){var i,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,a):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,a,s);else for(var l=e.length-1;0<=l;l--)(i=e[l])&&(r=(n<3?i(r):3<n?i(t,a,r):i(t,a))||r);return 3<n&&r&&Object.defineProperty(t,a,r),r},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(exports,"__esModule",{value:!0});var core_1=require("@angular/core"),platform_browser_1=require("@angular/platform-browser"),http_1=require("@angular/common/http"),forms_1=require("@angular/forms"),router_1=require("@angular/router"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),directives_1=require("../../directives/directives"),services_1=require("../../services/services"),objectfields_1=require("../../objectfields/objectfields"),rxjs_1=require("rxjs"),GroupwareService=function(){function e(e){this.backend=e,this.emailId="",this._messageId="",this.archiveto=[],this.archiveattachments=[],this.relatedBeans=[],this.outlookAttachments={attachmentToken:"",ewsUrl:"",attachments:[]}}return e.prototype.addBean=function(e){this.archiveto.push(e)},e.prototype.removeBean=function(t){var e=this.archiveto.findIndex(function(e){return t.id==e.id});this.archiveto.splice(e,1)},e.prototype.checkBeanArchive=function(t){return 0<=this.archiveto.findIndex(function(e){return t.id==e.id})},e.prototype.addAttachment=function(e){this.archiveattachments.push(e)},e.prototype.removeAttachment=function(t){var e=this.archiveattachments.findIndex(function(e){return t.id==e.id});this.archiveattachments.splice(e,1)},e.prototype.checkAttachmentArchive=function(t){return 0<=this.archiveattachments.findIndex(function(e){return t.id==e.id})},e.prototype.getAttachment=function(t){return this.outlookAttachments.attachments.filter(function(e){return t==e.id})},e.prototype.checkRelatedBeans=function(t){return 0<=this.relatedBeans.findIndex(function(e){return t.id==e.id})},e.prototype.archiveEmail=function(){var a=this,s=new rxjs_1.Subject;return this.assembleEmail().subscribe(function(e){var t={beans:a.archiveto,email:e};a.backend.postRequest("module/Emails/groupware/saveemailwithbeans",{},t).subscribe(function(e){if(0<a.archiveattachments.length){var t={attachmentToken:a.outlookAttachments.attachmentToken,ewsUrl:a.outlookAttachments.ewsUrl,outlookAttachments:a.archiveattachments,email_id:e.email_id};a.backend.postRequest("module/Emails/groupware/saveaddinattachments",{},t).subscribe(function(e){s.next(!0),s.complete()},function(e){s.error("error archiving attachments"),s.complete()}),a.emailId=e.email_id}else s.next(!0),s.complete()},function(e){s.error("error archiving email"),s.complete()})},function(e){console.log("Cannot assemble email: "+e)}),s.asObservable()},e.prototype.getEmailFromSpice=function(){var i=this,n=new rxjs_1.Subject,e={message_id:this._messageId};return this.backend.postRequest("module/Emails/groupware/getemail",{},e).subscribe(function(e){for(var t in i.emailId=e.email_id,e.linkedBeans)i.checkBeanArchive(e.linkedBeans[t])||i.addBean(e.linkedBeans[t]);for(var a in e.attachments)if(""!=a){var s=i.getAttachment(a);i.addAttachment(s[0])}n.next(!0),n.complete()},function(e){console.log(e),n.error(!1),n.complete()}),n.asObservable()},e.prototype.loadLinkedBeans=function(){var a=this,s=new rxjs_1.Subject,e=this.getEmailAddressData();return this.backend.postRequest("EmailAddress/searchBeans",{},e).subscribe(function(e){for(var t in e)a.checkRelatedBeans(e[t])||a.relatedBeans.push(e[t]);s.next(a.relatedBeans),s.complete()},function(e){s.error(e)}),s.asObservable()},Object.defineProperty(e.prototype,"messageId",{get:function(){return this._messageId},set:function(e){this._messageId=e},enumerable:!0,configurable:!0}),e=__decorate([core_1.Injectable(),__metadata("design:paramtypes",[services_1.backend])],e)}();exports.GroupwareService=GroupwareService;var GroupwarePaneBean=function(){function GroupwarePaneBean(e,t,a,s,i){this.groupware=e,this.language=t,this.metadata=a,this.model=s,this.view=i,this.view.displayLabels=!1}return GroupwarePaneBean.prototype.ngOnInit=function(){var e=this.metadata.getComponentConfig("GlobalHeaderSearchResultsItem",this.model.module);e&&e.mainfieldset&&(this.mainfieldsetfields=this.metadata.getFieldSetItems(e.mainfieldset)),e&&e.subfieldset&&(this.subfieldsetfields=this.metadata.getFieldSetItems(e.subfieldset))},GroupwarePaneBean.prototype.onClick=function(e){e.target.checked?this.groupware.addBean(this.bean):this.groupware.removeBean(this.bean)},__decorate([core_1.Input(),__metadata("design:type",Object)],GroupwarePaneBean.prototype,"bean",void 0),GroupwarePaneBean=__decorate([core_1.Component({selector:"groupware-pane-bean",template:'<article class="slds-tile slds-media slds-p-vertical--xx-small"><div class="slds-p-vertical--xx-small"><system-icon [module]="model.module" size="small"></system-icon></div><div class="slds-media__body"><div class="slds-grid slds-has-flexi-truncate"><span *ngIf="!mainfieldsetfields">{{model.data.summary_text}}</span><ul *ngIf="mainfieldsetfields" class="slds-list_horizontal slds-has-dividers_right slds-truncate"><ng-container *ngFor="let fieldsetitem of mainfieldsetfields"><li *ngIf="model.getField(fieldsetitem.field)" class="slds-item"><field-container [field]="fieldsetitem.field" [fieldconfig]="fieldsetitem.fieldconfig" fielddisplayclass="slds-truncate"></field-container></li></ng-container></ul><div class="slds-col--bump-left slds-checkbox"><input type="checkbox" name="beans" [id]="\'bean-\'+bean.id" (click)="onClick($event)" [checked]="groupware.checkBeanArchive(bean)"> <label class="slds-checkbox__label" [attr.for]="\'bean-\'+bean.id"><span class="slds-checkbox_faux"></span> <span class="slds-form-element__label slds-assistive-text">{{bean.name}}</span></label></div></div><div class="slds-truncate slds-text-body_small" title="Bean Module"><ul class="slds-list_horizontal slds-has-dividers_right slds-truncate"><li class="slds-item">{{language.getModuleName(model.module, true)}}</li><ng-container *ngFor="let fieldsetitem of subfieldsetfields"><li *ngIf="model.getField(fieldsetitem.field)" class="slds-item"><field-container [field]="fieldsetitem.field" [fieldconfig]="fieldsetitem.fieldconfig" fielddisplayclass="slds-truncate"></field-container></li></ng-container></ul></div></div></article>',providers:[services_1.view]}),__metadata("design:paramtypes",[GroupwareService,services_1.language,services_1.metadata,services_1.model,services_1.view])],GroupwarePaneBean)}();exports.GroupwarePaneBean=GroupwarePaneBean;var GroupwarePaneAttachment=function(){function e(e){this.groupware=e}return e.prototype.onClick=function(e){e.target.checked?this.groupware.addAttachment(this.attachment):this.groupware.removeAttachment(this.attachment)},__decorate([core_1.Input(),__metadata("design:type",Object)],e.prototype,"attachment",void 0),e=__decorate([core_1.Component({selector:"groupware-pane-attachment",template:'<article class="slds-tile slds-media slds-p-vertical--xx-small"><div class="slds-media__figure"><div class="slds-checkbox"><input type="checkbox" name="attachments" [id]="\'attachment-\'+attachment.id" (click)="onClick($event)" [checked]="groupware.checkAttachmentArchive(attachment)"> <label class="slds-checkbox__label" [attr.for]="\'attachment-\'+attachment.id"><span class="slds-checkbox_faux"></span> <span class="slds-form-element__label slds-assistive-text">{{attachment.name}}</span></label></div></div><div class="slds-media__body"><h3 class="slds-tile__title slds-truncate slds-text-heading--label" [title]="attachment.name">{{attachment.name}}</h3><div class="slds-tile__detail"><p class="slds-truncate slds-text-body_small" title="Attachment Type">{{attachment.contentType}}</p></div></div></article>'}),__metadata("design:paramtypes",[GroupwareService])],e)}();exports.GroupwarePaneAttachment=GroupwarePaneAttachment;var GroupwareReadPane=function(){function e(e,t){this.backend=e,this.groupware=t,this.activetab="beans",this.groupware.getEmailFromSpice()}return e.prototype.open=function(e){this.activetab=e},Object.defineProperty(e.prototype,"isArchived",{get:function(){return 0!==this.groupware.emailId.length},enumerable:!0,configurable:!0}),e=__decorate([core_1.Component({selector:"groupware-read-pane",template:'<groupware-read-pane-header></groupware-read-pane-header><div class="slds-tabs_default"><ul class="slds-tabs_default__nav" role="tablist"><li class="slds-tabs_default__item" title="Search" role="presentation" [ngClass]="{\'slds-is-active\': activetab==\'beans\'}"><a class="slds-tabs_default__link" href="javascript:void(0);" role="tab" (click)="open(\'beans\')"><system-utility-icon icon="user" size="x-small"></system-utility-icon></a></li><li class="slds-tabs_default__item" title="Search" role="presentation" [ngClass]="{\'slds-is-active\': activetab==\'search\'}"><a class="slds-tabs_default__link" href="javascript:void(0);" role="tab" (click)="open(\'search\')"><system-utility-icon icon="search" size="x-small"></system-utility-icon></a></li><li class="slds-tabs_default__item" title="Attachments" role="presentation" [ngClass]="{\'slds-is-active\': activetab==\'attachments\'}"><a class="slds-tabs_default__link" href="javascript:void(0);" role="tab" (click)="open(\'attachments\')"><system-utility-icon icon="attach" size="x-small"></system-utility-icon></a></li><li class="slds-tabs_default__item" title="Attachments" role="presentation" [ngClass]="{\'slds-is-active\': activetab==\'linked\'}"><a class="slds-tabs_default__link" href="javascript:void(0);" role="tab" (click)="open(\'linked\')"><system-utility-icon icon="linked" size="x-small"></system-utility-icon></a></li></ul><div class="slds-scrollable"><groupware-read-pane-beans [ngClass]="{\'slds-hide\': activetab!=\'beans\'}"></groupware-read-pane-beans><groupware-read-pane-search [ngClass]="{\'slds-hide\': activetab!=\'search\'}"></groupware-read-pane-search><groupware-read-pane-attachments [ngClass]="{\'slds-hide\': activetab!=\'attachments\'}"></groupware-read-pane-attachments><groupware-read-pane-linked [ngClass]="{\'slds-hide\': activetab!=\'linked\'}"></groupware-read-pane-linked></div></div>'}),__metadata("design:paramtypes",[services_1.backend,GroupwareService])],e)}();exports.GroupwareReadPane=GroupwareReadPane;var GroupwareReadPaneHeader=function(){function e(e,t){this.language=e,this.groupware=t}return e.prototype.archive=function(){this.groupware.archiveEmail().subscribe(function(e){},function(e){},function(){})},Object.defineProperty(e.prototype,"canArchive",{get:function(){return 0<this.groupware.archiveto.length},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"isArchived",{get:function(){return 0!==this.groupware.emailId.length},enumerable:!0,configurable:!0}),e=__decorate([core_1.Component({selector:"groupware-read-pane-header",template:'<div class="slds-page-header slds-page-header_record-home"><div class="slds-page-header__row"><div class="slds-page-header__col-title"><div class="slds-media"><system-icon module="Emails"></system-icon><div class="slds-media__body"><div class="slds-page-header__name"><div class="slds-page-header__name-title"><h1><span>{{language.getModuleName(\'Emails\')}}</span> <span *ngIf="isArchived" class="slds-page-header__title slds-truncate slds-text-heading--small">{{language.getLabel(\'LBL_ARCHIVED\')}}</span> <span *ngIf="!isArchived" class="slds-page-header__title slds-truncate slds-text-heading--small">{{language.getLabel(\'LBL_NOT_ARCHIVED\')}}</span></h1></div></div></div></div></div><div class="slds-page-header__col-actions"><div class="slds-page-header__controls"><div class="slds-page-header__control"><ul class="slds-button-group-list"><li><button class="slds-button slds-button_neutral" [disabled]="!canArchive" (click)="archive()">{{language.getLabel(\'LBL_ARCHIVE\')}}</button></li></ul></div></div></div></div></div>'}),__metadata("design:paramtypes",[services_1.language,GroupwareService])],e)}();exports.GroupwareReadPaneHeader=GroupwareReadPaneHeader;var GroupwareReadPaneAttachments=function(){function e(e,t,a){this.groupware=e,this.changeDetectorRef=t,this.language=a,this.loadAttachments()}return Object.defineProperty(e.prototype,"attachments",{get:function(){return this.groupware.outlookAttachments.attachments},enumerable:!0,configurable:!0}),e.prototype.loadAttachments=function(){var t=this;this.groupware.getAttachments().subscribe(function(e){t.changeDetectorRef.detectChanges()},function(e){console.log(e)})},e=__decorate([core_1.Component({selector:"groupware-read-pane-attachments",template:'<div *ngIf="attachments.length > 0" class="slds-p-around--x-small"><groupware-pane-attachment *ngFor="let attachment of attachments" [attachment]="attachment"></groupware-pane-attachment></div><div *ngIf="attachments.length == 0" class="slds-p-around--medium slds-align--absolute-center">{{language.getLabel(\'MSG_NO_ATTACHMENTS_FOUND\')}}</div>'}),__metadata("design:paramtypes",[GroupwareService,core_1.ChangeDetectorRef,services_1.language])],e)}();exports.GroupwareReadPaneAttachments=GroupwareReadPaneAttachments;var GroupwareReadPaneBeans=function(){function e(e,t){this.groupware=e,this.language=t,this.groupware.loadLinkedBeans()}return Object.defineProperty(e.prototype,"beans",{get:function(){return this.groupware.relatedBeans},enumerable:!0,configurable:!0}),e=__decorate([core_1.Component({selector:"groupware-read-pane-beans",template:'<div *ngIf="beans.length > 0" class="slds-p-around--x-small"><groupware-pane-bean *ngFor="let bean of beans" [bean]="bean" [modelProvider]="{module: bean.module, id: bean.id, data: bean.data}"></groupware-pane-bean></div><div *ngIf="beans.length == 0" class="slds-p-around--medium slds-align--absolute-center">{{language.getLabel(\'MSG_NO_RECORDS_FOUND\')}}</div>'}),__metadata("design:paramtypes",[GroupwareService,services_1.language])],e)}();exports.GroupwareReadPaneBeans=GroupwareReadPaneBeans;var GroupwareReadPaneLinked=function(){function e(e,t){this.groupware=e,this.language=t}return Object.defineProperty(e.prototype,"beans",{get:function(){return this.groupware.archiveto},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"attachments",{get:function(){return this.groupware.archiveattachments},enumerable:!0,configurable:!0}),e=__decorate([core_1.Component({selector:"groupware-read-pane-linked",template:'<div *ngIf="beans.length > 0"><div class="slds-p-around--x-small"><h2 class="slds-text-heading--small slds-p-vertical--xx-small">link to:</h2><groupware-pane-bean *ngFor="let bean of beans" [bean]="bean" [modelProvider]="{module: bean.module, id: bean.id, data: bean.data}"></groupware-pane-bean></div><div *ngIf="attachments.length > 0" class="slds-p-around--x-small"><h2 class="slds-text-heading--small slds-p-vertical--xx-small">attachments:</h2><groupware-pane-attachment *ngFor="let attachment of attachments" [attachment]="attachment"></groupware-pane-attachment></div></div><div *ngIf="beans.length == 0" class="slds-p-around--medium slds-align--absolute-center">{{language.getLabel(\'MSG_NO_ATTACHMENTS_FOUND\')}}</div>'}),__metadata("design:paramtypes",[GroupwareService,services_1.language])],e)}();exports.GroupwareReadPaneLinked=GroupwareReadPaneLinked;var GroupwareReadPaneSearch=function(){function e(e){this.backend=e,this.searchTerm="",this.beans=[],this.searchResults=[],this.searching=!1,this.searchTimeOut=void 0}return e.prototype.search=function(e){var t=this;switch(e.key){case"ArrowDown":case"ArrowUp":break;case"Enter":this.searchTerm.length&&(this.searchTimeOut&&window.clearTimeout(this.searchTimeOut),this.searchSpice());break;default:this.searchTimeOut&&window.clearTimeout(this.searchTimeOut),this.searchTimeOut=window.setTimeout(function(){return t.searchSpice()},1e3)}},e.prototype.searchSpice=function(){var t=this;this.searching=!0;var e={aggregates:{},modules:"",owner:!(this.searchResults=[]),records:10,searchterm:this.searchTerm,sort:{}};this.backend.postRequest("module/Emails/groupware/search",{},e).subscribe(function(e){t.searchResults=e,t.searching=!1},function(e){t.searching=!1})},e=__decorate([core_1.Component({selector:"groupware-read-pane-search",template:'<div class="slds-p-around--x-small"><div class="slds-form-element"><div class="slds-form-element__control"><input type="text" id="search-term" placeholder="Please enter your search term" class="slds-input" [(ngModel)]="this.searchTerm" (keyup)="search($event)"></div></div><div class="slds-p-vertical--small" *ngIf="!searching && searchResults.length > 0"><groupware-pane-bean *ngFor="let bean of searchResults" [bean]="bean" [modelProvider]="{module: bean.module, id: bean.id, data: bean.data}"></groupware-pane-bean></div><div *ngIf="searching" class="slds-size--1-of-1 slds-align--absolute-center" style="height: 80%"><h2 class="slds-text-heading--medium">.. Searching ..</h2></div></div>'}),__metadata("design:paramtypes",[services_1.backend])],e)}();exports.GroupwareReadPaneSearch=GroupwareReadPaneSearch;var GroupwareDetailPane=function(){function GroupwareDetailPane(e,t,a,s){this.groupware=e,this.model=t,this.metadata=a,this.language=s,this.loading=!1,this.componentconfig={}}return GroupwareDetailPane.prototype.ngOnInit=function(){var t=this;this.loading=!0,this.groupware.loadLinkedBeans().subscribe(function(e){1==e.length&&t.loadRecord(e[0].module,e[0].id),t.loading=!1},function(e){console.log(e),t.loading=!1})},GroupwareDetailPane.prototype.selectBean=function(e){this.loadRecord(e.module,e.id)},GroupwareDetailPane.prototype.loadRecord=function(e,t){this.model.module=e,this.model.id=t,this.model.getData(!0),this.componentconfig=this.metadata.getComponentConfig("GroupwareDetailPane",e)},Object.defineProperty(GroupwareDetailPane.prototype,"beans",{get:function(){return this.groupware.relatedBeans},enumerable:!0,configurable:!0}),GroupwareDetailPane=__decorate([core_1.Component({selector:"groupware-detail-pane",template:'<ng-container *ngIf="!model.id; else modeldetails"><div class="slds-page-header slds-page-header_record-home"><div class="slds-page-header__row"><div class="slds-page-header__col-title"><div class="slds-media"><system-icon module="Emails"></system-icon><div class="slds-media__body"><div class="slds-page-header__name"><div class="slds-page-header__name-title"><h1><span>{{language.getModuleName(\'Emails\')}}</span> <span *ngIf="loading" class="slds-page-header__title slds-truncate slds-text-heading--small">{{language.getLabel(\'LBL_SEARCHING\')}}</span> <span *ngIf="!loading" class="slds-page-header__title slds-truncate slds-text-heading--small">{{language.getLabel(\'LBL_SELECT\')}}</span></h1></div></div></div></div></div></div></div><div *ngIf="!loading" class="slds-p-around--x-small"><groupware-detail-pane-bean *ngFor="let bean of beans" [bean]="bean" [modelProvider]="{module: bean.module, id: bean.id, data: bean.data}" (selected)="selectBean($event)"></groupware-detail-pane-bean></div><div *ngIf="beans.length == 0 && !loading">{{language.getLabel(\'MSG_NO_RECORDS_FOUND\')}}</div><div *ngIf="loading" class="slds-p-around--small slds-align--absolute-center"><system-spinner></system-spinner></div></ng-container><ng-template #modeldetails><system-componentset [componentset]="componentconfig.header"></system-componentset><div class="slds-theme--default" tobottom><system-componentset [componentset]="componentconfig.main"></system-componentset></div></ng-template>',providers:[services_1.model]}),__metadata("design:paramtypes",[GroupwareService,services_1.model,services_1.metadata,services_1.language])],GroupwareDetailPane)}();exports.GroupwareDetailPane=GroupwareDetailPane;var GroupwareDetailPaneBean=function(){function e(e,t,a,s,i,n){this.groupware=e,this.language=t,this.metadata=a,this.model=s,this.router=i,this.view=n,this.selected=new core_1.EventEmitter,this.view.displayLabels=!1}return e.prototype.ngOnInit=function(){var e=this.metadata.getComponentConfig("GlobalHeaderSearchResultsItem",this.model.module);e&&e.mainfieldset&&(this.mainfieldsetfields=this.metadata.getFieldSetItems(e.mainfieldset)),e&&e.subfieldset&&(this.subfieldsetfields=this.metadata.getFieldSetItems(e.subfieldset))},e.prototype.onClick=function(e){this.selected.emit({module:this.bean.module,id:this.bean.id})},__decorate([core_1.Input(),__metadata("design:type",Object)],e.prototype,"bean",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],e.prototype,"selected",void 0),e=__decorate([core_1.Component({selector:"groupware-detail-pane-bean",template:'<article class="slds-tile slds-media slds-p-vertical--xx-small slds-has-divider--bottom" (click)="onClick($event)"><div class="slds-p-vertical--xx-small"><system-icon [module]="model.module" size="small"></system-icon></div><div class="slds-media__body"><div class="slds-grid slds-has-flexi-truncate"><span *ngIf="!mainfieldsetfields">{{model.data.summary_text}}</span><ul *ngIf="mainfieldsetfields" class="slds-list_horizontal slds-has-dividers_right slds-truncate"><ng-container *ngFor="let fieldsetitem of mainfieldsetfields"><li *ngIf="model.getField(fieldsetitem.field)" class="slds-item"><field-container [field]="fieldsetitem.field" [fieldconfig]="fieldsetitem.fieldconfig" fielddisplayclass="slds-truncate"></field-container></li></ng-container></ul></div><div class="slds-truncate slds-text-body_small" title="Bean Module"><ul class="slds-list_horizontal slds-has-dividers_right slds-truncate"><li class="slds-item">{{language.getModuleName(model.module, true)}}</li><ng-container *ngFor="let fieldsetitem of subfieldsetfields"><li *ngIf="model.getField(fieldsetitem.field)" class="slds-item"><field-container [field]="fieldsetitem.field" [fieldconfig]="fieldsetitem.fieldconfig" fielddisplayclass="slds-truncate"></field-container></li></ng-container></ul></div></div></article>',providers:[services_1.view]}),__metadata("design:paramtypes",[GroupwareService,services_1.language,services_1.metadata,services_1.model,router_1.Router,services_1.view])],e)}();exports.GroupwareDetailPaneBean=GroupwareDetailPaneBean;var ModuleGroupware=function(){function ModuleGroupware(){}return ModuleGroupware=__decorate([core_1.NgModule({imports:[platform_browser_1.BrowserModule,http_1.HttpClientModule,forms_1.FormsModule,systemcomponents_1.SystemComponents,objectcomponents_1.ObjectComponents,directives_1.DirectivesModule,objectfields_1.ObjectFields,router_1.RouterModule.forRoot([{path:"mailitem",component:GroupwareReadPane,canActivate:[services_1.loginCheck]},{path:"details",component:GroupwareDetailPane,canActivate:[services_1.loginCheck]}])],declarations:[GroupwarePaneBean,GroupwarePaneAttachment,GroupwareReadPane,GroupwareReadPaneHeader,GroupwareReadPaneAttachments,GroupwareReadPaneBeans,GroupwareReadPaneLinked,GroupwareReadPaneSearch,GroupwareDetailPane,GroupwareDetailPaneBean]})],ModuleGroupware)}();exports.ModuleGroupware=ModuleGroupware;