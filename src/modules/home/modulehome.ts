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
 * @module ModuleHome
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {VersionManagerService} from '../../services/versionmanager.service';


import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";
import {ModuleActivities} from "../../modules/activities/moduleactivities";

import /*embed*/ {Home} from './components/home';
import /*embed*/ {HomeAssistant} from './components/homeassistant';
import /*embed*/ {HomeAssistantTile} from './components/homeassistanttile';
import /*embed*/ {HomeAssistantFilter} from './components/homeassistantfilter';
import /*embed*/ {HomeDashboard} from './components/homedashboard';
import /*embed*/ {HomeDashboardSetContainer} from './components/homedashboardsetcontainer';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        ModuleActivities
    ],
    declarations: [
        Home,
        HomeAssistant,
        HomeAssistantTile,
        HomeAssistantFilter,
        HomeDashboard,
        HomeDashboardSetContainer
    ]
})
export class ModuleHome {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
