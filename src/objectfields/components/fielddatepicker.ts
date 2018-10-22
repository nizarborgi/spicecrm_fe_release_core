/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

declare var moment: any;

@Component({
    selector: 'field-date-picker',
    templateUrl: './src/objectfields/templates/fielddatepicker.html'
})
export class fieldDatePicker implements OnInit {

    @Input() setdate: any = new moment();
    @Output() setdateChange: EventEmitter<Date> = new EventEmitter<Date>();
    @Input() posclass: string = 'slds-dropdown--bottom';
    @ViewChild('datepicker') dp_elem_ref: ElementRef;
    private curDate: any = new moment();

    get currentYear(): number {
        return this.curDate.year();
    };

    set currentYear(value) {
        this.curDate.year(value);
        this.buildGrid();
    };

    get currentMonth(): string {
        return moment.months()[this.curDate.month()];
    }

    private currentGrid: Array<any> = [];

    constructor(private model: model, private view: view, private language: language, private metadata: metadata, private popup: popup, private elementRef: ElementRef) {
    }

    get posStyle(){
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        let max_height = window.innerHeight;
        let top = rect.top - 40;
        if(top <= 0) top = 1;
        let dp_height = this.dp_elem_ref.nativeElement.offsetHeight;
        if( top + dp_height > max_height ) {
            return {
                position: 'fixed',
                bottom: '1px',
                left: rect.left + 'px'
            };
        } else {
            return {
                position: 'fixed',
                top: top + 'px',
                left: rect.left + 'px'
            };
        }
    }

    weekdays(){
        return moment.weekdaysShort();
    }

    ngOnInit() {
        this.curDate = new moment(this.setdate);
        this.buildGrid();
    }

    notCurrentMonth(month) {
        return month !== this.curDate.month();
    }

    isToday(day, month){
        let today = new moment();
        if(today.year() === this.curDate.year() && today.month() === month && today.date() == day)
            return true;
        else
            return false;
    }

    isCurrent(day, month){
        if(this.setdate && this.curDate.year() === this.setdate.year() && this.setdate.month() === month && this.setdate.date() == day)
            return true;
        else
            return false;
    }

    prevMonth() {
        this.curDate.subtract(1, 'months');
        this.buildGrid();
    }

    nextMonth() {
        this.curDate.add(1, 'months');
        this.buildGrid();
    }

    goToday() {
        this.curDate = new moment();
        this.setdateChange.emit(this.curDate);
        this.popup.close();
    }

    pickDate(day, month){
        // if no date ws passed in and a date is picked create a new object
        if(!this.setdate) this.setdate = new moment();

        // update the set date and emit it
        this.setdate.year(this.curDate.year());
        this.setdate.month(month);
        this.setdate.date(day);
        this.setdateChange.emit(this.setdate);

        // close the popup
        this.popup.close();
    }

    buildGrid(){
        this.currentGrid = [];
        // let fdom = new moment(this.curDate.year() + '-' + (this.curDate.month() + 1) + '-' + '01');
        let fdom = new moment(this.curDate);
        // move to first day of month
        fdom.date(1);
        // move to Sunday
        fdom.day(0);

        // build 6 weeks
        let j = 0;
        while (j < 6) {
            let i = 0;
            let week = [];
            while (i < 7) {
                week.push({day: fdom.date(), month: fdom.month()});

                fdom.add(1, 'd');
                i++;
            }
            this.currentGrid.push(week);
            j++;
        }


    };

}