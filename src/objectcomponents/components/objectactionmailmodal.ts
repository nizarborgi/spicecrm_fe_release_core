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
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';
import {userpreferences} from '../../services/userpreferences.service';

@Component({
    selector: 'object-action-mail-modal',
    templateUrl: './src/objectcomponents/templates/objectactionmailmodal.html',
    providers: [view, model]
})
export class ObjectActionMailModal implements OnInit {

    public parent: any = null;
    public self: any = null;
    private sending: boolean = false;

    constructor(private language: language,
                private metadata: metadata,
                private model: model,
                private view: view,
                private backend: backend,
                private prefs: userpreferences,
                private modal: modal) {
        this.model.module = 'Emails';
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    get isDisabled() {
        let recipientAddresses = this.model.getFieldValue('recipient_addresses');
        let mailbox = this.model.getFieldValue('mailbox_id');
        let name = this.model.getFieldValue('name');
        let body = this.model.getFieldValue('body');
        let recipientTo = recipientAddresses ? recipientAddresses.find(re => re.address_type == 'to') : undefined;

        return (!name || !body || !mailbox || !recipientAddresses || !recipientTo) ? true : this.sending;
    }

    public ngOnInit() {
        this.model.initializeModel(this.parent);
        this.setParentData();
    }

    private setParentData() {
        this.model.setField('parent_type', this.parent.module);
        this.model.setField('parent_id', this.parent.id);
        this.model.setField('parent_name', this.parent.data.summary_text);
    }

    private close() {
        this.self.destroy();
    }

    private sendEmail() {
        this.modal.openModal('SystemLoadingModal', false).subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SENDING';

            this.sending = true;
            this.model.setField('type', 'out');
            this.model.setField('to_be_sent', '1');
            this.model.setField('from_addr', this.model.data.from_addr_name);
            this.model.setField('to_addrs', this.model.data.to_addrs_names);

            this.model.save().subscribe(
                success => {
                    modalRef.instance.self.destroy();
                    this.close();
                },
                error => {
                    modalRef.instance.self.destroy();
                    this.sending = false;
                }
            );
        });
    }
}