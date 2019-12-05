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
 * @module ModuleGroupware
 */
import {Component, OnInit} from '@angular/core';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

/**
 * Outlook add-in detail pane showing a list of beans that use the email addresses found in the email.
 * In case there is just one such bean, the details of it will be shown.
 */
@Component({
    selector: 'groupware-detail-pane',
    templateUrl: './src/include/groupware/templates/groupwaredetailpane.html',
    providers: [model]
})
export class GroupwareDetailPane implements OnInit {

    /**
     * boolean indicator that the component is loading
     */
    private loading: boolean = false;

    /**
     * the componentset found and to be rendered to view the details
     */
    private componentset: string;

    private componentconfig: any = {};

    constructor(
        private groupware: GroupwareService,
        private model: model,
        private metadata: metadata,
        private language: language
    ) {}

    /**
     * triggers the loader and if one record is found opens that one
     */
    public ngOnInit(): void {
        this.loading = true;

        this.groupware.loadLinkedBeans().subscribe(
            (res) => {
                if (res.length == 1) {
                    this.loadRecord(res[0].module, res[0].id);
                }
                this.loading = false;
            },
            (err) => {
                // todo logger service
                console.log(err);

                this.loading = false;
            }
        );
    }

    private selectBean(bean) {
        this.loadRecord(bean.module, bean.id);
    }

    /**
     * loads a selected bean and shows its details
     *
     * @param module
     * @param id
     */
    private loadRecord(module, id) {
        // load te model
        this.model.module = module;
        this.model.id = id;
        this.model.getData(true);

        // load the componentset
        this.componentconfig = this.metadata.getComponentConfig('GroupwareDetailPane', module);
    }

    get beans() {
        return this.groupware.relatedBeans;
    }
}
