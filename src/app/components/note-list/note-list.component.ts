import { Component, Input} from '@angular/core';
const Path = require('path');


@Component({
  selector: 'note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteList {
  @Input() notes;
  @Input() currentFile;

}