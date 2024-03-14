import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as _ from 'lodash';

export enum ButtonType {
  Save = "save",
  Add = "add",
  Update = "update",
  Authorize = "authorize",
  Decline = "decline",
  Dropdown = "dropdown",
  DropdownClose = "dropdownclose",
  Error = "error",
  Other = "other",
  Cancel = "cancel",
  Download = "download"
}

@Component({
  selector: 'app-erms-button',
  templateUrl: './nibss-button.component.html',
  styleUrls: ['./nibss-button.component.css']
})
export class NibssButtonComponent implements OnInit {

  @Input() title: string;
  iconHtml: SafeHtml;
  inbuiltStyle: string;
  @Input() class: string;
  @Input() style: string;
  @Input() type: ButtonType;
  @Input() icon: string;
  @Input() busyText: string;
  @Input() isLoading: boolean;
  @Input() action: string;
  @Input() disabled: boolean;
  @Output()
  public click = new EventEmitter<MouseEvent>();

  constructor(private sanitizer: DomSanitizer) { }

  public handleClick(event: MouseEvent) {
     if(this.disabled) return;
    this.click.emit(event);
  }

  public handleClickFalse() {
    return false;
  }
  

  ngOnInit(): void {
    this.inbuiltStyle = `outline: none; padding: 10px; border-radius: 5px; padding-right: 30px; padding-left: 30px; border-width: 0px; font-weight: 500;`;

    if(_.isUndefined(this.isLoading)) {
      this.isLoading = false;
    }

    if (_.isUndefined(this.action)) {
      this.action = "";
    }

    if (_.isUndefined(this.class)) {
        this.class = "vic-button";
    } else {
      this.class = "vic-button " + this.class;
    }

    if (_.isUndefined(this.type)) {
      this.type = ButtonType.Other
    }

    if (_.isUndefined(this.icon)) {
      this.icon = `<button disabled="true" style="outline: none;background-color: inherit;border-width: 0px; color: #FFF" class="strip-button fa fa-angle-double-right"></button>`;
    }

    switch(this.type) {
      case "save":
        this.icon = `<button disabled="true" style="outline: none;background-color: inherit;border-width: 0px; color: #FFF" class="strip-button fa fa-save"></button>`;
        this.inbuiltStyle += `background-color: #356d00; color:#FFF;`;
        break;
      case "download":
        this.icon = `<button disabled="true" style="outline: none;background-color: inherit;border-width: 0px;color: #FFF" class="strip-button fa fa-folder-download"></button>`;
        this.inbuiltStyle += `background-color: rgb(81,168,177); color:#FFF;`;
        break;
      case "authorize":
        this.icon = `<button disabled="true" style="outline: none;background-color: inherit;border-width: 0px;color: #FFF" class="strip-button fa fa-check-circle"></button>`;
        this.inbuiltStyle += `background-color: rgb(81,168,177); color:#FFF;`;
        break;
      case "add":
        this.icon = `<button disabled="true" style="outline: none;background-color: inherit;border-width: 0px;color: #FFF" class="strip-button fa fa-plus"></button>`;
        this.inbuiltStyle += `background-color: rgb(81,168,177); color:#FFF;`;
        break;
      case "decline":
        this.icon = `<button disabled="true" style="outline: none;background-color: inherit;border-width: 0px;color: #FFF" class="strip-button fa fa-times-circle"></button>`;
        this.inbuiltStyle += `background-color: rgb(217,36,21); color:#FFF;`;
        break;
      case "update":
        this.icon = `<button disabled="true" style="outline: none;background-color: inherit;border-width: 0px;color: #FFF" class="strip-button fa fa-pen-square"></button>`;
        this.inbuiltStyle += `background-color: rgba(209,135,0); color:#FFF;`;
        break;
      case "error":
        this.icon = `<button disabled="true" style="outline: none;background-color: inherit;border-width: 0px;color: #FFF" class="strip-button fa fa-exclamation-triangle"></button>`;
        this.inbuiltStyle += `background-color: rgb(217,36,21); color:#FFF;`;
        break;
      case "cancel":
        this.icon = `<button disabled="true" style="outline: none;background-color: inherit;border-width: 0px;color: #FFF" class="strip-button fa fa-times-circle"></button>`;
        this.inbuiltStyle += `background-color: rgb(217,36,21); color:#FFF;`;
        break;
      case "dropdown":
        this.icon = `<button disabled="true" style="outline: none;background-color: inherit;border-width: 0px;color: #FFF" class="strip-button fa fa-chevron-circle-down"></button>`;
        this.inbuiltStyle += `background-color: rgb(81,168,177); color:#FFF;`;
        break;
      case "dropdownclose":
        this.icon = `<button disabled="true" style="outline: none;background-color: inherit;border-width: 0px;color: #FFF" class="strip-button fa fa-chevron-circle-up"></button>`;
        this.inbuiltStyle += `background-color: rgb(81,168,177); color:#FFF;`;
        break;
      default:
        this.icon = `<button disabled="true" style="outline: none;background-color: inherit;border-width: 0px;color: #FFF" class="strip-button fa fa-angle-double-right"></button>`;
        this.inbuiltStyle += `background-color: rgba(209,135,0); color:#FFF;`;
        break;
    }

    this.iconHtml = this.sanitizer.bypassSecurityTrustHtml(this.icon);   

  }

}
