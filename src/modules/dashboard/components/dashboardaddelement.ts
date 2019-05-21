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
 * @module ModuleDashboard
 */
import {Component, EventEmitter} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {recent} from '../../../services/recent.service';
import {backend} from '../../../services/backend.service';
import {fts} from '../../../services/fts.service';
import {metadata} from '../../../services/metadata.service';

@Component({
    selector: 'dashboard-add-element',
    templateUrl: './src/modules/dashboard/templates/dashboardaddelement.html',
    providers: [model]
})
export class DashboardAddElement {

    public self: any = {};
    private dashboardDashlets: Array<any> = [];
    private kreports: Array<any> = [];
    private dashletName: string = '';
    private dashletComponent: string = '';
    private reportFilterKey: string = '';
    private dashlettype: string = 'Generic';
    private dashletmodule: string = '*';
    private isLoading: boolean = false;
    private addDashlet: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private language: language,
        private fts: fts,
        private model: model,
        private recent: recent,
        private metadata: metadata,
        private backend: backend
    ) {
    }

    get noData() {
        let noData = false;
        if (this.getType() == 'Generic' && this.dashboardDashletsFiltered.length == 0)
            noData = true;
        if (this.getType() == 'Reporter' && this.kreportsFiltered.length == 0)
            noData = true;
        return noData;
    }

    get dashletType() {
        return this.dashlettype;
    }

    set dashletType(value) {
        this.dashletModule = '*';
        this.reportFilterKey = '';
        this.dashlettype = value;
        if (this.getType() == 'Reporter' && this.noData) this.getKreports();
        if (this.getType() == 'Generic' && this.noData) this.getDashlets();
    }

    get dashboardDashletsFiltered(): any[] {
        let filteredDashlets = this.dashboardDashlets;
        if (this.dashletModule != '*')
            filteredDashlets = filteredDashlets.filter(dashlet => dashlet.module == this.dashletModule);

        if (this.reportFilterKey.length > 0) {
            filteredDashlets = filteredDashlets.filter(dashlet => dashlet.label
                .replace(/_/gi, ' ')
                .toLowerCase()
                .indexOf(this.reportFilterKey.toLowerCase()) !== -1);
        }
        return filteredDashlets;
    }

    get kreportsFiltered(): any[] {
        let filteredKreports;
        switch (this.dashletType) {
            case 'ReporterVisualizationDashlet':
                filteredKreports = this.filterReportsType('ReporterVisualizationDashlet');
                break;
            case 'ReporterPresentationDashlet':
                filteredKreports = this.filterReportsType('ReporterPresentationDashlet');
                break;
        }

        if (this.dashletModule != '*')
            filteredKreports = filteredKreports.filter(report => report.report_module == this.dashletModule);

        if (this.reportFilterKey.length > 0) {
            filteredKreports = filteredKreports.filter(kreport => {
                return kreport.name.toLowerCase().indexOf(this.reportFilterKey.toLowerCase()) !== -1 ||
                    kreport.description.toLowerCase().indexOf(this.reportFilterKey.toLowerCase()) !== -1;
            });
        }

        return filteredKreports;
    }

    get modules() {
        let modules;
        if (this.getType() == 'Generic')
            modules = this.metadata.getModules().filter(module => this.dashboardDashlets.some(dashlet => dashlet.module == module));
        switch (this.dashletType) {
            case 'ReporterVisualizationDashlet':
                modules = this.metadata.getModules().filter(module => this.filterReportsType('ReporterVisualizationDashlet').some(kreport => kreport.report_module == module));
                break;
            case 'ReporterPresentationDashlet':
                modules = this.metadata.getModules().filter(module => this.filterReportsType('ReporterPresentationDashlet').some(kreport => kreport.report_module == module));
                break;
        }
        return modules;
    }

    get dashletModule() {
        return this.dashletmodule;
    }

    set dashletModule(value) {
        this.dashletmodule = value;
    }

    public ngOnInit() {
        switch (this.getType()) {
            case 'Reporter':
                this.dashletType = this.dashletComponent;
                this.getKreports();
                break;
            case 'Generic':
                this.getDashlets();
                break;
        }
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private trackByFnModule(index, item) {
        return index;
    }

    private getDashlets() {
        this.isLoading = true;
        this.backend.getRequest('dashboards/dashlets')
            .subscribe((dashboardDashlets: any) => {
                this.dashboardDashlets = dashboardDashlets;
                this.isLoading = false;
            });
    }

    private getKreports() {
        this.isLoading = true;
        let fields = ["id", "name", "description", "report_module", "integration_params"];
        this.backend.getRequest('module/KReports', {fields: fields})
            .subscribe((kreports: any) => {
                this.kreports = kreports.list;
                this.isLoading = false;
            });
    }

    private getIcon(icon) {
        return (icon && icon.split(':')[1]) ? icon.split(':')[1] : icon;
    }

    private getSprite(icon) {
        return (icon && icon.split(':')[1]) ? icon.split(':')[0] : 'standard';
    }

    private filterReportsType(type) {
        let filteredKreports;
        switch (type) {
            case 'ReporterVisualizationDashlet':
                filteredKreports = this.filteredKreports('dashletVisualization');
                break;
            case 'ReporterPresentationDashlet':
                filteredKreports = this.filteredKreports('dashletPresentation');
                break;
        }
        return filteredKreports;
    }

    private filteredKreports(property) {
        let filteredKreports;
        filteredKreports = this.kreports.filter(kreport => {
            if (kreport.integration_params) {
                let integrationParams = JSON.parse(kreport.integration_params);
                if (integrationParams.hasOwnProperty('kpublishing'))
                    if (integrationParams.kpublishing.hasOwnProperty(property))
                        return integrationParams.kpublishing[property] == 'on';
            }
        });

        return filteredKreports;
    }

    private getType() {
        return this.dashletType ? this.dashletType.indexOf('Reporter') === 0 ? 'Reporter' : 'Generic' : '';
    }

    private close() {
        this.addDashlet.emit(false);
        this.self.destroy();

    }

    private save(id) {

        if (!id) return false;
        let component = '';
        let componentconfig: any = {},
            dashletconfig: any = {},
            module: string = '',
            icon: string = '',
            acl_action: string = '',
            dashlet_id: string = '',
            label: string = '';

        switch (this.dashletType) {
            case 'ReporterVisualizationDashlet':
            case 'ReporterPresentationDashlet':
                component = this.dashletType;
                componentconfig = {reportid: id};
                module = 'KReports';
                break;
            case 'Generic':
                let dashlet: any = this.dashboardDashlets.filter((dashlet) => dashlet.id == id)[0];
                component = dashlet.component;
                dashlet_id = dashlet.id;
                dashletconfig = dashlet.componentconfig ? JSON.parse(dashlet.componentconfig) : '';
                module = dashlet.module;
                label = dashlet.label;
                icon = dashlet.icon;
                acl_action = dashlet.acl_action;
                break;
        }

        this.addDashlet.emit({
            'name': this.dashletName,
            'component': component,
            'componentconfig': componentconfig,
            'dashletconfig': dashletconfig,
            'module': module,
            'label': label,
            'icon': icon,
            'acl_action': acl_action,
            'dashlet_id': dashlet_id
        });

        this.self.destroy();
    }

}