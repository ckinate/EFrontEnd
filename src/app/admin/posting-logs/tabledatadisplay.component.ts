import { Component, Input, OnInit } from "@angular/core";


@Component({
  selector: 'tabledatadisplay',
  templateUrl: './tabledatadisplay.component.html',
  styleUrls: ['./notabledatadisplay.component.css']
})
export class TabledatadisplayComponent implements OnInit {
  headers: any;
 
  constructor() {}

  ngOnInit() {
    this.headers = Object.keys(this.items[0]);
  }
  @Input() items: any[];
  @Input() title: string;


}
