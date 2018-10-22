/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {metadata} from '../../../services/metadata.service';
@Component({
    // selector: 'object-home',
    templateUrl: './src/modules/home/templates/home.html',
})
export class Home {
    componentconfig: any = {};

    constructor(private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef, private metadata: metadata) {
        // set theenavigation paradigm
        this.navigation.setActiveModule('Home');

        //get config
        let componentconfig = this.metadata.getComponentConfig('Home', 'Home');
        if (componentconfig && componentconfig.HomeAssistant)
            this.componentconfig = componentconfig.HomeAssistant;

    }

    getHomeStyle(){
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        return {
             'height': 'calc(100vh - ' + (rect.top ) + 'px)',
            'overflow': 'auto'
        }
    }

    displayHomeAssistant(){
        if(this.componentconfig.HomeAssistant !== undefined)
            return this.componentconfig.HomeAssistant;
        return true;
    }
}