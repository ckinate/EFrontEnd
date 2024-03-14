import { Pipe, PipeTransform } from "@angular/core";

const PADDING = "000000";

@Pipe({ name: "finCurrencypipe" })
export class FinCurrencyPipe implements PipeTransform {

  private DECIMAL_SEPARATOR: string;
  private THOUSANDS_SEPARATOR: string;

  constructor() {
    // TODO comes from configuration settings
    this.DECIMAL_SEPARATOR = ".";
    this.THOUSANDS_SEPARATOR = ",";
  }

  transform(value: number | string, fractionSize: number = 2): string {   

    
    
    let [ integer, fraction = "" ] = ( this.validateFirstValue(this.validateDecimalValue(value)) || "0").toString()
      .split(this.DECIMAL_SEPARATOR);

    fraction = fractionSize > 0
      ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
      : "";

    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);

    return integer + fraction;
  }

  validateDecimalValue(v) {
    // Check to see if the value is a valid number or not
    if (Number.isNaN(Number(v))) {
      // strip out last char as this would have made the value invalid
      const strippedValue = v.slice(0, v.length - 1);

      // if value is still invalid, then this would be copy/paste scenario
      // and in such case we simply set the value to empty
      return Number.isNaN(Number(strippedValue)) ? '0' : strippedValue;
    }
    return v;
  }
  parse(value: string, fractionSize: number = 2): string {
    
    let [ integer, fraction = "" ] = ( this.validateFirstValue(this.validateDecimalValue(value)).toString() || "0").split(this.DECIMAL_SEPARATOR);
   
    integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, "g"), "0");

    fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
      ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
      : "";

    return integer + fraction;
  }
  validateFirstValue(v){  
    
    return parseFloat(v);
  }

}