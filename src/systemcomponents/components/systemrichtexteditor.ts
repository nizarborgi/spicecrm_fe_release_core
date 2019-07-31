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
 * @module SystemComponents
 */

// from https://github.com/kolkov/angular-editor
import {
    Component, ElementRef,
    forwardRef,
    Inject,
    OnDestroy,
    Renderer2,
    ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DOCUMENT} from "@angular/common";

import {modal} from "../../services/modal.service";
import {systemrichtextservice} from "../services/systemrichtext.service";
import {MediaFileUploader} from "../../modules/mediafiles/components/mediafileuploader";

@Component({
    selector: "system-richtext-editor",
    templateUrl: "./src/systemcomponents/templates/systemrichtexteditor.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemRichTextEditor),
            multi: true
        }, systemrichtextservice
    ]
})
export class SystemRichTextEditor implements OnDestroy, ControlValueAccessor {

    @ViewChild('htmleditor') private htmlEditor: any;

    // for the value accessor
    private onChange: (value: string) => void;
    private onTouched: () => void;
    private _html: string = '';

    private isActive: boolean = false;
    private clickListener: any;
    private modalOpen = false;

    private block = 'default';
    private fontName = 'Tilium Web';
    private fontSize = '5';

    private tagMap = {
        BLOCKQUOTE: "indent",
        A: "link"
    };

    private select = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "PRE", "DIV"];

    constructor(private modal: modal, private renderer: Renderer2, private editorService: systemrichtextservice, @Inject(DOCUMENT) private _document: any, private elementRef: ElementRef,) {
    }

    public ngOnDestroy() {
        if(this.clickListener) {
            this.clickListener();
        }
    }

    /**
     * Executed command from editor header buttons
     * @param command string from triggerCommand
     */
    private executeCommand(command: string) {
        switch (command) {
            case 'openSourceEditor':
                this.openSourceEditor();
                break;
            case 'openEditorModal':
                this.openEditorModal();
                break;
            case 'openMediaFilePicker':
                this.openMediaFilePicker();
                break;
            default:
                if (this.isActive && command != '') {
                    this.editorService.executeCommand(command);
                }
                this.exec();
                break;
        }
        return;
    }

    /**
     *  focus the text area when the editor is focussed
     */
    private onEditorClick(e) {
        // check if we are active already
        if (!this.isActive) {
            this.isActive = true;
            this.htmlEditor.nativeElement.focus();

            // listen to the click event if it is ousoide of the current elements scope
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event));
        }
        e.stopPropagation();
    }

    private onDocumentClick(event: MouseEvent) {
        if (!this.modalOpen && !this.elementRef.nativeElement.contains(event.target)) {
            this.isActive = false;
            this.clickListener();
        }
    }

    /**
     * Executed from the contenteditable section while the input property changes
     * @param html html string from contenteditable
     */
    private onContentChange(html: string): void {

        if (typeof this.onChange === 'function') {
            this.onChange(html);
        }

        this._html = html;
        return;
    }

    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Write a new value to the element.
     *
     * @param value value to be executed when there is a change in contenteditable
     */
    public writeValue(value: any): void {
        this._html = value ? value : '';
        this.renderer.setProperty(this.htmlEditor.nativeElement, 'innerHTML', this._html);
    }

    /**
     * toggles editor buttons when cursor moved or positioning
     *
     * Send a node array from the contentEditable of the editor
     */
    private exec() {
        let userSelection;
        if (window.getSelection) {
            userSelection = window.getSelection();
        }

        let a = userSelection.focusNode;
        const els = [];
        while (a && a.id !== 'editor') {
            els.unshift(a);
            a = a.parentNode;
        }

        // this.editorToolbar.triggerBlocks(els);
        this.triggerBlocks(els);
    }

    private openEditorModal() {
        this.modal.openModal('SystemTinyMCEModal').subscribe(componentRef => {
            /*
            componentRef.instance.content = this.ngModel;
            componentRef.instance.updateContent.subscribe(update => {
                this.fieldvalue = update;
                this.editor.setContent(update);
            })
            */
        });
    }

    private openMediaFilePicker() {
        this.modalOpen = true;
        this.modal.openModal('MediaFilePicker').subscribe(componentRef => {
            componentRef.instance.answer.subscribe(image => {
                if(image && image.upload) {
                    this.modal.openModal('MediaFileUploader').subscribe(uploadComponentRef => {
                        uploadComponentRef.instance.answer.subscribe(uploadimage => {
                            if (uploadimage) {
                                this.editorService.insertImage('https://cdn.spicecrm.io/' + uploadimage);
                            }
                            this.modalOpen = false;
                        });
                    });
                } else {
                    if (image && image.id) {
                        this.editorService.insertImage('https://cdn.spicecrm.io/' + image.id);
                    }
                    this.modalOpen = false;
                }
            });
        });
    }

    private openSourceEditor() {
        this.modal.openModal('SystemRichTextSourceModal').subscribe(componentRef => {
            componentRef.instance._html = this._html;
            componentRef.instance.html.subscribe(newHtml => {
                // update our internal value
                this._html = newHtml;

                // set the model value
                if (typeof this.onChange === 'function') {
                    this.onChange(newHtml);
                }

                // set the value to the editor
                this.renderer.setProperty(this.htmlEditor.nativeElement, 'innerHTML', this._html);
            });
        });
    }

    /*
     * for the toolbar
     */
    private commandIsActive(commandState) {
        // check the state
        return this.isActive && this._document.queryCommandState(commandState);
    }

    /**
     * trigger highlight editor buttons when cursor moved or positioning in block
     */
    private triggerBlocks(nodes: Node[]) {
        if (!this.isActive) {
            return;
        }

        let found = false;
        this.select.forEach(y => {
            const node = nodes.find(x => x.nodeName === y);
            if (node !== undefined && y === node.nodeName) {
                if (found === false) {
                    this.block = node.nodeName.toLowerCase();
                    found = true;
                }
            } else if (found === false) {
                this.block = 'default';
            }
        });

        found = false;
        /*
        if (this.customClasses) {
            this.customClasses.forEach((y, index) => {
                const node = nodes.find(x => {
                    if (x instanceof Element) {
                        return x.className === y.class;
                    }
                });
                if (node !== undefined) {
                    if (found === false) {
                        this.customClassId = index;
                        found = true;
                    }
                } else if (found === false) {
                    this.customClassId = -1;
                }
            });
        }
        */

        /*
        Object.keys(this.tagMap).map(e => {
            const elementById = this._document.getElementById(this.tagMap[e] + '-' + this.id);
            const node = nodes.find(x => x.nodeName === e);
            if (node !== undefined && e === node.nodeName) {
                this._renderer.addClass(elementById, "active");
            } else {
                this._renderer.removeClass(elementById, "active");
            }
        });
        */
    }

    /**
     * insert URL link
     */
    private insertUrl() {
        const url = prompt("Insert URL link", 'http:\/\/');
        if (url && url !== '' && url !== 'http://') {
            this.editorService.createLink(url);
        }
    }

    /** insert color */
    private insertColor(color: string, where: string) {
        this.editorService.insertColor(color, where);
        // this.execute.emit("");
    }

    /**
     * set font Name/family
     * @param fontName string
     */
    private setFontName(fontName: string): void {
        this.editorService.setFontName(fontName);
        // this.execute.emit("");
    }

    /**
     * set font Size
     * @param fontSize string
     *  */
    private setFontSize(fontSize: string): void {
        this.editorService.setFontSize(fontSize);
        // this.execute.emit("");
    }

    /**
     * Upload image when file is selected
     */
    private onFileChanged(event) {
        // to be implemented
    }

    private setCustomClass(classId: number) {
        // this.editorService.createCustomClass(this.customClasses[classId]);
    }
}
