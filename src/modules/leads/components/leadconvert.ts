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
 * @module ModuleLeads
 */
import {Component, AfterViewInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {navigation} from '../../../services/navigation.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {Subject, Observable} from 'rxjs';

@Component({
    selector: 'lead-convert',
    templateUrl: './src/modules/leads/templates/leadconvert.html',
    providers: [model, view],
    styles: [
        ':host >>> global-button-icon svg {fill:#CA1B1F}',
        ':host >>> .slds-progress__marker:hover global-button-icon svg {fill:#FD595D}',
        ':host >>> .slds-progress__marker:active global-button-icon svg {fill:#FD595D}',
        ':host >>> .slds-progress__marker:focus global-button-icon svg {fill:#FD595D}',
    ]
})
export class LeadConvert implements AfterViewInit {

    @ViewChild('contentcontainer', {read: ViewContainerRef}) contentcontainer: ViewContainerRef;

    moduleName = 'Leads';
    headerFieldSets: Array<any> = [];
    contact: model = undefined;
    account: model = undefined;
    selectedaccount: any = undefined;
    createAccount: boolean = false;
    opportunity: model = undefined;
    createOpportunity: boolean = false;

    createSaveActions: Array<any> = [];
    convertSubject: Subject<boolean> = undefined;
    showSaveModal: boolean = false;

    currentConvertStep: number = 0;
    convertSteps: Array<any> = ['Contact', 'Account', 'Opportunity'];

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private navigation: navigation,
        private toast: toast
    ) {
        let componentconfig = this.metadata.getComponentConfig('ObjectPageHeader', 'Leads');
        this.headerFieldSets = [componentconfig.fieldset];
    }

    ngAfterViewInit() {

        // set the navigation paradigm
        this.navigation.setActiveModule(this.moduleName);

        // get the bean details
        this.model.module = this.moduleName;
        this.model.id = this.activatedRoute.params['value']['id'];

        this.model.getData(true, 'detailview').subscribe(data => {
            this.navigation.setActiveModule(this.moduleName, this.model.id, data.summary_text);
        });
    }

    getContainerStyle() {
        let rect = this.contentcontainer.element.nativeElement.getBoundingClientRect();
        return {
            'height': 'calc(100vh - ' + rect.top + 'px)',
            'overflow-y': 'auto'
        }
    }

    gotoLead() {
        this.router.navigate(['/module/Leads/' + this.model.id]);
    }

    getStepClass(convertStep: any) {
        let thisIndex = this.convertSteps.indexOf(convertStep);
        if (thisIndex == this.currentConvertStep) {
            return 'slds-is-active';
        }
        if (thisIndex < this.currentConvertStep) {
            return 'slds-is-completed';
        }
    }

    getStepComplete(convertStep: any) {
        let thisIndex = this.convertSteps.indexOf(convertStep);
        if (thisIndex < this.currentConvertStep) {
            return true;
        }
        return false;
    }

    getProgressBarWidth() {
        return {
            width: (this.currentConvertStep / (this.convertSteps.length - 1) * 100) + '%'
        }
    }

    nextStep() {
        switch (this.currentConvertStep) {
            case 0:
                if (this.contact.validate())
                    this.currentConvertStep++;
                break;
            case 1:
                if (this.createAccount && this.account.validate()) {
                    this.currentConvertStep++;
                } else if (!this.createAccount) {
                    this.currentConvertStep++;
                }
                break;
            case 2:
                if (this.createOpportunity && this.opportunity.validate()) {
                    this.convert();
                } else if (!this.createOpportunity) {
                    this.convert();
                }
                break;
        }
    }

    prevStep() {
        if (this.currentConvertStep > 0)
            this.currentConvertStep--;
    }

    showNext() {
        if (this.currentConvertStep < this.convertSteps.length - 1)
            return true;
        else
            return false;
    }

    showSave() {
        if (this.currentConvertStep == this.convertSteps.length - 1)
            return true;
        else
            return false;
    }

    convert() {

        // build save actions
        this.createSaveActions = [];
        if(this.createAccount){
            this.createSaveActions.push({
                action: 'createAccount',
                label: 'LBL_LEADCONVERT_CREATEACCOUNT',
                status: 'initial'
            })
        }

        this.createSaveActions.push({
            action: 'createContact',
            label: 'LBL_LEADCONVERT_CREATECONTACT',
            status: 'initial'
        })

        if(this.createOpportunity){
            this.createSaveActions.push({
                action: 'createOpportunity',
                label: 'LBL_LEADCONVERT_CREATEOPPORTUNITY',
                status: 'initial'
            })
        }

        this.createSaveActions.push({
            action: 'convertLead',
            label: 'LBL_LEADCONVERT_CONVERTLEAD',
            status: 'initial'
        })

        this.showSaveModal = true;

        // process the actions
        this.processConvert().subscribe(() => {
            this.showSaveModal = false;
            // send a toast
            this.toast.sendToast('Lead ' + this.model.data.summary_text + ' converted', 'success', '', 30 );
            // go back to the lead
            this.gotoLead();
        })
    }

    processConvert(): Observable<boolean>{
        this.convertSubject = new Subject<boolean>();
        this.processConvertActions();
        return this.convertSubject.asObservable();
    }

    processConvertActions(){
        let nextAction = '';
        this.createSaveActions.some(item => {
            if(item.status === 'initial') {
                nextAction = item.action;
                return true;
            }
        })

        if(nextAction) {
            this.processConvertAction(nextAction);
        } else {
            this.convertSubject.next(true);
            this.convertSubject.complete();
        }
    }

    processConvertAction(action){
        switch(action){
            case 'createAccount':
                this.account.save().subscribe(data => {
                    this.completeConvertAction(action);
                });
                break;
            case 'createContact':
                // complete the contact
                if(this.createAccount){
                    this.contact.data.account_id = this.account.id;
                } else if(this.selectedaccount){
                    this.contact.data.account_id = this.selectedaccount.id;
                }

                this.contact.save().subscribe(data => {
                    this.completeConvertAction(action);
                });
                break;
            case 'createOpportunity':
                // complete the opportuinity
                if(this.createAccount){
                    this.opportunity.data.account_id = this.account.id;
                } else if(this.selectedaccount){
                    this.opportunity.data.account_id = this.selectedaccount.id;
                }

                this.opportunity.save().subscribe(data => {
                    this.completeConvertAction(action);
                });
                break;
            case 'convertLead':
                // complete the lead
                if(this.createAccount){
                    this.model.data.account_id = this.account.id;
                } else if(this.selectedaccount){
                    this.model.data.account_id = this.selectedaccount.id;
                }
                this.model.data.contact_id = this.contact.id;
                this.model.data.status = 'Converted';

                this.model.save().subscribe(data => {
                    this.completeConvertAction(action);
                });
                break;
        }
    }

    private completeConvertAction(action){
        this.createSaveActions.some(item => {
            if(item.action === action) {
                item.status = 'completed';
                return true;
            }
        });

        // start the next step
        this.processConvertActions()
    }

    /*
     * setter for the models
     */
    setContact(contact) {
        this.contact = contact;
    }

    setAccount(account) {
        this.account = account;
    }

    setSelectedAccount(accountdata) {
        this.selectedaccount = accountdata;
    }

    setCreateAccount(value) {
        this.createAccount = value;
    }

    setOpportunity(opportunity) {
        this.opportunity = opportunity;
    }

    setCreateOpportunity(value) {
        this.createOpportunity = value;
    }
}