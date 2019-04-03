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

import {EventEmitter, Injectable} from "@angular/core";
import {broadcast} from "./broadcast.service";
import {backend} from "./backend.service";
import {metadata} from "./metadata.service";
import {modelutilities} from "./modelutilities.service";

/**
 * @ignore
 */
declare var moment: any;

@Injectable()
export class relatedmodels {
    public module = '';
    public relatedModule = '';
    public linkName = '';
    public modulefilter = '';
    public id = '';
    public items: any[] = [];
    public items$ = new EventEmitter();
    public count = 0;
    public loaditems = 5;
    private relationshipFields: string[] = [];
    public isloading = true;
    public sort: any = {
        sortfield: '',
        sortdirection: 'ASC'
    };
    private lastLoad: any = new moment();
    public sequencefield: string = null;

    private serviceSubscriptions: any[] = [];

    constructor(
        private metadata: metadata,
        private backend: backend,
        private broadcast: broadcast,
        private modelutilities: modelutilities
    ) {
        // subscribe to the broadcast service
        this.serviceSubscriptions.push(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );
    }

    public stopSubscriptions() {
        for (let subscription of this.serviceSubscriptions) {
            subscription.unsubscribe();
        }
    }

    get sortfield() {
        return this.sort.sortfield;
    }

    set sortfield(field) {
        if (this.sort.sortfield == field) {
            this.sort.sortdirection = this.sort.sortdirection == "ASC" ? "DESC" : "ASC";
        } else {
            this.sort.sortfield = field;
            this.sort.sortdirection = "ASC";
        }

        this.getData();
    }

    get _linkName() {
        return this.linkName != "" ? this.linkName : this.relatedModule.toLowerCase();
    }

    get sortBySequencefield() {
        if ( this.sequencefield && !this.modulefilter && !this.sort.sortfield ) return true;
        else return false;
    }

    private handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagetype.indexOf("model") === -1 || message.messagedata.module !== this.relatedModule) {
            return;
        }

        switch (message.messagetype) {
            case "model.delete":
                this.items.some( ( item, i ) => {
                    if( item.id === message.messagedata.id ) {
                        this.items.splice( i, 1 );
                        this.count--;
                        // emit that a change has happened
                        this.items$.emit( this.items );
                        return true;
                    }
                });
                break;
            case "model.save":
                let eventHandled = false;
                for (let item of this.items) {
                    if (item.id === message.messagedata.id) {
                        for (let key in item) {
                            if (item.hasOwnProperty(key) && message.messagedata.data.hasOwnProperty(key)) {
                                item[key] = message.messagedata.data[key];
                            }
                        }
                        eventHandled = true;
                        this.sortItems();
                    }
                }

                if (!eventHandled || this.modulefilter) {
                    this.getData(true);
                } else {
                    this.sortItems();
                }

                break;
        }
    }

    public getLastLoadTime(): string {
        return this.lastLoad.format("HH:mm");
    }

    public getData(silent: boolean = false) {
        // check if we can list per acl
        if (this.metadata.checkModuleAcl(this.relatedModule, "list") === false) {
            return false;
        }

        // set that we are loading
        if (!silent) {
            this.resetData();
            this.isloading = true;
        }
        let params = {
            getcount: true,
            offset: 0,
            limit: this.loaditems,
            modulefilter: this.modulefilter,
            relationshipFields: JSON.stringify(this.relationshipFields),
            sort: this.sort.sortfield ? JSON.stringify(this.sort) : ""
        };

        this.backend.getRequest("module/" + this.module + "/" + this.id + "/related/" + this._linkName, params).subscribe(
            (response: any) => {

                // reset the list .. to make sure nobody added in the meantime ... the new data is the truth
                this.items = [];

                // get the count
                this.count = parseInt(response.count, 10);

                // count .. this is not an array but an object
                for (let key in response.list) {
                    if (response.list.hasOwnProperty(key)) {
                        response.list[key].relid = key;

                        response.list[key] = this.modelutilities.backendModel2spice(this.relatedModule, response.list[key]);

                        this.items.push(response.list[key]);
                    }
                }

                // set loaded
                this.isloading = false;

                // sort
                this.sortItems();

                // set the load time
                this.lastLoad = new moment();

                // emit that a change has happened
                this.items$.emit(this.items);
            }
        );
    }

    private sortItems() {

        let sortfield: string;
        let sortdirection: string;
        if ( this.sort.sortfield ) {
            sortfield = this.sort.sortfield;
            sortdirection = this.sort.sortdirection;
        } else if ( this.sortBySequencefield ) {
            sortfield = this.sequencefield;
            sortdirection = 'ASC';
        }

        if ( sortfield ) {
            this.items.sort((a, b) => {
                let sortval = 0;
                // check if we can sort as integer
                if (!isNaN(parseInt(a[sortfield], 10)) && !isNaN(parseInt(b[sortfield], 10))) {
                    sortval = parseInt(a[sortfield], 10) > parseInt(b[sortfield], 10) ? 1 : -1;
                } else {
                    sortval = a[sortfield] > b[sortfield] ? 1 : -1;
                }
                return sortdirection == 'ASC' ? sortval : (sortval * -1);
            });
        }

    }

    private resetData() {
        this.items = [];
    }

    public addItems(items) {
        let relatedIds: any[] = [];
        for (let item of items) {
            relatedIds.push(item.id);
        }

        this.backend.postRequest("module/" + this.module + "/" + this.id + "/related/" + this._linkName, [], relatedIds).subscribe(res => {

            for (let item of items) {
                // check if we shoudl add this item or it is already in the related models list
                let itemfound = false;
                this.items.some(curitem => {
                    if (curitem.id == item.id) {
                        itemfound = true;
                        return true;
                    }
                });
                if (!itemfound) {
                    this.items.push(item);
                    this.count++;
                }
            }

            // emit that a change has happened
            this.items$.emit(this.items);

            // this.items = this.items.concat(items);
            // this.count += items.length;
        });
    }

    public setItem(item) {
        this.backend.putRequest("module/" + this.module + "/" + this.id + "/related/" + this._linkName, [], this.modelutilities.spiceModel2backend(this.relatedModule, item)).subscribe(res => {

        });
    }

    public deleteItem(id) {
        let relatedids = [];
        relatedids.push(id);
        let params = {
            relatedids: relatedids
        };
        this.backend.deleteRequest("module/" + this.module + "/" + this.id + "/related/" + this._linkName, params).subscribe(res => {
            this.items.some((item, index) => {
                if (item.id == id) {
                    this.items.splice(index, 1);
                    this.count--;

                    // emit that a change has happened
                    this.items$.emit(this.items);

                    // return
                    return true;
                }
            });
        });
    }
}
