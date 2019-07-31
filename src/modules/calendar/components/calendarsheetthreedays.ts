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
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';
import {backend} from "../../../services/backend.service";

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'calendar-sheet-three-days',
    templateUrl: './src/modules/calendar/templates/calendarsheetthreedays.html'
})
export class CalendarSheetThreeDays implements OnChanges, AfterViewInit {

    @Output() public navigateday: EventEmitter<any> = new EventEmitter<any>();
    public sheetDays: any[] = [];
    @ViewChild('calendarsheet', {read: ViewContainerRef}) private calendarsheet: ViewContainerRef;
    @ViewChild('headercontainer', {read: ViewContainerRef}) private headerContainer: ViewContainerRef;
    @ViewChild('scrollcontainer', {read: ViewContainerRef}) private scrollContainer: ViewContainerRef;
    @Input() private setdate: any = {};
    @Input('userscalendars') private usersCalendars: any[] = [];
    @Input('othercalendars') private otherCalendars: any[] = [];
    @Input('googleisvisible') private googleIsVisible: boolean = true;
    @Input('footercontainer') private footerContainer: any = undefined;
    @Input('calendarcontent') private calendarContent: any = undefined;
    private sheetHours: any[] = [];
    private sheetTopMargin: number = 0;
    private ownerEvents: any[] = [];
    private ownerMultiEvents: any[] = [];
    private userEvents: any[] = [];
    private userMultiEvents: any[] = [];
    private otherEvents: any[] = [];
    private googleEvents: any[] = [];
    private googleMultiEvents: any[] = [];

    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private elementRef: ElementRef,
                private cdr: ChangeDetectorRef,
                private backend: backend,
                private calendar: calendar) {
        this.buildHours();
        this.sheetDays = this.buildSheetDays();
    }

    get offset() {
        return moment.tz(moment.tz.guess()).format('z Z');
    }

    get sheetTimeWidth() {
        return this.calendar.sheetTimeWidth;
    }

    get isDashlet() {
        return this.calendar.isDashlet;
    }

    get allEvents() {
        return this.calendar.arrangeEvents(this.ownerEvents.concat(this.userEvents, this.googleEvents));
    }

    get allMultiEvents() {
        return this.ownerMultiEvents.concat(this.otherEvents, this.userMultiEvents, this.googleMultiEvents);
    }

    get startDate() {
        return new moment(this.setdate).hour(this.calendar.startHour).minute(0).second(0);
    }

    get endDate() {
        return new moment(this.startDate).add(moment.duration(2, 'd')).hour(this.calendar.endHour);
    }

    get dayTextContainerClass() {
        return this.isDashlet ? 'slds-grid slds-grid--vertical-align-center' : '';
    }

    get dayTextClass() {
        return this.isDashlet ? 'slds-text-heading--medium' : 'slds-text-body--regular';
    }

    get dateTextClass() {
        return this.isDashlet ? 'slds-text-heading--medium' : 'slds-text-heading--large';
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.sheetDays = this.buildSheetDays();
        if (changes.setdate) {
            this.getEvents();
        }

        if (changes.usersCalendars || changes.setdate) {
            this.getUsersEvents();
        }
        if (changes.otherCalendars || changes.setdate) {
            this.getOtherEvents();
        }
        if (changes.googleIsVisible || changes.setdate) {
            this.getGoogleEvents();
        }
    }

    public ngAfterViewInit() {
        this.calendarsheet.element.nativeElement.scrollTop = 8 * this.calendar.sheetHourHeight;
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private trackByFnDate(index, item) {
        return index;
    }

    private arrangeMultiEvents() {
        this.sheetDays.forEach(day => day.items = []);
        for (let event of this.allMultiEvents) {
            for (let day of this.sheetDays) {
                for (let eventDay = moment(event.start); eventDay.diff(event.end) <= 0; eventDay.add(1, 'days')) {
                    if (eventDay.date() == day.date.date() && !day.items.some(itemsEvent => itemsEvent.id == event.id)) {
                        day.items.push(event);
                    }
                }
            }
        }
        this.sheetDays.forEach(day => {
            day.items = day.items.filter(event => (event.hasOwnProperty("visible") && event.visible) || !event.hasOwnProperty("visible"));
            day.items.sort((a, b) => {
                if (a.start.isBefore(b.start)) {
                    return -1;
                } else if (a.start.diff(a.end, 'days') < b.start.diff(b.end, 'days')) {
                    return -1;
                }
                return 0;
            });
        });
        this.allMultiEvents.forEach(event => {
            let itemIdx = null;
            this.sheetDays.forEach(day => {
                day.items.forEach((item, idx) => {
                    if (item.id == event.id) {
                        if (itemIdx != null && event.end.diff(event.start, 'days') > 0) {
                            day.items.splice(idx, 1);
                            day.items.splice(itemIdx, 0, event);
                        } else {
                            itemIdx = idx;
                        }
                    }
                });
            });
        });
    }

    private correctHours(events) {
        events.forEach(event => {
            if (!event.isMulti) {
                let endInRange = event.end.hour() > this.calendar.startHour && event.start.hour() < this.calendar.startHour;
                let startInRange = event.start.hour() < this.calendar.endHour && event.end.hour() > this.calendar.endHour;
                if (endInRange) {
                    event.start = event.start.hour(this.calendar.startHour).minute(0);
                }
                if (startInRange) {
                    event.end = event.end.hour(this.calendar.endHour).minute(59);
                }
            }
        });
        return events;
    }

    private getEvents() {
        this.ownerEvents = [];
        this.ownerMultiEvents = [];
        this.arrangeMultiEvents();

        this.calendar.loadEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    events = this.correctHours(events);
                    events = this.filterEvents(events);
                    this.ownerEvents = events.filter(event => !event.isMulti);
                    this.ownerMultiEvents = events.filter(event => event.isMulti);
                    this.arrangeMultiEvents();
                }
            });
    }

    private getGoogleEvents() {
        this.googleEvents = [];
        this.googleMultiEvents = [];
        this.arrangeMultiEvents();
        if (!this.googleIsVisible || this.calendar.isMobileView) {
            return;
        }

        this.calendar.loadGoogleEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    events = this.correctHours(events);
                    events = this.filterEvents(events);
                    this.googleEvents = events.filter(event => !event.isMulti);
                    this.googleMultiEvents = events.filter(event => event.isMulti);
                    this.arrangeMultiEvents();
                }
            });
    }

    private getUsersEvents() {
        this.userEvents = [];
        this.userMultiEvents = [];
        this.arrangeMultiEvents();
        if (this.calendar.isMobileView) {
            return;
        }

        for (let calendar of this.calendar.usersCalendars) {
            if (!calendar.visible) {
                continue;
            }
            this.calendar.loadEvents(this.startDate, this.endDate, calendar.id)
                .subscribe(events => {
                    if (events.length > 0) {
                        events = this.correctHours(events);
                        events = this.filterEvents(events);
                        events.forEach(event => {
                            event.color = calendar.color;
                            event.visible = calendar.visible;
                            if (!event.isMulti) {
                                this.userEvents.push(event);
                            } else {
                                this.userMultiEvents.push(event);
                                this.arrangeMultiEvents();
                            }
                        });
                    }
                });
        }
    }

    private getOtherEvents() {
        this.otherEvents = [];
        this.arrangeMultiEvents();
        if (this.calendar.isMobileView) {
            return;
        }

        for (let calendar of this.calendar.otherCalendars) {
            if (!calendar.visible) {
                continue;
            }
            this.calendar.loadEvents(this.startDate.hour(0).minute(0).second(0), this.endDate.hour(0).minute(0).second(0), calendar.id, true)
                .subscribe(events => {
                    if (events.length > 0) {
                        events.forEach(event => {
                            event.color = calendar.color;
                            event.visible = calendar.visible;
                            this.otherEvents.push(event);
                            this.arrangeMultiEvents();
                        });
                    }
                });
        }
    }

    private filterEvents(events, type = undefined) {
        return events.filter(event => event.end.hour() > this.calendar.startHour || event.start.hour() < this.calendar.endHour || ('absence' == event.type));
    }

    private buildSheetDays() {
        let sheetDays = [];
        let d = 0;
        while (d < 3) {
            let focDate = new moment(this.setdate);
            focDate = focDate.add(d, 'days');
            sheetDays.push({index: d, date: moment(focDate), day: moment(focDate).day(), items: []});
            d++;
        }
        return sheetDays;
    };

    private isTodayStyle(date) {
        let today = new moment();
        let isToday = today.year() === date.year() && today.month() === date.month() && today.date() == date.date();
        return {
            color: isToday ? this.calendar.todayColor : 'inherit'
        };
    }

    private getEventStyle(event) {
        let day = this.buildSheetDays().find(day => day.day == event.start.day()) || 0;
        let startminutes = (event.start.hour() - this.calendar.startHour) * 60 + event.start.minute();
        let endminutes = (event.end.hour() - this.calendar.startHour) * 60 + event.end.minute();
        let scrollOffset = this.scrollContainer.element.nativeElement.getBoundingClientRect().width;
        let sheetWidth = this.calendarContent.clientWidth - this.calendar.sidebarWidth - scrollOffset;
        let itemWidth = ((sheetWidth - this.sheetTimeWidth) / 3) / (event.maxOverlay > 0 ? event.maxOverlay : 1);
        let left = this.sheetTimeWidth + ((sheetWidth - this.sheetTimeWidth) / 3 * day.index) + (itemWidth * event.displayIndex);
        let top = this.calendar.sheetHourHeight / 60 * startminutes;
        let height = this.calendar.sheetHourHeight / 60 * (endminutes - startminutes);

        return {
            left: left + 'px',
            width: itemWidth + 'px',
            top: top + 'px',
            height: height + 'px',
            'z-index': event.resizing ? 20 : 15,
            'border-bottom': event.resizing ? '1px dotted #fff' : 0
        };
    }

    private getMultiEventStyle(event): any {
        let eventI = null;
        let scrollOffset = this.scrollContainer.element.nativeElement.getBoundingClientRect().width;
        let sheetWidth = this.calendarContent.clientWidth - this.calendar.sidebarWidth - scrollOffset;
        let multiEventsContainerWidth = (sheetWidth - this.sheetTimeWidth) / 3;
        let startDate = new moment(this.setdate).hour(0).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(3, 'd'));
        let startDateDifference = ((+event.start.diff(startDate, 'days') > 0) ? +event.start.diff(startDate, 'days') : 0);
        let endDateDifference = (+event.end.diff(endDate, 'days') > 0) ? 0 : Math.abs(+event.end.diff(endDate, 'days'));
        let left = startDateDifference * multiEventsContainerWidth;
        let width = (3 - (startDateDifference + endDateDifference)) * multiEventsContainerWidth;

        this.sheetDays.some(day => {
            if (day.items.indexOf(event) > -1) {
                eventI = day.items.indexOf(event);
                return true;
            }
        });
        return {
            width: width + "px",
            left: left + "px",
            height: this.calendar.multiEventHeight + "px",
            top: (this.calendar.multiEventHeight * eventI) + "px",
        };
    }

    private getMultiEventsContainerStyle() {
        let eventsHeight = 1;
        for (let day of this.sheetDays) {
            eventsHeight = day.items.length > eventsHeight ? day.items.length : eventsHeight;
        }
        return {height: (this.calendar.multiEventHeight * eventsHeight) + 'px'};
    }

    private displayDate(type, date) {
        switch (type) {
            case 'day':
                return date.format('ddd');
            case 'date':
                return date.format(this.isDashlet ? 'D, MMM' :'D');
        }
    }

    private getTimeColStyle() {
        return {
            width: this.sheetTimeWidth + 'px'
        };
    }

    private getDayColStyle() {
        return {width: 'calc(100% / 3)'};
    }

    private getDaysContainerStyle() {
        let scrollOffset = this.scrollContainer.element.nativeElement.getBoundingClientRect().width;
        let sheetWidth = this.calendarContent.clientWidth - this.calendar.sidebarWidth - scrollOffset;
        return {
            width: (sheetWidth - this.sheetTimeWidth) + 'px'
        };
    }

    private buildHours() {
        this.sheetHours = [];
        let i = this.calendar.startHour;
        while (i <= this.calendar.endHour) {
            this.sheetHours.push(i);
            i++;
        }
    }

    private getSheetStyle() {
        if (this.footerContainer && this.calendar.asPicker) {
            return {
                height: (this.footerContainer.offsetTop - this.calendarsheet.element.nativeElement.offsetTop) + 'px',
                'margin-top': '-1px'
            };
        }
        return {
            height: 'calc(100% - ' + this.headerContainer.element.nativeElement.clientHeight + 'px)',
            'margin-top': '-1px'
        };
    }

    private getHourDividerStyle(hour) {
        return {
            top: (this.sheetTopMargin + this.calendar.sheetHourHeight * hour) + 'px'
        };
    }

    private getHalfHourDividerStyle(hour) {
        return {
            top: (this.sheetTopMargin + this.calendar.sheetHourHeight * hour + this.calendar.sheetHourHeight / 2) + 'px',
            left: this.sheetTimeWidth + 'px',
            width: 'calc(100% - ' + this.sheetTimeWidth + 'px)'
        };
    }

    private getHourLabelStyle(hour) {
        return {
            top: (this.sheetTopMargin + this.calendar.sheetHourHeight * hour) + 'px',
            width: this.sheetTimeWidth + 'px'
        };
    }

    private getDayDividerStyle(day) {
        let scrollOffset = this.scrollContainer.element.nativeElement.getBoundingClientRect().width;
        let sheetWidth = this.calendarContent.clientWidth - this.calendar.sidebarWidth - scrollOffset;
        return {
            left: (this.sheetTimeWidth + ((sheetWidth - this.sheetTimeWidth) / 3 * day)) + 'px',
            top: '0px',
            height: (this.calendar.sheetHourHeight * this.sheetHours.length) + 'px'
        };
    }

    private gotoDay(dow) {
        if (this.calendar.asPicker) {
            return;
        }
        let navigateDate = moment(dow);
        this.navigateday.emit(navigateDate);
    }

    private getDropTargetStyle(hour, day) {
        let scrollOffset = this.scrollContainer.element.nativeElement.getBoundingClientRect().width;
        let sheetWidth = this.calendarContent.clientWidth - this.calendar.sidebarWidth - scrollOffset;
        return {
            left: (this.sheetTimeWidth + ((sheetWidth - this.sheetTimeWidth) / 3 * day)) + 'px',
            width: ((sheetWidth - this.sheetTimeWidth) / 3) + 'px',
            top: (this.sheetTopMargin + this.calendar.sheetHourHeight * hour) + 'px',
            height: this.calendar.sheetHourHeight + 'px',
        };
    }

    private notLastHour(hour) {
        return hour < this.sheetHours.length;
    }
}
