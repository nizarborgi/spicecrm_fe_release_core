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
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {modal} from '../../services/modal.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-servicequeue',
    templateUrl: './src/objectfields/templates/fieldservicequeue.html'
})
export class fieldServiceQueue extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private modal: modal) {
        super(model, view, language, metadata, router);
    }
    get canChange() {
        if (this.model.data.acl && !this.model.data.acl.edit) return false;

        let resolveDate = this.model.getField('resolve_date');
        if (resolveDate && resolveDate.isValid && resolveDate.isValid()) {
            return false;
        }

        return this.model.isEditing ? false : true;
    }

    private selectQueue() {
        if(this.canChange) {
            this.modal.openModal('ServiceSelectQueueModal').subscribe(
                cmp => {
                    cmp.instance.parentqueue_id = this.model.getField(this.metadata.getFieldDefs(this.model.module, this.fieldname).id_name);
                    cmp.instance.displaynote = !this.view.isEditMode();
                    cmp.instance.selectedqueue.subscribe(response => {
                        if (response != false) {
                            this.model.setField(this.metadata.getFieldDefs(this.model.module, this.fieldname).id_name, response.servicequeue_id);
                            this.model.setField(this.fieldname, response.servicequeue_name);

                            if (!this.model.isEditing) {
                                this.model.save();
                            }
                        }
                    });
                }
            );
        }
    }
}
