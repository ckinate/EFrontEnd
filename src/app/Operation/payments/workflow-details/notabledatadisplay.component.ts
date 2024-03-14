import { Component, Input, OnInit } from '@angular/core';
import { displayItem } from './data';


@Component({
  selector: 'notabledatadisplay',
  templateUrl: './notabledatadisplay.component.html',
  styleUrls: ['./notabledatadisplay.component.css']
})




export class NotabledatadisplayComponent implements OnInit {

  constructor( ) { }


  itemList =[];


  ngOnInit(): void {

this.itemList = [];
 
    for (let [key, value] of Object.entries(this.items)) {
    
     this.itemList.push(new displayItem(this.camelPad(key), value as string, 3));
     //this.itemList.push(key, value as string, 3);
  
     
      
  }
  }
   camelPad(str){ return str
    // Look for long acronyms and filter out the last letter
    .replace(/([A-Z]+)([A-Z][a-z])/g, ' $1 $2')
    // Look for lower-case letters followed by upper-case letters
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    // Look for lower-case letters followed by numbers
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/^./, function(str){ return str.toUpperCase(); })
    // Remove any white space left around the word
    .trim();
}

  @Input() items: any;
  @Input() title: string;
}
