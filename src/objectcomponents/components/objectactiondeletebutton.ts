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
 * @module ObjectComponents
 */
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {helper} from '../../services/helper.service';
import {language} from '../../services/language.service';

/**
 * a standard actionset item to deltete a model
 */
@Component({
    selector: 'object-action-delete-button',
    templateUrl: './src/objectcomponents/templates/objectactiondeletebutton.html',
    providers: [helper]
})
export class ObjectActionDeleteButton implements OnInit {

    /**
     * defines if the delete ooptionis disabled. By defualt it is but this is checked on model load and model changes and set accordingly to ACL Rules there
     */
    public disabled: boolean = true;

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private helper: helper) {

        this.model.mode$.subscribe(mode => {
            this.handleDisabled(mode);
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        });
    }

    public ngOnInit() {
        setTimeout(() => {
            this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        });
    }

    get canDelete() {
        try {
            return this.model.checkAccess('delete');
        } catch (e) {
            return false;
        }
    }

    public execute() {

        // this.showDialog = true;
        this.helper.confirm(this.language.getAppLanglabel('MSG_DELETE_RECORD'), this.language.getAppLanglabel('MSG_DELETE_RECORD', 'long')).subscribe(answer => {
            if (answer) {
                this.delete();
            }
        });
    }


    private delete() {
        this.model.delete().subscribe(status => {
            this.router.navigate(['/module/' + this.model.module]);
        });
    }

    private handleDisabled(mode) {
        if (!this.canDelete) {
            this.disabled = true;
            return;
        }
        this.disabled = mode == 'edit' ? true : false;
    }
}
