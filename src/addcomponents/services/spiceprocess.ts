/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {EventEmitter, Injectable} from '@angular/core';

import {backend} from '../../services/backend.service';

@Injectable()
export class spiceprocess {

    module: string = '';
    id: string = '';
    stages: Array<any> = [];
    drop$: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend) {
    }

    getStages() {
        this.backend.getRequest('spicebeanguide/' + this.module + (this.id !== '' ? '/' + this.id : '')).subscribe(response => {
            this.stages = response;
        })
        /*
         this.http.get(this.configurationService.getBackendUrl() + '/spicebeanguide/' + this.module + (this.id !== '' ?  '/' + this.id : '') + '?&sessionid=' + this.session.authData.sessionId)
         .subscribe(res => {
         var response = res.json()
         this.stages = response;
         });
         */
    }

    getStageData(stage) {
        let stageData: any = {};

        this.stages.some(thisStage => {
            if (thisStage.stage == stage) {
                stageData = thisStage.stagedata;
                return true;
            }
        })

        return stageData;
    }

    dropitem(id, stage){
        //console.log('dropped');
        this.drop$.emit({id: id, stage: stage});
    }

}
