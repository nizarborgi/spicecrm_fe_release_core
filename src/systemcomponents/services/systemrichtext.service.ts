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
    AfterContentInit,
    Component,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    OnInit,
    Output,
    Renderer2,
    ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {metadata} from "../../services/metadata.service";
import {DOCUMENT} from "@angular/common";


import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";


export interface CustomClass {
    name: string;
    class: string;
    tag?: string;
}



export interface UploadResponse {
    imageUrl: string;
}

@Injectable()
export class systemrichtextservice {
    public  savedSelection: Range | null;
    public selectedText: string;
    public uploadUrl: string;

    constructor(@Inject(DOCUMENT) private _document: any) {
    }

    /**
     * Executed command from editor header buttons exclude toggleEditorMode
     * @param command string from triggerCommand
     */
    public executeCommand(command: string) {
        if (command === 'h1' || command === 'h2' || command === 'h3' || command === 'h4' || command === 'h5' || command === 'h6' || command === 'p' || command === 'pre') {
            this._document.execCommand('formatBlock', false, command);
        }

        this._document.execCommand(command, false, null);
        return;
    }

    /**
     * Create URL link
     * @param url string from UI prompt
     */
    public createLink(url: string) {
        if (!url.includes("http")) {
            this._document.execCommand('createlink', false, url);
        } else {
            const newUrl = '<a href="' + url + '" target="_blank">' + this.selectedText + '</a>';
            this.insertHtml(newUrl);
        }
    }

    /**
     * insert color either font or background
     *
     * @param color color to be inserted
     * @param where where the color has to be inserted either text/background
     */
    public insertColor(color: string, where: string): void {
        const restored = this.restoreSelection();
        if (restored) {
            if (where === 'textColor') {
                this._document.execCommand('foreColor', false, color);
            } else {
                this._document.execCommand('hiliteColor', false, color);
            }
        }

        return;
    }

    /**
     * Set font name
     * @param fontName string
     */
    public setFontName(fontName: string) {
        this._document.execCommand("fontName", false, fontName);
    }

    /**
     * Set font size
     * @param fontSize string
     */
    public setFontSize(fontSize: string) {
        this._document.execCommand("fontSize", false, fontSize);
    }

    /**
     * Create raw HTML
     * @param html HTML string
     */
    private insertHtml(html: string): void {

        const isHTMLInserted = this._document.execCommand('insertHTML', false, html);

        if (!isHTMLInserted) {
            throw new Error('Unable to perform the operation');
        }

        return;
    }

    /**
     * save selection when the editor is focussed out
     */
    public saveSelection(): any {
        if (window.getSelection) {
            const sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                this.savedSelection = sel.getRangeAt(0);
                this.selectedText = sel.toString();
            }
        } else if (this._document.getSelection && this._document.createRange) {
            this.savedSelection = document.createRange();
        } else {
            this.savedSelection = null;
        }
    }

    /**
     * restore selection when the editor is focussed in
     *
     * saved selection when the editor is focussed out
     */
    public restoreSelection(): boolean {
        if (this.savedSelection) {
            if (window.getSelection) {
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(this.savedSelection);
                return true;
            } else if (this._document.getSelection /*&& this.savedSelection.select*/) {
                // this.savedSelection.select();
                return true;
            }
        } else {
            return false;
        }
    }

    /** check any slection is made or not */
    private checkSelection(): any {

        const slectedText = this.savedSelection.toString();

        if (slectedText.length === 0) {
            throw new Error('No Selection Made');
        }

        return true;
    }

    /**
     * Insert image with Url
     * @param imageUrl
     */
    public insertImage(imageUrl: string) {
        this._document.execCommand('insertImage', false, imageUrl);
    }


    public createCustomClass(customClass: CustomClass) {
        const tagName = customClass.tag ? customClass.tag : 'span';
        const newTag = '<' + tagName + ' class="' + customClass.class + '">' + this.selectedText + '</' + tagName + '>';
        this.insertHtml(newTag);
    }
}
