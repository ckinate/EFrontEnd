import { ThrowStmt } from "@angular/compiler";
import {
    Directive,
    HostListener,
    ElementRef,
    OnInit,
    AfterViewChecked,
    AfterViewInit,
    AfterContentChecked,
    AfterContentInit,
} from "@angular/core";
import { isNumber } from "lodash";
import { moment } from "ngx-bootstrap/chronos/test/chain";
import { FinCurrencyPipe } from "./fincurrency.pipe";

@Directive({ selector: "[finCurrency]" })
export class FinCurrencyDirective implements OnInit, AfterViewChecked {
    private el: HTMLInputElement;

    constructor(
        private elementRef: ElementRef,
        private currencyPipe: FinCurrencyPipe
    ) {
        this.el = this.elementRef.nativeElement;
    }

    ngOnInit() {
        this.el.value = this.currencyPipe.transform(this.el.value);
    }

    ngAfterViewChecked() {
        if (
            Number.isNaN(Number(this.el.value)) === false &&
            Number(this.el.value) > 0
        ) {
            if (this.el.title === "" || this.el.title === undefined) {
                let idnum = Math.floor(Math.random() * 100000) + 1;
                //this.el.title = idnum.toString();

                this.el.value = this.currencyPipe.transform(this.el.value);
            } else {

                //this.el.value = this.currencyPipe.parse(this.el.value);
            }
        }
    }
    @HostListener("focus", ["$event.target.value"])
    onFocus(value) {
        let ivalue = value.replace(",", "");

        if (Number.isNaN(Number(ivalue)) === false && Number(ivalue) > 0) {
            this.el.value = this.currencyPipe.parse(ivalue); // opossite of transform
        }
    }

    @HostListener("blur", ["$event.target.value"])
    onBlur(value) {
        this.el.value = this.currencyPipe.transform(value);

    }
}
