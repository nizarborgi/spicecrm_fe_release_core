/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, AfterViewInit, OnInit, ViewChild, ViewContainerRef, ElementRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {Router} from '@angular/router';

@Component({
    selector: 'dashboard-mailboxes-dashlet',
    templateUrl: './src/modules/mailboxes/templates/mailboxesdashlet.html',
    providers: [model, view]
})
export class MailboxesDashlet implements OnInit {
    isLoading: boolean = true;
    mailboxes: Array<any> = [];
    canLoadMore: boolean = true;
    loadLimit: number = 20;

    @ViewChild('tablecontainer', {read: ViewContainerRef}) tablecontainer: ViewContainerRef;
    @ViewChild('headercontainer', {read: ViewContainerRef}) headercontainer: ViewContainerRef;

    constructor(private language: language,
                private metadata: metadata,
                private backend: backend,
                private model: model,
                private router: Router,
                private elementRef: ElementRef) {

    }

    ngOnInit() {
        this.model.module = 'Mailboxes';
        this.getMailboxes();
    }

    getMailboxes(){
        this.backend.getRequest('/modules/Mailboxes/dashlet').subscribe((mailboxes: any[]) => {
                this.mailboxes = mailboxes;
                if (mailboxes.length < this.loadLimit)
                    this.canLoadMore = false;
            this.isLoading = false;
        });
        if (this.mailboxes.length > 0)
            this.mailboxes = this.mailboxes.map(mailbox => mailbox.emailsread = mailbox.emailsread - mailbox.emailsclosed);
    }

    get tablestyle(){
        let element = this.headercontainer.element.nativeElement;
        return {height: `calc(98% - ${element.clientHeight}px` }

    }

    onScroll() {
        let element = this.tablecontainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight >= element.scrollHeight)
            this.loadMore();
    }

    goToRecord(id){
        this.router.navigate([`/module/${this.model.module}/${id}`]);

    }

    loadMore(){
        if (this.canLoadMore){
            this.isLoading = true;
            this.backend.getRequest('/modules/Mailboxes/dashlet').subscribe((mailboxes: any[]) => {
                this.mailboxes = this.mailboxes.concat(mailboxes);
                if (mailboxes.length < this.loadLimit)
                    this.canLoadMore = false;
                this.isLoading = false;
            });
        }
    }


}