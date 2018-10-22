/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import { Component, OnInit, EventEmitter, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { model } from '../../services/model.service';
import { modellist } from '../../services/modellist.service';
import { view } from '../../services/view.service';
import { language } from '../../services/language.service';
import { metadata } from '../../services/metadata.service';

@Component({
    selector: 'object-modal-module-lookup',
    templateUrl: './src/objectcomponents/templates/objectmodalmodulelookup.html',
    providers: [view, model, modellist],
    styles:[
        '::ng-deep table.singleselect tr:hover td { cursor: pointer; }',
        '::ng-deep field-generic-display > div { padding-left: 0 !important; padding-right: 0 !important; }'
    ]
})
export class ObjectModalModuleLookup implements OnInit {

    @ViewChild('tablecontent', {read: ViewContainerRef}) tablecontent: ViewContainerRef;
    @ViewChild('modalcontent', {read: ViewContainerRef}) modalcontent: ViewContainerRef;

    displayFields: Array<any> = [];
    listFields: Array<string> = [];
    allSelected: boolean = false;
    searchTerm: string = '';
    searchTermOld: string = '';
    searchTimeOut: any = undefined;
    self: any = {};
    multiselect: boolean = false;
    module: string = '';
    @Output() selectedItems: EventEmitter<any> = new EventEmitter<any>()

    constructor(private language: language, private model: model, private modellist: modellist, private metadata: metadata ) {
    }


    get checkbox() {
        return this.allSelected
    }

    set checkbox(value) {
        this.allSelected = value;
        if (value)
            this.modellist.setAllSelected();
        else
            this.modellist.setAllUnselected();
    }

    contentStyle(){
        let contentRect = this.tablecontent.element.nativeElement.getBoundingClientRect();
        let modalRect = this.modalcontent.element.nativeElement.getBoundingClientRect();

        return {
            height: modalRect.height - (contentRect.top - modalRect.top)
        }
    }

    ngOnInit() {
        let componentconfig = this.metadata.getComponentConfig('ObjectList', this.module);
        this.displayFields = this.metadata.getFieldSetFields(componentconfig.fieldset);

        this.model.module = this.module;
        this.modellist.setModule(this.module);

        for (let displayField of this.displayFields) {
            this.listFields.push(displayField.field);
        }

        // load the list
        this.modellist.getListData(this.listFields);

        // if we have a searchterm .. start the search
        if(this.searchTerm != '')
            this.doSearch();
    }

    doSearch(){
        this.searchTermOld = this.searchTerm;
        this.modellist.searchTerm = this.searchTerm;
        this.modellist.getListData(this.listFields);
    }

    triggerSearch(_e){
        if ( this.searchTerm === this.searchTermOld ) return;
        // handle the key pressed
        switch (_e.key) {
            case 'Enter':
                if(this.searchTerm.length > 0){
                    if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                    this.doSearch();
                }
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.doSearch(), 1000);
                break;
        }
    }

    onScroll(e) {
        let element = this.tablecontent.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.modellist.loadMoreList();
        }
    }

    closePopup() {
        this.self.destroy();
    }

    getSelectedCount() {
        return this.modellist.getSelectedCount();
    }

    selectItems() {
        this.selectedItems.emit(this.modellist.getSelectedItems());
        this.self.destroy();
    }

    clickRow(event, item){
        this.selectedItems.emit([item]);
        this.self.destroy();
    }

    onModalEscX() {
        this.closePopup();
    }

}