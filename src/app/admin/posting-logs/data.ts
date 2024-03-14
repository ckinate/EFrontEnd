export class displayItem { 
    constructor( public title: string, public itemvalue: string, public col: number) {}
  }
  

  export class requestItems {
      constructor(public title: string, public requestItem: any, public isTable: boolean, active: boolean, disabled: boolean, removable: boolean) {}
  }