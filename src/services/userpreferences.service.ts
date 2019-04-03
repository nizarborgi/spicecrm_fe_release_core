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
 * @module services
 */
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs';
import {backend} from './backend.service';
import {toast} from './toast.service';
import {language} from './language.service';
import {broadcast} from './broadcast.service';
import {configurationService} from './configuration.service';

/**
 * @ignore
 */
declare var moment: any;
/**
 * @ignore
 */
declare var _: any;

@Injectable()
export class userpreferences {

    public preferences: any = {
        global: this.configuration.getData('globaluserpreferences')
    };
    // toUse is a "shortcut" to preferences.global. For easier code.
    // The user preferences in toUse (like preferences.global) will be available anytime, even when the user hasn´t set the preferences yet.
    // Use toUse, if you need any preference, for example "toUse.dec_sep".
    public toUse: any;

    // unchangedPreferences stores the preferences as they are delivered by the KREST api. Don´t use this, when you need any value (use "toUse" instead).
    // Use this object when the user edits the preferences (record detail view of module "users").
    public unchangedPreferences: any = {
        global: {}
    };

    public preferencesComplete = true; // When false, indicates the need to ask the user for the preferences.

    private defaults = {
        currency: -99,
        datef: 'd.m.Y',
        dec_sep: ',',
        num_grp_sep: '.',
        timef: 'H:i',
        timezone: 'Europe/Vienna',
        default_currency_significant_digits: 2,
        default_locale_name_format: 'l, f',
        week_day_start: 0
    };

    public formats = {nameFormats: [], loaded: false};

    constructor(private backend: backend, private toast: toast, private configuration: configurationService, private language: language, private broadcast: broadcast) {
        this.toUse = this.preferences.global;

        this.broadcast.message$.subscribe(msg => this.handleMessage(msg));
    }

    private handleMessage(message) {
        switch (message.messagetype) {
            case "loader.completed":
                if (message.messagedata == 'loadUserData') {
                    let prefs = this.configuration.getData('globaluserpreferences');
                    this.preferences.global = _.extendOwn(this.preferences.global, prefs);
                    this.unchangedPreferences.global = _.clone(prefs);
                    this.completePreferencesWithDefaults();
                }
                break;
        }
    }

    public getPreferences(loadhandler: Subject<string>) {
        this.loadPreferences().subscribe((ret) => {
            loadhandler.next('getPreferences');
        });
    }

    public loadPreferences(category = 'global'): Observable<any> {
        let retSubject: Subject<any> = new Subject<any>();

        this.backend.getRequest('user/preferences/' + category).subscribe((prefs) => {
            this.preferences[category] = _.extendOwn(this.preferences[category], prefs);
            if (category === 'global') {
                this.unchangedPreferences.global = _.clone(prefs);
                this.completePreferencesWithDefaults();
            } else {
                this.unchangedPreferences[category] = _.clone(prefs);
            }
            retSubject.next(prefs);
        });

        return retSubject.asObservable();
    }

    // Completes the global preferences with default values.
    // This case shouldn´t happen, the global preferences of a user should always be set (by the user).
    // Just in case it´s not and to ensure proper work of the UI:
    private completePreferencesWithDefaults() {
        let uncomplete = false;
        _.each(this.defaults, (value, key) => {
            if (typeof this.preferences.global[key] === 'string') {
                if (!this.preferences.global[key]) {
                    this.preferences.global[key] = value;
                    uncomplete = true;
                }
            } else {
                if (this.preferences.global[key] === undefined || this.preferences.global[key] === null) {
                    this.preferences.global[key] = value;
                    uncomplete = true;
                }
            }
        });
        this.preferencesComplete = !uncomplete; // When false, indicates the need to ask the user for the preferences.
    }

    public getPreference(name, category = 'global') {
        try {
            return this.preferences[category][name];
        } catch (e) {
            return false;
        }
    }

    public setPreference(name, value, save = true, category = 'global') {
        if (save) {
            let prefs = {};
            prefs[name] = value;
            this.backend.postRequest('user/preferences/' + category, {}, prefs).subscribe((prefstatus) => {

                // set the preference
                if (!this.preferences[category]) this.preferences[category] = {};
                this.preferences[category][name] = value;

                // ToDo: check what this is for
                if (!this.unchangedPreferences[category]) this.unchangedPreferences[category] = {};
                this.unchangedPreferences[category][name] = value;

                this.completePreferencesWithDefaults();
            });
        } else {
            if(!this.preferences[category]) this.preferences[category] = {};
            this.preferences[category][name] = value;
            this.completePreferencesWithDefaults();
        }
    }

    public setPreferences(prefs, category = 'global') {
        const saved = new Subject();
        this.backend.postRequest('user/preferences/' + category, {}, prefs).subscribe(
            (savedprefs) => {
                for (let prop of this.preferences[category]) {
                    if (savedprefs.hasOwnProperty(prop)) this.preferences[category][prop] = savedprefs[prop];
                    else delete this.preferences[category][prop];
                }
                this.unchangedPreferences[category] = savedprefs;
                this.completePreferencesWithDefaults();
                saved.next(true);
            },
            (error) => {
                saved.error(error);
            }
        );
        return saved;
    }

    public getDateFormat() {
        if (this.toUse.datef) {
            let dateFormat: string = this.toUse.datef;
            return this.jsDateFormat2momentDateFormat(dateFormat);
        } else {
            return 'YYYY-MM-DD';
        }
    }

    public jsDateFormat2momentDateFormat(format) {
        return format.replace('Y', 'YYYY').replace('m', 'MM').replace('d', 'DD');
    }

    public getTimeFormat() {
        if (this.toUse.timef) {
            let timeFormat: string = this.toUse.timef;
            return this.jsTimeFormat2momentTimeFormat(timeFormat);
        } else {
            return 'hh:mm';
        }
    }

    public jsTimeFormat2momentTimeFormat(format) {
        return format.replace('H', 'HH').replace('h', 'hh').replace('i', 'mm');
    }

    public needFormats() {
        if (!this.formats.loaded) {
            this.loadFormats();
        }
    }

    private loadFormats(): Observable<any> {
        let retSubject: Subject<boolean> = new Subject<boolean>();

        this.formats.nameFormats.length = 0;
        this.formats.loaded = false;
        this.backend.getRequest('user/preferencesformats').subscribe((formats) => {
            for (let item of formats.nameFormats) {
                this.formats.nameFormats.push({name: item, example: this.translateNameFormat(item)});
            }
            this.formats.loaded = true;
            retSubject.next(true);
        });

        return retSubject.asObservable();
    }

    private translateNameFormat(format: string): string {
        let translation = '';
        for (let i = 0; i < format.length; i++) {
            switch (format.charAt(i)) {
                case 't':
                    translation += this.language.getLabel('LBL_LOCALE_NAME_EXAMPLE_TITLE');
                    break;
                case 'f':
                    translation += this.language.getLabel('LBL_LOCALE_NAME_EXAMPLE_FIRST');
                    break;
                case 'l':
                    translation += this.language.getLabel('LBL_LOCALE_NAME_EXAMPLE_LAST');
                    break;
                case 's':
                    translation += this.language.getLabel('LBL_LOCALE_NAME_EXAMPLE_SALUTATION');
                    break;
                default:
                    translation += format.charAt(i);
            }
        }
        return translation;
    }

    /*
     * formatting functions
     * http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
     */
    public formatMoney(i, n = this.toUse.default_currency_significant_digits, x = 3, grpSep = this.toUse.num_grp_sep, decSep = this.toUse.dec_sep) {
        let re = '\\d(?=(\\d{' + x + '})+' + (n > 0 ? '\\D' : '$') + ')';
        let num = i.toFixed(Math.max(0, ~~n));
        return num.replace('.', decSep).replace(new RegExp(re, 'g'), '$&' + grpSep);
    }

    public formatDate(d) {
        return moment(d).format(this.getDateFormat());
    }

    public formatDateTime(d) {
        return moment(d).format(this.getDateFormat()) + ' ' + moment(d).format('HH:mm:ss');
    }

}
