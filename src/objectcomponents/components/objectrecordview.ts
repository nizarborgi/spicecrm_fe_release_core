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
 * @module ObjectComponents
 */
import {
    ComponentFactoryResolver, Component,
    ElementRef, OnInit, OnDestroy
} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {broadcast} from '../../services/broadcast.service';
import {favorite} from '../../services/favorite.service';
import {navigation} from '../../services/navigation.service';

@Component({
    selector: 'object-recordview',
    templateUrl: './src/objectcomponents/templates/objectrecordview.html',
    providers: [model]

})
export class ObjectRecordView implements OnInit, OnDestroy {
    private moduleName: any = '';
    private initialized: boolean = false;
    private componentRefs: any = [];
    private componentconfig: any = {};
    private componentSubscriptions: any[] = [];
    private listViewDefs: any = [];
    private componentSets: any = {};

    constructor(
        private broadcast: broadcast,
        private navigation: navigation,
        private activatedRoute: ActivatedRoute,
        private metadata: metadata,
        private componentFactoryResolver: ComponentFactoryResolver,
        private model: model,
        private favorite: favorite,
        private elementRef: ElementRef
    ) {
        this.componentSubscriptions.push(this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        }));

    }

    public ngOnInit() {
        this.moduleName = this.activatedRoute.params['value'].module;

        // set theenavigation paradigm
        this.navigation.setActiveModule(this.moduleName);

        // get the bean details
        this.model.module = this.moduleName;
        this.model.id = this.activatedRoute.params['value'].id;

        // set data to the FAV service
        this.favorite.enable(this.model.module, this.model.id);

        this.model.getData(true, 'detailview', true, true).subscribe(data => {
            this.navigation.setActiveModule(this.moduleName, this.model.id, data.summary_text);

        });

        this.buildContainer();

    }

    public ngOnDestroy() {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        for (let subscription of this.componentSubscriptions) {
            subscription.unsubscribe();
        }
    }

    private handleMessage(message: any) {
        switch (message.messagetype) {

            case 'model.save':
                if (this.model.module === message.messagedata.module && this.model.id === message.messagedata.id) {
                    this.model.data = message.messagedata.data;
                }
                break;
        }
    }

    private buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }
        this.componentconfig = this.metadata.getComponentConfig('ObjectRecordView', this.moduleName);
    }
}
