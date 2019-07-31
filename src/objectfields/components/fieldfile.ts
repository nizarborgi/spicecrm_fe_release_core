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
import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {toast} from '../../services/toast.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

import {Subject, Observable} from 'rxjs';

@Component({
    selector: 'field-file',
    templateUrl: './src/objectfields/templates/fieldfile.html'
})
export class fieldFile extends fieldGeneric {

    @ViewChild('fileupload', {read: ViewContainerRef}) private fileupload: ViewContainerRef;
    private showUploadModal: boolean = false;
    private theFile: string = '';
    private theProgress: number = 0;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private configurationService: configurationService, private session: session, private toast: toast) {
        super(model, view, language, metadata, router);
    }

    public humanFileSize(filesize) {
        let thresh = 1024;
        let bytes: number = filesize;
        if (Math.abs(filesize) < thresh) {
            return bytes + " B";
        }
        let units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        let u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + " " + units[u];
    }

    private uploadFile() {
        let files = this.fileupload.element.nativeElement.files;
        this.doupload(files);
    }

    private doupload(files) {
        this.showUploadModal = true;
        this.theFile = files[0].name;
        this.uploadAttachmentsBase64(files).subscribe((retVal: any) => {
            if (retVal.progress) {
                this.theProgress = retVal.progress.loaded / retVal.progress.total * 100
            } else if (retVal.complete) {
                this.value = retVal.filename ? retVal.filename : this.theFile;
                // set the filetype
                this.model.setField('file_mime_type', retVal.filetype);
            }
        }, error => {

            this.closeUploadPopup();
        }, () => this.closeUploadPopup());
    }

    private removeFile() {
        this.value = '';
        this.model.setField('file_mime_type', '');
    }

    private closeUploadPopup() {
        this.showUploadModal = false;
    }

    /*
    private uploadAttachments(files): Observable<any> {
        if (files.length === 0){
            return;}

        let retSub = new Subject<any>();


        let data = new FormData();
        data.append('file', files[0], files[0].name);

        let request = new XMLHttpRequest();
        let resp: any = {};
        request.onreadystatechange = function (scope: any = this) {
            if (request.readyState == 4) {
                try {
                    retSub.next({complete: true});
                    retSub.complete();
                } catch (e) {
                    resp = {
                        status: 'error',
                        data: 'Unknown error occurred: [' + request.responseText + ']'
                    };
                }
            }
        };

        request.upload.addEventListener('progress', function (e: any) {
            retSub.next({progress: {total: e.total, loaded: e.loaded}});
        }, false);

        request.open('POST', this.configurationService.getBackendUrl() + '/module/' + this.model.module + '/' + this.model.id + '/noteattachment', true);
        request.setRequestHeader('OAuth-Token', this.session.authData.sessionId);
        request.send(data);

        return retSub.asObservable();
    }
    */

    public uploadAttachmentsBase64(files): Observable<any> {
        if (files.length === 0) {
            return;
        }

        let retSub = new Subject<any>();
        let maxSize = this.configurationService.getSystemParamater('upload_maxsize');

        for (let file of files) {

            // check max filesize
            if (maxSize && file.size > maxSize) {
                this.toast.sendToast(this.language.getLabelFormatted('LBL_EXCEEDS_MAX_UPLOADFILESIZE', [file.name, this.humanFileSize(maxSize)]), 'error');
                continue;
            }

            this.readFile(file).subscribe(filecontent => {
                let request = new XMLHttpRequest();
                let resp: any = {};
                request.onreadystatechange = (scope: any = this) => {
                    if (request.readyState == 4) {
                        try {
                            let retVal = JSON.parse(request.response);
                            retSub.next({complete: true, filename: retVal.filename, filetype: retVal.filetype});
                            retSub.complete();
                        } catch (e) {
                            resp = {
                                status: "error",
                                data: "Unknown error occurred: [" + request.responseText + "]"
                            };
                        }
                    }
                };

                request.upload.addEventListener("progress", e => {
                    retSub.next({progress: {total: e.total, loaded: e.loaded}});
                }, false);

                // request.open("POST", this.configurationService.getBackendUrl() + "/module/" + this.module + "/" + this.id + "/attachment", true);
                request.open('POST', this.configurationService.getBackendUrl() + '/module/' + this.model.module + '/' + this.model.id + '/noteattachment', true);
                request.setRequestHeader("OAuth-Token", this.session.authData.sessionId);
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

                let fileBody = {
                    file: file.filecontent,
                    filename: file.name,
                    filemimetype: file.type
                };

                request.send(JSON.stringify(fileBody));
            });
        }

        return retSub.asObservable();
    }

    private readFile(file): Observable<any> {
        let responseSubject = new Subject<any>();
        let reader = new FileReader();
        reader['file'] = file;
        reader.onloadend = (e) => {
            let filecontent = reader.result.toString();
            filecontent = filecontent.substring(filecontent.indexOf('base64,') + 7);

            let file = reader['file'];
            file.filecontent = filecontent;
            responseSubject.next(file);
            responseSubject.complete();
        };
        reader.readAsDataURL(file);
        return responseSubject.asObservable();
    }

    private getBarStyle() {
        return {
            width: this.theProgress + '%'
        };
    }

    private downloadAttachment(id) {
        let params: string[] = [];
        params.push('sessionid=' + this.session.authData.sessionId);
        window.open(
            this.configurationService.getBackendUrl() + '/module/' + this.model.module + '/' + this.model.id + '/noteattachment/download?' + params.join('&'),
            '_blank' // <- open in a new window
        );
    }

    private preventdefault(event: any) {
        if ((event.dataTransfer.items.length == 1 && event.dataTransfer.items[0].kind === 'file') || (event.dataTransfer.files.length > 0)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    private onDrop(event: any) {
        this.preventdefault(event);
        let files = event.dataTransfer.files;
        if (files && files.length == 1) {
            this.doupload(files);
        }
    }


    private determineFileIcon() {
        let filetype = this.model.getField('file_mime_type');
        if (filetype) {
            let fileTypeArray = filetype.split("/");
            // check the application
            switch (fileTypeArray[0]) {
                case "image":
                    return "image";
                case "text":
                    switch (fileTypeArray[1]) {
                        case 'html':
                            return 'html';
                        default:
                            return "txt";
                    }
                case "audio":
                    return "audio";
                case "video":
                    return "video";
                default:
                    break;
            }

            // check the type
            switch (fileTypeArray[1]) {
                case "xml":
                    return "xml";
                case "pdf":
                    return "pdf";
                case "vnd.ms-excel":
                case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    return "excel";
                case "vnd.openxmlformats-officedocument.wordprocessingml.document":
                case "vnd.oasis.opendocument.text":
                    return "word";
                case "vnd.oasis.opendocument.presentation":
                case "vnd.openxmlformats-officedocument.presentationml.presentation":
                    return "ppt";
                case "x-zip-compressed":
                    return "zip";
                case "x-msdownload":
                    return "exe";
                default:
                    break;
            }
        }

        return "unknown";
    }
}
