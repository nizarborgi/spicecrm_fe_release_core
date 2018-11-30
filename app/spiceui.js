/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

"use strict";var __decorate=this&&this.__decorate||function(e,r,s,i){var c,o=arguments.length,t=o<3?r:null===i?i=Object.getOwnPropertyDescriptor(r,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)t=Reflect.decorate(e,r,s,i);else for(var v=e.length-1;0<=v;v--)(c=e[v])&&(t=(o<3?c(t):3<o?c(r,s,t):c(r,s))||t);return 3<o&&t&&Object.defineProperty(r,s,t),t},__metadata=this&&this.__metadata||function(e,r){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,r)};Object.defineProperty(exports,"__esModule",{value:!0});var platform_browser_dynamic_1=require("@angular/platform-browser-dynamic"),platform_browser_1=require("@angular/platform-browser"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),router_1=require("@angular/router"),http_1=require("@angular/common/http"),systemcomponents_1=require("./systemcomponents/systemcomponents"),globalcomponents_1=require("./globalcomponents/globalcomponents"),objectcomponents_1=require("./objectcomponents/objectcomponents"),common_1=require("@angular/common"),services_1=require("./services/services"),services_2=require("./services/services"),services_3=require("./services/services"),services_4=require("./services/services"),services_5=require("./services/services"),services_6=require("./services/services"),services_7=require("./services/services"),services_8=require("./services/services"),services_9=require("./services/services"),services_10=require("./services/services"),services_11=require("./services/services"),services_12=require("./services/services"),services_13=require("./services/services"),services_14=require("./services/services"),services_15=require("./services/services"),services_16=require("./services/services"),services_17=require("./services/services"),services_18=require("./services/services"),services_19=require("./services/services"),services_20=require("./services/services"),services_21=require("./services/services"),services_22=require("./services/services"),services_23=require("./services/services"),services_24=require("./services/services"),services_25=require("./services/services"),services_26=require("./services/services");moment.defaultFormat="YYYY-MM-DD HH:mm:ss";var SpiceUI=function(){function e(){}return e=__decorate([core_1.Component({selector:"spicecrm",template:'<global-header></global-header><div class="spiceContent"><router-outlet></router-outlet></div><global-footer></global-footer>'})],e)}();exports.SpiceUI=SpiceUI;var SpiceUIModule=function(){function e(e,r){this.metadata=e,this.vms=r,this.version="1.0",this.build_date="2018-11-30",this.vms.registerModule(this)}return e=__decorate([core_1.NgModule({imports:[platform_browser_1.BrowserModule,http_1.HttpClientModule,forms_1.FormsModule,systemcomponents_1.SystemComponents,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,router_1.RouterModule.forRoot([{path:"",redirectTo:"/module/Home",pathMatch:"full"}])],declarations:[SpiceUI],entryComponents:[],bootstrap:[SpiceUI],providers:[{provide:common_1.LocationStrategy,useClass:common_1.HashLocationStrategy},services_14.backend,services_12.broadcast,services_15.navigation,services_3.session,services_4.metadata,services_5.AppDataService,services_4.aclCheck,services_2.loginCheck,services_2.loginService,services_11.loader,services_1.configurationService,services_7.language,services_13.dockedComposer,services_10.fts,services_8.recent,core_1.SystemJsNgModuleLoader,services_16.modelutilities,services_17.toast,services_18.favorite,services_19.reminder,services_20.territories,services_21.currency,services_22.footer,services_9.userpreferences,services_23.cookie,services_6.MathExpressionCompilerService,services_24.assistant,services_25.VersionManagerService,services_26.modal,platform_browser_1.Title]}),__metadata("design:paramtypes",[services_4.metadata,services_25.VersionManagerService])],e)}();exports.SpiceUIModule=SpiceUIModule;var platform=platform_browser_dynamic_1.platformBrowserDynamic();platform.bootstrapModule(SpiceUIModule);