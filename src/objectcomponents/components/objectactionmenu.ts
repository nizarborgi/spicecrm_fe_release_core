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
import {Component, ElementRef, Renderer2, Input, Output, EventEmitter} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';

import {view} from '../../services/view.service';
import {broadcast} from '../../services/broadcast.service';
import {helper} from '../../services/helper.service';
import {layout} from '../../services/layout.service';

@Component({
    selector: 'object-action-menu',
    templateUrl: './src/objectcomponents/templates/objectactionmenu.html',
    providers: [helper]
})
export class ObjectActionMenu {

    @Input() private buttonsize: string = '';
    @Input() private addactions: any[] = [];
    @Input() private addeditactions: any[] = [];
    @Input() private standardactions: boolean = true;
    @Input() private standardeditactions: boolean = true;
    @Output() private action: EventEmitter<string> = new EventEmitter<string>();

    constructor(private language: language, private broadcast: broadcast, private model: model, private view: view, private metadata: metadata, private elementRef: ElementRef, private renderer: Renderer2, private helper: helper, private layout: layout) {

    }

    get isSmall() {
        return this.layout.screenwidth == 'small';
    }


    private isEditMode() {
        return this.view.isEditMode();
    }

    private hasNoActions() {
        // because of custom actions can't be checked if they are enabled... return false
        if (this.addactions.length > 0) return false;

        if (this.standardactions) {
            if (this.model.data.acl && this.model.data.acl.edit === false && this.model.data.acl.delete === false) return true;
        }

        return false;
        /*
        if (this.standardactions) {
            if (this.model.data.acl && this.model.data.acl.edit === false && this.model.data.acl.delete === false)
                return this.addactions.length == 0;
            else
                return false;
        } else {
            return this.addactions.length == 0;
        }
        */
    }

    private canEdit() {
        return this.model.checkAccess('edit');
    }

    private canView() {
        return this.model.checkAccess('detail');
    }

    private canDelete() {
        return this.model.checkAccess('delete');
    }

    private cancelEdit() {
        this.model.cancelEdit();
        this.view.setViewMode();
    }

    private saveModel() {
        this.model.save(true).subscribe(data => {
            this.view.setViewMode();
        });
    }


    private editModel() {
        if(this.canEdit()) {
            this.model.edit(true);
        }
    }

    private confirmDelete() {
        this.helper.confirm(this.language.getLabel('LBL_DELETE_RECORD'), this.language.getLabel('MSG_DELETE_CONFIRM')).subscribe(answer => {
            if (answer) {
                this.deleteModel();
            }
        });
    }

    private deleteModel() {
        this.model.delete().subscribe(status => {
            if (status) {
                // this.broadcast.broadcastMessage('model.delete', {id: this.model.id});
            }
        });
    }

    private viewModel() {
        this.model.goDetail();
    }

    private doCustomAction(action) {
        this.action.emit(action);
    }

    private getButtonSizeClass() {
        if (this.buttonsize !== '') {
            return 'slds-button--icon-' + this.buttonsize;
        }
    }

    private getDropdownLocationClass() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        return {'slds-dropdown--bottom': window.innerHeight - rect.bottom < 100};
    }
}
