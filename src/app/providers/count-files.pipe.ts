import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'count'
})

export class CountFiles implements PipeTransform {
    transform(array: any[]): any {
        const counter = array.filter(function (el) {
            return el.type == "file"        
          });
          return counter.length
          
    }

}