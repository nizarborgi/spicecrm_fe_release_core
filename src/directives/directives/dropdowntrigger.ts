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
 * @module directives
 */
import {
    Directive,
    HostListener,
    HostBinding,
    OnDestroy,
    ElementRef,
    Renderer2,
    Input
} from '@angular/core';

/**
 * a directive that can be added to an element and then makes this act as a dropdowntrigger in
 * the sense of lightning design. It reacts to a click and then sets the attribute slds-is-open as class to the element this is rendered to
 *
 * ```html
 * <div dropdowntrigger></div>
 * ```
 */
@Directive({
    selector: '[dropdowntrigger]'
})
export class DropdownTriggerDirective implements OnDestroy {

    private clickListener: any;
    @Input('dropdowntrigger') private dropdowntriggerdisabled: boolean = false;

    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef
    ) {

    }

    @HostBinding('class.slds-is-open') public dropDownOpen: boolean = false;

    @HostListener('click', ['$event'])
    private openDropdown(event) {
        if(!this.dropdowntriggerdisabled) {
            this.dropDownOpen = !this.dropDownOpen;

            if (this.dropDownOpen) {
                event.preventDefault();
                this.clickListener = this.renderer.listen("document", "click", (event) => this.onClick(event));
            } else {
                this.clickListener();
            }
        }
    }

    private onClick(event): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.dropDownOpen = false;
            this.clickListener();
        }
    }

    public ngOnDestroy() {
        if (this.clickListener) this.clickListener();
    }

}
