import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class MarkdownService {

    private toDoSource = new BehaviorSubject<string>(null);
    public toDo = this.toDoSource.asObservable();

    onCheckedToDo(data) {
        this.toDoSource.next(data)
    }

}