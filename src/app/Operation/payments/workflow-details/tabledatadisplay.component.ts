import { Component, Input, OnInit } from "@angular/core";


@Component({
  selector: 'tabledatadisplay',
  templateUrl: './tabledatadisplay.component.html',
  styleUrls: ['./notabledatadisplay.component.css']
})
export class TabledatadisplayComponent implements OnInit {
  headers: any;
  vvv=[];
  constructor() {}

  ngOnInit() {
 
    this.headers = this.xxxx(Object.keys(this.items[0]));
    //console.log(this.headers)
  
  }
  @Input() items: any[];
  @Input() title: string;

  transform(value: any) {
    if (!value) {
    return '';
    }
    
    
    
    return value.replace(/\s/g, "");
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
xxxx(mm:any){
  
    mm.forEach(item=> { 
    
      //var cccc= Object.keys(item);
    //console.log(cccc)
      var bb = this.camelPad(item);
     this. vvv.push(bb);
    })

    return this.vvv;

}
}
