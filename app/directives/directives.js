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
"use strict";var __decorate=this&&this.__decorate||function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;0<=a;a--)(o=e[a])&&(s=(n<3?o(s):3<n?o(t,r,s):o(t,r))||s);return 3<n&&s&&Object.defineProperty(t,r,s),s},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__param=this&&this.__param||function(r,i){return function(e,t){i(e,t,r)}};Object.defineProperty(exports,"__esModule",{value:!0});var common_1=require("@angular/common"),core_1=require("@angular/core"),services_1=require("../services/services"),router_1=require("@angular/router"),ModelPopOverDirective=function(){function e(e,t,r,i,o){this.metadata=e,this.footer=t,this.model=r,this.elementRef=i,this.router=o,this.enablelink=!0,this.modelPopOver=!0,this.popoverCmp=null,this.self=null,this.showPopover=!1,this.showPopoverTimeout={},this.hidePopoverTimeout={}}return e.prototype.onMouseOver=function(){var e=this;!1!==this.modelPopOver&&(this.showPopoverTimeout=window.setTimeout(function(){return e.renderPopover()},500))},e.prototype.onMouseOut=function(){this.showPopoverTimeout&&window.clearTimeout(this.showPopoverTimeout),this.popoverCmp&&this.popoverCmp.closePopover()},e.prototype.goRelated=function(){if(!1===this.modelPopOver||!this.enablelink)return!1;this.showPopoverTimeout&&window.clearTimeout(this.showPopoverTimeout),this.router.navigate(["/module/"+this.module+"/"+this.id])},e.prototype.renderPopover=function(){var t=this;this.metadata.addComponent("ObjectModelPopover",this.footer.footercontainer).subscribe(function(e){e.instance.popovermodule=t.module,e.instance.popoverid=t.id,e.instance.parentElementRef=t.elementRef,t.popoverCmp=e.instance})},e.prototype.ngOnInit=function(){!this.module&&this.model&&(this.module=this.model.module),!this.id&&this.model&&(this.id=this.model.id)},e.prototype.ngOnDestroy=function(){this.showPopoverTimeout&&window.clearTimeout(this.showPopoverTimeout),this.popoverCmp&&this.popoverCmp.closePopover(!0)},__decorate([core_1.Input(),__metadata("design:type",String)],e.prototype,"module",void 0),__decorate([core_1.Input(),__metadata("design:type",String)],e.prototype,"id",void 0),__decorate([core_1.Input(),__metadata("design:type",Boolean)],e.prototype,"enablelink",void 0),__decorate([core_1.Input(),__metadata("design:type",Boolean)],e.prototype,"modelPopOver",void 0),__decorate([core_1.HostListener("mouseenter"),__metadata("design:type",Function),__metadata("design:paramtypes",[]),__metadata("design:returntype",void 0)],e.prototype,"onMouseOver",null),__decorate([core_1.HostListener("mouseleave"),__metadata("design:type",Function),__metadata("design:paramtypes",[]),__metadata("design:returntype",void 0)],e.prototype,"onMouseOut",null),__decorate([core_1.HostListener("click"),__metadata("design:type",Function),__metadata("design:paramtypes",[]),__metadata("design:returntype",void 0)],e.prototype,"goRelated",null),e=__decorate([core_1.Directive({selector:"[modelPopOver]",host:{"[class.slds-text-link_faux]":"enablelink"}}),__param(2,core_1.Optional()),__metadata("design:paramtypes",[services_1.metadata,services_1.footer,services_1.model,core_1.ElementRef,router_1.Router])],e)}();exports.ModelPopOverDirective=ModelPopOverDirective;var SystemPopOverDirective=function(){function e(e,t,r){this.metadata=e,this.footer=t,this.elementRef=r,this.popoverCmp=null,this.showPopoverTimeout={},this._popoverSettings={injector:{},componentset:{},component:""}}return Object.defineProperty(e.prototype,"popoverSettings",{set:function(e){this._popoverSettings.injector=e.injector,this._popoverSettings.componentset=e.componentset,this._popoverSettings.component=e.component},enumerable:!0,configurable:!0}),e.prototype.onMouseOver=function(){var e=this;this.showPopoverTimeout=window.setTimeout(function(){return e.renderPopover()},500)},e.prototype.onMouseOut=function(){this.showPopoverTimeout&&window.clearTimeout(this.showPopoverTimeout),this.popoverCmp&&this.popoverCmp.closePopover()},e.prototype.renderPopover=function(){var t=this;this.metadata.addComponent("SystemPopover",this.footer.footercontainer,this._popoverSettings.injector).subscribe(function(e){e.instance.parentElementRef=t.elementRef,e.componentset=t._popoverSettings.componentset,e.component=t._popoverSettings.component,t.popoverCmp=e.instance})},e.prototype.ngOnDestroy=function(){this.popoverCmp&&this.popoverCmp.closePopover(!0)},__decorate([core_1.Input("systemPopOver"),__metadata("design:type",Object),__metadata("design:paramtypes",[Object])],e.prototype,"popoverSettings",null),__decorate([core_1.HostListener("mouseenter"),__metadata("design:type",Function),__metadata("design:paramtypes",[]),__metadata("design:returntype",void 0)],e.prototype,"onMouseOver",null),__decorate([core_1.HostListener("mouseleave"),__metadata("design:type",Function),__metadata("design:paramtypes",[]),__metadata("design:returntype",void 0)],e.prototype,"onMouseOut",null),e=__decorate([core_1.Directive({selector:"[systemPopOver]"}),__metadata("design:paramtypes",[services_1.metadata,services_1.footer,core_1.ElementRef])],e)}();exports.SystemPopOverDirective=SystemPopOverDirective;var SpiceUIToBottomDirective=function(){function e(e){e.nativeElement.style.backgroundColor="yellow"}return e=__decorate([core_1.Directive({selector:"[spiceuitobottom]"}),__metadata("design:paramtypes",[core_1.ElementRef])],e)}();exports.SpiceUIToBottomDirective=SpiceUIToBottomDirective;var ModelProviderDirective=function(){function e(e){this.model=e,this.model.isLoading=!0}return Object.defineProperty(e.prototype,"provided_model",{set:function(e){this.model.module=e.module,e.id?this.model.id=e.id:e.data&&(this.model.id=e.data.id),e.data?(this.model.data=e.data,this.model.isLoading=!1,this.model.data$.next(this.model.data),e.data.acl&&this.model.initializeFieldsStati()):this.model.id&&this.model.getData()},enumerable:!0,configurable:!0}),__decorate([core_1.Input("modelProvider"),__metadata("design:type",Object),__metadata("design:paramtypes",[Object])],e.prototype,"provided_model",null),e=__decorate([core_1.Directive({selector:"[modelProvider]",providers:[services_1.model]}),__metadata("design:paramtypes",[services_1.model])],e)}();exports.ModelProviderDirective=ModelProviderDirective;var LocalVariableDirective=function(){function e(e,t){this.vcRef=e,this.templateRef=t,this.context={}}return Object.defineProperty(e.prototype,"ngVar",{set:function(e){this.context.$implicit=this.context.ngVar=e,this.updateView()},enumerable:!0,configurable:!0}),e.prototype.updateView=function(){this.vcRef.clear(),this.vcRef.createEmbeddedView(this.templateRef,this.context)},__decorate([core_1.Input(),__metadata("design:type",Object),__metadata("design:paramtypes",[Object])],e.prototype,"ngVar",null),e=__decorate([core_1.Directive({selector:"[ngVar]"}),__metadata("design:paramtypes",[core_1.ViewContainerRef,core_1.TemplateRef])],e)}();exports.LocalVariableDirective=LocalVariableDirective;var SpiceUIAutofocusDirective=function(){function e(e){this.elementRef=e}return e.prototype.ngAfterViewInit=function(){var e=this;setTimeout(function(){e.elementRef.nativeElement.tabIndex||(e.elementRef.nativeElement.tabIndex="-1"),e.elementRef.nativeElement.focus()})},e=__decorate([core_1.Directive({selector:"[spiceuiautofocus]"}),__metadata("design:paramtypes",[core_1.ElementRef])],e)}();exports.SpiceUIAutofocusDirective=SpiceUIAutofocusDirective;var FirstUpperCasePipe=function(){function e(){}return e.prototype.transform=function(e,t){return null===e?null:e.charAt(0).toUpperCase()+e.slice(1)},e=__decorate([core_1.Pipe({name:"firstuppercase"})],e)}();exports.FirstUpperCasePipe=FirstUpperCasePipe;var DropdownTriggerDirective=function(){function e(e,t){this.renderer=e,this.elementRef=t,this.dropdowntriggerdisabled=!1,this.dropDownOpen=!1}return e.prototype.openDropdown=function(e){var t=this;this.dropdowntriggerdisabled||(this.dropDownOpen=!this.dropDownOpen,this.dropDownOpen?(e.preventDefault(),this.clickListener=this.renderer.listen("document","click",function(e){return t.onClick(e)})):this.clickListener())},e.prototype.onClick=function(e){this.elementRef.nativeElement.contains(e.target)||(this.dropDownOpen=!1,this.clickListener())},e.prototype.ngOnDestroy=function(){this.clickListener&&this.clickListener()},__decorate([core_1.Input("dropdowntrigger"),__metadata("design:type",Boolean)],e.prototype,"dropdowntriggerdisabled",void 0),__decorate([core_1.HostBinding("class.slds-is-open"),__metadata("design:type",Boolean)],e.prototype,"dropDownOpen",void 0),__decorate([core_1.HostListener("click",["$event"]),__metadata("design:type",Function),__metadata("design:paramtypes",[Object]),__metadata("design:returntype",void 0)],e.prototype,"openDropdown",null),e=__decorate([core_1.Directive({selector:"[dropdowntrigger]"}),__metadata("design:paramtypes",[core_1.Renderer2,core_1.ElementRef])],e)}();exports.DropdownTriggerDirective=DropdownTriggerDirective;var ToBottomDirective=function(){function e(e,t){this.element=e,this.renderer=t,this.elementClass=!0}return e.prototype.ngDoCheck=function(){var e=this.element.nativeElement.getBoundingClientRect();this.renderer.setStyle(this.element.nativeElement,"height",window.innerHeight-e.top-parseInt(getComputedStyle(this.element.nativeElement).marginBottom,10)-parseInt(getComputedStyle(this.element.nativeElement).paddingBottom,10)+"px")},__decorate([core_1.HostBinding("class.slds-scrollable--y"),__metadata("design:type",Object)],e.prototype,"elementClass",void 0),e=__decorate([core_1.Directive({selector:"[tobottom]"}),__metadata("design:paramtypes",[core_1.ElementRef,core_1.Renderer2])],e)}();exports.ToBottomDirective=ToBottomDirective;var TrimInputDirective=function(){function e(){}return e.prototype.getCaret=function(e){return{start:e.selectionStart,end:e.selectionEnd}},e.prototype.setCaret=function(e,t,r){e.selectionStart=t,e.selectionEnd=r,e.focus()},e.prototype.dispatchEvent=function(e,t){var r=document.createEvent("Event");r.initEvent(t,!1,!1),e.dispatchEvent(r)},e.prototype.trimValue=function(e,t){e.value=t.trim(),this.dispatchEvent(e,"input")},e.prototype.onBlur=function(e,t){this.trim&&"blur"!==this.trim||"function"!=typeof t.trim||t.trim()===t||(this.trimValue(e,t),this.dispatchEvent(e,"blur"))},e.prototype.onInput=function(e,t){if(!this.trim&&"function"==typeof t.trim&&t.trim()!==t){var r=this.getCaret(e),i=r.start,o=r.end;" "===t[0]&&1===i&&1===o&&(o=i=0),this.trimValue(e,t),this.setCaret(e,i,o)}},__decorate([core_1.Input(),__metadata("design:type",String)],e.prototype,"trim",void 0),__decorate([core_1.HostListener("blur",["$event.target","$event.target.value"]),__metadata("design:type",Function),__metadata("design:paramtypes",[Object,String]),__metadata("design:returntype",void 0)],e.prototype,"onBlur",null),__decorate([core_1.HostListener("input",["$event.target","$event.target.value"]),__metadata("design:type",Function),__metadata("design:paramtypes",[Object,String]),__metadata("design:returntype",void 0)],e.prototype,"onInput",null),e=__decorate([core_1.Directive({selector:"input[trim]"})],e)}();exports.TrimInputDirective=TrimInputDirective;var ViewProviderDirective=function(){function e(e,t,r){this.renderer=e,this.elementRef=t,this.view=r}return Object.defineProperty(e.prototype,"viewSettings",{set:function(e){e.editable&&(this.view.isEditable=!0),!1===e.displayLabels&&(this.view.displayLabels=!1)},enumerable:!0,configurable:!0}),e.prototype.ngAfterViewInit=function(){var e=this;this.setviewSize(),this.resizeHandler=this.renderer.listen("window","resize",function(){return e.setviewSize()})},e.prototype.ngOnDestroy=function(){this.resizeHandler&&this.resizeHandler()},e.prototype.setviewSize=function(){this.elementRef.nativeElement.getBoundingClientRect().width<500?this.view.size="small":this.view.size="regular"},__decorate([core_1.Input("viewprovider"),__metadata("design:type",Object),__metadata("design:paramtypes",[Object])],e.prototype,"viewSettings",null),e=__decorate([core_1.Directive({selector:"[viewprovider]",providers:[services_1.view]}),__metadata("design:paramtypes",[core_1.Renderer2,core_1.ElementRef,services_1.view])],e)}();exports.ViewProviderDirective=ViewProviderDirective;var SpiceDropFileArea=function(){function e(e,t,r){this.renderer=e,this.elementRef=t,this.language=r,this.filesDrop=new core_1.EventEmitter,this.dragDepth=0,this.defineOverlayElement(),this.listenWindowEvents()}return e.prototype.ngOnChanges=function(){this.renderer.setProperty(this.overlayElement,"textContent",this.dropMessage)},e.prototype.ngOnDestroy=function(){this.dragStartListener(),this.dragEnterListener(),this.dragOverListener(),this.dragLeaveListener(),this.dragEndListener(),this.dragDropListener(),this.dragGlobalDropListener()},e.prototype.defineOverlayElement=function(){this.overlayElement=this.renderer.createElement("div"),this.renderer.setStyle(this.overlayElement,"height","100%"),this.renderer.setStyle(this.overlayElement,"width","100%"),this.renderer.setStyle(this.overlayElement,"top","0"),this.renderer.setStyle(this.overlayElement,"left","0"),this.renderer.setStyle(this.overlayElement,"position","absolute"),this.renderer.setStyle(this.overlayElement,"background","rgba(135,135,135,0.8)"),this.renderer.setStyle(this.overlayElement,"color","#fff"),this.renderer.setStyle(this.overlayElement,"border","dashed 2px #fff"),this.renderer.setProperty(this.overlayElement,"textContent",this.language.getLabel("LBL_DROP_FILES")),this.renderer.addClass(this.overlayElement,"slds-align--absolute-center"),this.renderer.addClass(this.elementRef.nativeElement,"slds-is-relative")},e.prototype.listenWindowEvents=function(){var t=this;this.dragStartListener=this.renderer.listen("window","dragstart",function(){t.dragDepth=-10}),this.dragEnterListener=this.renderer.listen("window","dragenter",function(){t.dragDepth++,1==t.dragDepth&&t.renderer.appendChild(t.elementRef.nativeElement,t.overlayElement)}),this.dragOverListener=this.renderer.listen(this.overlayElement,"dragover",function(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer.dropEffect="copy"}),this.dragLeaveListener=this.renderer.listen("window","dragleave",function(){t.dragDepth--,0==t.dragDepth&&t.renderer.removeChild(t.elementRef.nativeElement,t.overlayElement)}),this.dragEndListener=this.renderer.listen("window","dragend",function(){t.dragDepth=0,t.renderer.removeChild(t.elementRef.nativeElement,t.overlayElement)}),this.dragDropListener=this.renderer.listen(this.overlayElement,"drop",function(e){(t.dragDepth=0)<e.dataTransfer.files.length&&t.filesDrop.emit(e.dataTransfer.files),t.renderer.removeChild(t.elementRef.nativeElement,t.overlayElement)}),this.dragGlobalDropListener=this.renderer.listen("window","drop",function(e){t.dragDepth=0,t.renderer.removeChild(t.elementRef.nativeElement,t.overlayElement)})},e.prototype.hasOneItemsFile=function(e){for(var t=0,r=e;t<r.length;t++){if("file"==r[t].kind)return!0}return!1},__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],e.prototype,"filesDrop",void 0),__decorate([core_1.Input(),__metadata("design:type",String)],e.prototype,"dropMessage",void 0),e=__decorate([core_1.Directive({selector:"[spiceDropFileArea]"}),__metadata("design:paramtypes",[core_1.Renderer2,core_1.ElementRef,services_1.language])],e)}();exports.SpiceDropFileArea=SpiceDropFileArea;var SpiceOverlayLoadingSpinner=function(){function e(e,t){this.renderer=e,this.elementRef=t,this.defineOverlayElement()}return Object.defineProperty(e.prototype,"isLoading",{set:function(e){e?this.renderer.appendChild(this.elementRef.nativeElement,this.overlayElement):this.renderer.removeChild(this.elementRef.nativeElement,this.overlayElement)},enumerable:!0,configurable:!0}),e.prototype.defineOverlayElement=function(){this.overlayElement=this.renderer.createElement("div"),this.renderer.setStyle(this.overlayElement,"position","absolute"),this.renderer.addClass(this.overlayElement,"slds-align--absolute-center"),this.renderer.setStyle(this.overlayElement,"height","100%"),this.renderer.setStyle(this.overlayElement,"width","100%"),this.renderer.setStyle(this.overlayElement,"z-index","99999"),this.renderer.setStyle(this.overlayElement,"top","0"),this.renderer.setStyle(this.overlayElement,"left","0");var e=this.renderer.createElement("div");this.renderer.setProperty(this.overlayElement,"innerHTML",'\n            <div style="border-radius: 50%; box-shadow: 0 0 5px 0 #555; padding:.75rem; background-color:#fff; color:#080707">\n                <div class="cssload-container">\n                    <div class="cssload-double-torus"></div>\n                </div>\n            </div>\n        '),this.renderer.appendChild(this.elementRef.nativeElement,e),this.renderer.addClass(this.elementRef.nativeElement,"slds-is-relative")},__decorate([core_1.Input("isLoading"),__metadata("design:type",Object),__metadata("design:paramtypes",[Object])],e.prototype,"isLoading",null),e=__decorate([core_1.Directive({selector:"[spiceOverlayLoadingSpinner]"}),__metadata("design:paramtypes",[core_1.Renderer2,core_1.ElementRef])],e)}();exports.SpiceOverlayLoadingSpinner=SpiceOverlayLoadingSpinner;var DirectivesModule=function(){function e(e){this.vms=e,this.version="1.0",this.build_date="2019-12-03",this.vms.registerModule(this)}return e=__decorate([core_1.NgModule({imports:[common_1.CommonModule],declarations:[ModelPopOverDirective,SystemPopOverDirective,SpiceUIToBottomDirective,ModelProviderDirective,LocalVariableDirective,SpiceUIAutofocusDirective,FirstUpperCasePipe,DropdownTriggerDirective,ToBottomDirective,TrimInputDirective,ViewProviderDirective,SpiceDropFileArea,SpiceOverlayLoadingSpinner],exports:[ModelPopOverDirective,SystemPopOverDirective,SpiceUIToBottomDirective,ModelProviderDirective,LocalVariableDirective,SpiceUIAutofocusDirective,FirstUpperCasePipe,DropdownTriggerDirective,ToBottomDirective,TrimInputDirective,ViewProviderDirective,SpiceDropFileArea,SpiceOverlayLoadingSpinner]}),__metadata("design:paramtypes",[services_1.VersionManagerService])],e)}();exports.DirectivesModule=DirectivesModule;