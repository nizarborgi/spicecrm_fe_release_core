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
 * @module ModuleMediaFiles
 */
import { Component, OnInit } from '@angular/core';
import {mediafiles} from '../../../services/mediafiles.service';
import { backend } from '../../../services/backend.service';
import { language } from '../../../services/language.service';
import {Subject, Observable} from 'rxjs';
import { toast } from '../../../services/toast.service';

@Component({
    selector: 'media-file-picker',
    templateUrl: './src/modules/mediafiles/templates/mediafilepicker.html',
    providers: [ mediafiles ],
    styles: [ 'img.thumb { background-color: #fff; border: 1px solid #d8dde6; padding: 1px; margin-right: 3px; width: 32px; height: 32px; }',
        'li { display: inline-block; vertical-align: middle; border-radius: .25rem; width: 160px; height: 160px;  box-sizing: content-box; position: relative;  }',
        'ul { margin: 0 -.75rem -.75rem 0; }',
        'a { display: block; height: 100%; width: 100%; padding: .25rem; border: 1px solid #dddbda; }',
        'a:hover { border: 1px solid #1589ee; filter: brightness(92%); }',
        'a:hover media-file-image { filter: brightness(118%); }',
    ]
})
export class MediaFilePicker implements OnInit {

    pickerIsLoading = true;
    files: Array<any> = [];

    selectedCategoryID: string = '';
    selectedCategory: object;

    dropdownUnused = true;

    categoriesLoaded = false;
    filesLoaded = false;

    mediatype: number = 1;
    filetype: string = '';

    answer: Observable<object> = null;
    answerSubject: Subject<object> = null;

    uploadAllowed = false;

    self: any;

    constructor ( private mediafiles: mediafiles, private backend: backend, private language: language, private toast: toast ) {
        this.answerSubject = new Subject<object>();
        this.answer = this.answerSubject.asObservable();
    }

    ngOnInit() {

        this.mediafiles.loadCategories().subscribe( () => {
            this.categoriesLoaded = true;
            if ( this.filesLoaded ) this.pickerIsLoading = false;
        });

        let paramsFiles = {
            fields: [ 'id', 'name', 'category' ],
            searchfields: { join: 'AND',
                conditions:[
                    { field: 'mediatype', operator: '=', value: this.mediatype },
                    { field: 'upload_completed', operator: '=', value: 1 }
                ]
            },
            sortfield: 'name',
            limit: -99
        };

        this.backend.getRequest( '/module/MediaFiles', paramsFiles ).subscribe( ( response: any ) => {
                this.files = response.list;
                this.filesLoaded = true;
                if ( this.categoriesLoaded ) this.pickerIsLoading = false;
            },
            error => {
                this.toast.sendToast( this.language.getLabel('ERR_NETWORK_LOADING'),'error', 'To retry: Close and reopen the window.', false );
            }
        );

    }

    pick( index: number ) {
        this.answerSubject.next( { id: this.files[index].id } );
        this.answerSubject.complete();
        this.self.destroy();
    }

    cancel() {
        this.answerSubject.next( {} );
        this.answerSubject.complete();
        this.self.destroy();
    }

    onModalEscX() {
        this.cancel();
    }

    changeToUploadDialog() {
        this.answerSubject.next( { 'upload': true } );
        this.answerSubject.complete();
        this.self.destroy();
    }

    onChangeCategory( event: any ) {
        this.selectedCategoryID = event.target.value;
        this.selectedCategory = this.mediafiles.categories[this.selectedCategoryID];
        this.dropdownUnused = false;
    }

}