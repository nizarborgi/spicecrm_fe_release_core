/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';

@Component({
    selector: 'field-generic',
    templateUrl: './src/objectfields/templates/fieldgeneric.html'
})
export class fieldGeneric implements OnInit
{
    @Input() fieldname: string = '';
    @Input() fieldconfig: any = {};
    fieldid: string = '';
    fieldlength: number = 999;
    private _field_defs;
    private _css_classes: any[string] = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router
    ) {
        this.fieldid = this.model.generateGuid();
    }

    ngOnInit(){
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        if(fieldDefs && fieldDefs.len)
            this.fieldlength = fieldDefs.len;
    }

    get modelOptions(){
        return { updateOn: 'blur' }
    }

    get value() {
        return this.model.getField(this.fieldname);
    }

    set value(val) {
        this.model.setField(this.fieldname, val);
    }

    get errors()
    {
        return this.model.getFieldMessages(this.fieldname, 'error');
    }

    /*
        get stati() {
            let stati = this.model.getFieldStati(this.fieldname);
            if (stati.editable && (!this.view.isEditable || this.fieldconfig.readonly)) {
                stati.editable = false;
                //console.log('setting '+this.fieldname+' uneditable!');
            }
            //console.log(this.fieldname+' editable:'+stati.editable);

            return stati;
        }
    */
    get css_classes() {
        if (this.getStati().invalid) this.addCssClass('slds-has-error');
        //else if (this.getStati().incomplete) this.addCssClass('slds-has-error');
        else this.removeCssClass('slds-has-error');

        return this._css_classes;
    }

    get field_defs()
    {
        if(!this._field_defs)
            this._field_defs = this.metadata.getFieldDefs(this.model.module, this.fieldname);

        return this._field_defs;
    }

    getStati(field:string = this.fieldname)
    {

        let stati = this.model.getFieldStati(field);

        // if(this.model.data && this.model.data.acl &&!this.model.checkAccess('edit')) stati.editable = false;

        if (stati.editable && (!this.view.isEditable || this.fieldconfig.readonly)) {
            stati.editable = false;

        }

        return stati;
    }

    isEditable(field:string = this.fieldname):boolean
    {
        /*
        if(
            !this.view.isEditable ||
            this.fieldconfig.readonly ||
            (this.model.data && this.model.data.acl_fieldcontrol && this.model.data.acl_fieldcontrol[this.fieldname] && parseInt(this.model.data.acl_fieldcontrol[this.fieldname]) < 3) )
            return false;
        else
            return true;
        */

        return this.getStati(field).editable && !this.getStati(field).readonly && !this.getStati(field).disabled && !this.getStati(field).hidden;
    }

    isEditMode() {
        if (this.view.mode === 'edit' && this.isEditable())
            return true;
        else
            return false;
    }

    displayLink() {
        try {
            return this.view.displayLinks && this.fieldconfig.link && this.model.data.acl.detail;
        } catch (e) {
            return false;
        }
    }

    setEditMode() {
        this.model.startEdit();
        this.view.setEditMode();
    }

    getFieldClass() {
        return this.css_classes;
    }

    fieldHasError(field?):boolean {
        return this.hasFieldErrors(field);
    }



    hasFieldErrors(field:string = this.fieldname):boolean
    {
        if (this.getStati(field).invalid || this.errors)
            return true;
        else
            return false
    }

    goRecord() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }

    addCssClass(val: string): boolean {
        if (!this._css_classes.includes(val)) {
            this._css_classes.push(val);
        }
        //console.log(val, this.field_css_classes);
        return true;
    }

    removeCssClass(val: string) {
        if (this._css_classes.includes(val)) {
            this._css_classes.splice(this._css_classes.indexOf(val), 1);
        }
        return true;
    }

    toggleCssClass(val: string) {
        if (!this._css_classes.includes(val)) {
            this.addCssClass(val);
        }
        else {
            this.removeCssClass(val);
        }
        return true;
    }




    setFieldError(msg):boolean
    {
        return this.model.setFieldMessage('error', msg, this.fieldname, this.fieldid);
    }

    clearFieldError():boolean
    {
        return this.model.resetFieldMessages(this.fieldname, 'error', this.fieldid);
    }

}



/*

import { Validator, AbstractControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';
import { Directive, forwardRef } from '@angular/core';



export function validateModelValidationRules(fieldname:string, model:model): ValidatorFn
{
    return (control: AbstractControl): {[key: string]: any} =>
    {
        model.evaluateValidationRules(fieldname, 'change');
        return null;
    };
}



@Directive({
    selector: '[validateModelField][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: forwardRef(() => ModelValidationDirective), multi: true}]
})
export class ModelValidationDirective implements Validator
{
    @Input() validateModelField;

    constructor(private model:model) {

    }

    validate(control:AbstractControl): {[key: string]: any} {
        return validateModelValidationRules(this.validateModelField, this.model)(control);
    }
}

*/