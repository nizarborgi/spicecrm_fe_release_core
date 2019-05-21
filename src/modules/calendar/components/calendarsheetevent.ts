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
 * @module ModuleCalendar
 */
import {
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {broadcast} from '../../../services/broadcast.service';
import {calendar} from '../services/calendar.service';
import {Subscription} from "rxjs";

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'calendar-sheet-event',
    templateUrl: './src/modules/calendar/templates/calendarsheetevent.html',
    providers: [model, view]
})
export class CalendarSheetEvent implements OnInit, OnDestroy {
    @Output() public rearrange: EventEmitter<any> = new EventEmitter<any>();
    public fields: any[] = [];
    @Input() public event: any = {};
    @Input("ismonthsheet") private isMonthSheet: boolean = false;
    @Input("isschedulesheet") private isScheduleSheet: boolean = false;
    private mouseMoveListener: any = undefined;
    private mouseUpListener: any = undefined;
    private mouseStart: any = undefined;
    private mouseLast: any = undefined;
    private hidden: boolean = false;
    private subscription: Subscription = new Subscription();
    private lastMoveTimeSpan: number = 0;

    constructor(private language: language,
                private metadata: metadata,
                private broadcast: broadcast,
                private calendar: calendar,
                private elementRef: ElementRef,
                private model: model,
                private renderer: Renderer2) {
        this.subscription = this.calendar.color$.subscribe(calendar => {
            if (this.calendar.calendars[calendar.id] && this.calendar.calendars[calendar.id].some(event => this.event.id == event.id)) {
                this.event.color = calendar.color;
            }
        });
    }

    get isAbsense() {
        return this.event.type == 'absence' || this.event.module == 'UserAbsences';
    }

    get isDraggable() {
        return this.canEdit && !this.event.isMulti && !this.isMonthSheet;
    }

    @HostBinding('class')
    get eventClass() {
        return 'slds-is-absolute slds-p-bottom--xxx-small' + (this.hidden ? ' slds-hidden' : '');
    }


    get canEdit() {
        return this.owner == this.event.data.assigned_user_id && !this.isScheduleSheet &&
            (this.event.type == 'event' || this.event.type == 'absence') && !this.calendar.asPicker && !this.calendar.isMobileView && !this.calendar.isDashlet;
    }

    get owner() {
        return this.calendar.owner;
    }

    get eventStyle() {
        return {
            'height': '100%',
            'border-radius': '2px',
            'background-color': !this.isScheduleSheet ? this.event.color : 'transparent',
        };
    }

    public ngOnInit() {
        this.model.module = this.event.module;
        this.model.id = this.event.id;
        this.model.data = this.event.data;
        if (!this.event.hasOwnProperty('color')) {
            this.event.color = this.calendar.eventColor;
        }
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    @HostListener('dragstart', ['$event'])
    private dragStart(event) {
        event.stopPropagation();
        if (!this.canEdit) {
            event.preventDefault();
            return;
        }
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData("event", 'cross browser dumb');
        this.event.dragging = true;
        setTimeout(() => this.hidden = true, 0);
    }

    @HostListener('dragend')
    private dragEnd() {
        this.hidden = false;
    }

    private onMouseDown(e) {

        this.mouseStart = e;
        this.mouseLast = e;
        this.event.resizing = true;

        this.mouseUpListener = this.renderer.listen('document', 'mouseup', (event) => this.onMouseUp());
        this.mouseMoveListener = this.renderer.listen('document', 'mousemove', (event) => this.onMouseMove(event));

        // prevent triggering other events
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.cancelBubble = true;
        e.returnValue = false;
    }

    private onMouseMove(e) {
        if (!this.canEdit) {
            return;
        }
        this.mouseLast = e;
        let moved = (this.mouseLast.pageY - this.mouseStart.pageY);
        let span = Math.floor(moved / 15);
        if (this.lastMoveTimeSpan !== span) {
            this.lastMoveTimeSpan = span;
            let eventEnd = new moment(this.event.start).add((this.event.data.duration_hours * 60) + this.event.data.duration_minutes + (this.lastMoveTimeSpan * 15), 'm');
            if (this.event.start.hours() === eventEnd.hours() && this.event.start.minutes() === eventEnd.minutes() || eventEnd.hours() < this.event.start.hours()) {
                this.event.end = new moment(this.event.start).add(15, 'm');
                this.lastMoveTimeSpan = this.lastMoveTimeSpan - (((this.event.data.duration_hours * 60) + this.event.data.duration_minutes + (this.lastMoveTimeSpan * 15)) / 15) + 1;
            } else {
                this.event.end = eventEnd;
            }
        }

    }

    private onMouseUp() {
        this.mouseUpListener();
        this.mouseMoveListener();

        if (!this.canEdit) {
            return;
        }

        if (this.mouseLast.pageY != this.mouseStart.pageY) {
            let durationMinutes = +this.event.data.duration_hours * 60 + +this.event.data.duration_minutes + this.lastMoveTimeSpan * 15;
            this.event.data.duration_hours = Math.floor(durationMinutes / 60);
            this.event.data.duration_minutes = durationMinutes - this.event.data.duration_hours * 60;
            this.model.data.duration_minutes = this.event.data.duration_minutes;
            this.model.data.duration_hours = this.event.data.duration_hours;

            // save the event
            this.event.saving = true;
            this.model.save()
                .subscribe(data => {
                    this.event.saving = false;
                });

            // emit to rearrange on the sheet
            this.rearrange.emit();
        }
        this.mouseStart = undefined;
        this.mouseLast = undefined;
        this.event.resizing = false;
        this.lastMoveTimeSpan = 0;
    }
}
