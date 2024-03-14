import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { PostItem, PostDto } from "@shared/service-proxies/service-proxies";
import * as moment from "moment";

@Component({
    selector: "postdetails",
    templateUrl: "./posting-details.component.html",
    styles: [],
})
export class PostingDetailsComponent implements OnInit {
    totalDebit = 0;
    totalCredit = 0;
    //newposting= PostD();
    postingList: PostDto = new PostDto();
    @ViewChild("createOrEditModal1", { static: true }) modal: ModalDirective;
    transRef = '';
    constructor() {}

    ngOnInit(): void {}

    showprepostDetails(item: PostDto, ref ="") {


        this.totalCredit = 0;
        this.totalDebit = 0;
let x = item.postItem;
        x.forEach((y) => {
            
            if(ref !==""){
                this.transRef = ref;
            }else{
                this.transRef =y.referenceNumber;
            }


            this.totalCredit += y.creditAmount;
            this.totalDebit += y.debitAmount;
        });
         this.postingList = item;

        this.modal.show();
    }

    onShown() {}

    close() {
        this.modal.hide();
    }
}
