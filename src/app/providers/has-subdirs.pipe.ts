import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'subdir'
})

export class SubDir implements PipeTransform {
    transform(array: any[]) {
        const subdirs = array.filter(function (el) {
            return el.type == "directory"
        });

        if (subdirs.length > 0) {
            return false; // false = has subdirs -> css disable
        } else {
            return true;
        }

    }

}