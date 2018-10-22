/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Input, Output, EventEmitter, Renderer, ElementRef, OnInit} from '@angular/core';
import { ActivatedRoute }   from '@angular/router';
import { modellist } from '../../services/modellist.service';
import { language } from '../../services/language.service';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';

@Component({
    selector: 'object-listview-header-list-selector',
    templateUrl: './src/objectcomponents/templates/objectlistviewheaderlistselector.html'
})
export class ObjectListViewHeaderListSelector implements OnInit{
    @Input() parentconfig: any = [];
    @Output() changelist = new EventEmitter<string>();
    showMenu: boolean = false;
    clickListener: any;
    currentList: string = '';

    constructor(private metadata: metadata, private activatedRoute: ActivatedRoute, private modellist: modellist, private language: language, private model: model, private elementRef: ElementRef, private renderer: Renderer) {

    }

    ngOnInit(){
        this.currentList = this.parentconfig.defaultlist;
    }

    toggleMenu(){
        this.showMenu = !this.showMenu;
        if (this.showMenu) {
            this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener)
            this.clickListener();
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.showMenu = false;
            this.clickListener();
        }
    }

    getIcon(){
        let icon: string = '';
        if(this.parentconfig.lists) {
            this.parentconfig.lists.some(list => {
                if (list.component == this.currentList) {
                    icon = list.icon;
                    return true;
                }
            })
        }

        return icon;
    }

    disabled(){
        return !(this.parentconfig.lists.length > 1);
    }

    getLists(){
        return this.parentconfig.lists;
    }

    setListtype(component){
        this.currentList = component;
        this.changelist.emit(component);
    }

}