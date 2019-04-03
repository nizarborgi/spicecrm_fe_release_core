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
"use strict";var __decorate=this&&this.__decorate||function(e,t,o,i){var s,n=arguments.length,r=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,o,i);else for(var a=e.length-1;0<=a;a--)(s=e[a])&&(r=(n<3?s(r):3<n?s(t,o,r):s(t,o))||r);return 3<n&&r&&Object.defineProperty(t,o,r),r},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(exports,"__esModule",{value:!0});var common_1=require("@angular/common"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),services_1=require("../../services/services"),directives_1=require("../../directives/directives"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),SpiceMap=function(){function SpiceMap(e,t,o,i,s,n,r){this.zone=e,this.language=t,this.model=o,this.modelutilities=i,this.backend=s,this.router=n,this.metadata=r,this.componentconfig={},this.map={},this.mapBoundaries={},this.modelMarker={},this.surroundingFunction={},this.surroundingMarkers=[],this.surroundingObjects=[],this.listfields=[]}var e,t,o,i,s,n,r,a;return SpiceMap.prototype.getListFields=function(){return this.metadata.getFieldSetFields(this.componentconfig.fieldset)},SpiceMap.prototype.ngAfterViewInit=function(){var t=this;this.metadata.loadLibs("maps.googleapis").subscribe(function(e){t.renderMap()})},Object.defineProperty(SpiceMap.prototype,"latField",{get:function(){return this.componentconfig.key&&""!=this.componentconfig.key?this.componentconfig.key+"_address_latitude":"address_latitude"},enumerable:!0,configurable:!0}),Object.defineProperty(SpiceMap.prototype,"lngField",{get:function(){return this.componentconfig.key&&""!=this.componentconfig.key?this.componentconfig.key+"_address_longitude":"address_longitude"},enumerable:!0,configurable:!0}),Object.defineProperty(SpiceMap.prototype,"lat",{get:function(){return this.model.data[this.latField]},enumerable:!0,configurable:!0}),Object.defineProperty(SpiceMap.prototype,"lng",{get:function(){return this.model.data[this.lngField]},enumerable:!0,configurable:!0}),SpiceMap.prototype.renderMap=function(){var e=this,t={lat:48.2,lng:16.3};this.lng&&this.lat&&(t={lat:this.lat,lng:this.lng}),this.map=new google.maps.Map(this.mapelement.element.nativeElement,{center:t,scrollwheel:!0,zoom:14,minZoom:8}),this.lng&&this.lat&&(this.modelMarker=new google.maps.Marker({position:t,map:this.map,icon:"http://maps.google.com/mapfiles/ms/micons/red-dot.png",title:this.model.data.summary_text})),this.map.addListener("bounds_changed",function(){e.mapBoundaries=e.map.getBounds(),e.surroundingFunction&&window.clearTimeout(e.surroundingFunction),e.surroundingFunction=window.setTimeout(function(){return e.getSurrounding()},500)})},SpiceMap.prototype.reCenter=function(){this.map.setCenter(this.modelMarker.position)},SpiceMap.prototype.isApiLoaded=function(){return window.google&&window.google.maps},SpiceMap.prototype.getSurrounding=function(){for(var s=this,e=0,t=this.surroundingMarkers;e<t.length;e++){t[e].setMap(null)}this.surroundingMarkers=[];var o=this.mapBoundaries.getNorthEast(),i=this.mapBoundaries.getSouthWest(),n={join:"AND",conditions:[{field:"id",operator:"<>",value:this.model.id},{field:this.lngField,operator:"<",value:o.lng()},{field:this.latField,operator:"<",value:o.lat()},{field:this.lngField,operator:">",value:i.lng()},{field:this.latField,operator:">",value:i.lat()}]},r={searchfields:JSON.stringify(n),fields:JSON.stringify(["id","name",this.lngField,this.latField])};this.backend.getRequest("module/"+this.model.module,r).subscribe(function(e){for(var t in e.list){for(var o in e.list[t])e.list[t][o]=s.modelutilities.backend2spice(s.model.module,o,e.list[t][o]);var i=new google.maps.Marker({position:{lat:e.list[t][s.latField],lng:e.list[t][s.lngField]},map:s.map,title:e.list[t].summary_text,icon:"http://maps.google.com/mapfiles/ms/micons/green.png",sugarId:e.list[t].id,sugarModule:s.model.module});s.surroundingMarkers.push(i)}s.surroundingObjects=e.list,s.zone.run(function(){})})},SpiceMap.prototype.mouseOver=function(t){this.surroundingMarkers.some(function(e){if(e.sugarId===t)return e.setIcon("http://maps.google.com/mapfiles/ms/micons/yellow-dot.png"),!0})},SpiceMap.prototype.mouseOut=function(t){this.surroundingMarkers.some(function(e){if(e.sugarId===t)return e.setIcon("http://maps.google.com/mapfiles/ms/micons/green.png"),!0})},__decorate([ViewChild("mapelement",{read:ViewContainerRef}),__metadata("design:type","function"==typeof(e="undefined"!=typeof ViewContainerRef&&ViewContainerRef)?e:Object)],SpiceMap.prototype,"mapelement",void 0),SpiceMap=__decorate([Component({selector:"spice-map",template:'<article class="slds-card slds-card_boundary slds-m-bottom--medium"><div class="slds-card__header slds-grid"><header class="slds-media slds-media--center slds-has-flexi-truncate"><div class="slds-media__body slds-truncate"><h2><span class="slds-text-heading--small">{{language.getLabel(\'LBL_MAP_VIEW\')}} ({{surroundingObjects.length}})</span></h2></div></header><div class="slds-button-group" role="group"><button class="slds-button slds-button--neutral" (click)="reCenter()">{{language.getLabel(\'LBL_RECENTER\')}}</button></div></div><div class="slds-card__body slds-p-horizontal--small"><div #mapelement style="width: 100%; height: 400px; border-radius: 4px; overflow: hidden;"></div><div class="slds-p-top--small"><table class="slds-table slds-table--bordered slds-table--fixed-layout"><thead><tr class="slds-text-title--caps"><th *ngFor="let item of getListFields()" class="slds-is-sortable" scope="col"><a href="javascript:void(0);" class="slds-th__action slds-text-link--reset"><span class="slds-truncate">{{language.getFieldDisplayName(module, item.field, item.fieldconfig)}}</span></a></th><th class="slds-cell-shrink" scope="col"></th></tr></thead><tbody><tr object-related-list-item *ngFor="let surroundingObject of surroundingObjects" [module]="model.module" [listfields]="getListFields()" [listitem]="surroundingObject" class="slds-hint-parent" (mouseenter)="mouseOver(surroundingObject.id)" (mouseleave)="mouseOut(surroundingObject.id)"></tr></tbody></table></div></div></article>'}),__metadata("design:paramtypes",["function"==typeof(t="undefined"!=typeof NgZone&&NgZone)?t:Object,"function"==typeof(o="undefined"!=typeof language&&language)?o:Object,"function"==typeof(i="undefined"!=typeof model&&model)?i:Object,"function"==typeof(s="undefined"!=typeof modelutilities&&modelutilities)?s:Object,"function"==typeof(n="undefined"!=typeof backend&&backend)?n:Object,"function"==typeof(r="undefined"!=typeof Router&&Router)?r:Object,"function"==typeof(a="undefined"!=typeof metadata&&metadata)?a:Object])],SpiceMap)}();exports.SpiceMap=SpiceMap;var ModuleSpiceMap=function(){function ModuleSpiceMap(e){this.vms=e,this.version="1.0",this.build_date="2019-03-29",this.vms.registerModule(this)}return ModuleSpiceMap=__decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents,directives_1.DirectivesModule],declarations:[SpiceMap]}),__metadata("design:paramtypes",[services_1.VersionManagerService])],ModuleSpiceMap)}();exports.ModuleSpiceMap=ModuleSpiceMap;