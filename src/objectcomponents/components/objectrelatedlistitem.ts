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
import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {layout} from "../../services/layout.service";
import {view} from "../../services/view.service";
import { modal } from '../../services/modal.service';

@Component({
    selector: "[object-related-list-item]",
    templateUrl: "./src/objectcomponents/templates/objectrelatedlistitem.html",
    providers: [model, view]
})
export class ObjectRelatedListItem implements OnInit {
    @Input() private listfields: any[] = [];
    @Input() private listitem: any = {};
    @Input() private module: string = "";
    @Input() private editable: boolean = false;
    @Input() private editcomponentset: string = "";

    /**
     * set to true to hide the actionset menu item being display
     */
    @Input() private hideActions: boolean = false;

    private customEditActions: any[] = [];
    private customActions: any[] = [];
    private expanded: boolean = false;

    constructor( private metadata: metadata, private footer: footer, protected model: model, private relatedmodels: relatedmodels, private view: view, private router: Router, private language: language, private layout: layout, private modalservice: modal ) { }

    public ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.listitem.id;
        this.model.data = this.listitem;

        // set editable if the user is allowed to edit the record
        if (this.model.data.acl.edit) {
            this.view.isEditable = this.editable;

            this.customActions.push({action: "edit", name: this.language.getLabel("LBL_EDIT")});
            this.customActions.push({action: "remove", name: this.language.getLabel("LBL_REMOVE")});
        }

        if (this.editable) {
            this.customEditActions.push({action: "canceledit", name: this.language.getLabel("LBL_CANCEL")});
            this.customEditActions.push({action: "saverelated", name: this.language.getLabel("LBL_SAVE")});
        }
    }

    private navigateDetail() {
        this.router.navigate(["/module/" + this.model.module + "/" + this.model.id]);
    }

    private handleAction(action) {
        switch (action) {
            case "canceledit":
                this.model.cancelEdit();
                this.view.setViewMode();
                break;
            case "edit":
                this.metadata.addComponentDirect("ObjectEditModalWReference", this.footer.footercontainer).subscribe(editModalRef => {
                    editModalRef.instance.model.module = this.module;
                    editModalRef.instance.model.id = this.model.id;
                    editModalRef.instance.model.data = this.model.data;

                    if (this.editcomponentset && this.editcomponentset != "") {
                        editModalRef.instance.componentSet = this.editcomponentset;
                    }
                    this.model.startEdit();
                    editModalRef.instance.modalAction$.subscribe(action => {
                        if (action === false) {
                            editModalRef.destroy();
                            this.model.cancelEdit();
                        } else {
                            this.relatedmodels.setItem(this.model.data);
                            this.model.endEdit();
                            editModalRef.destroy();
                        }
                    });
                });
                break;
            case "remove":
                this.modalservice.confirm( this.language.getLabel('QST_REMOVE_ENTRY'), this.language.getLabel('QST_REMOVE_ENTRY', null, 'short')).subscribe( (answer) => {
                    if ( answer ) this.relatedmodels.deleteItem(this.model.id);
                });
                break;
            case "saverelated":
                if (this.model.validate()) {
                    // get changed Data
                    let changedData: any = this.model.getDirtyFields();
                    // in any case update date modified and set the id for the PUT
                    changedData.date_modified = this.model.getField('date_modified');
                    changedData.id = this.model.id;
                    // save related model
                    this.relatedmodels.setItem(changedData);
                    this.model.endEdit();
                    this.view.setViewMode();
                }
                break;
        }
    }


    private toggleexpanded() {
        this.expanded = !this.expanded;
    }

    get isexpanded() {
        return this.layout.screenwidth != 'small' || this.expanded;
    }

    get expandicon() {
        return this.expanded ? 'chevronup' : 'chevrondown';
    }
}
