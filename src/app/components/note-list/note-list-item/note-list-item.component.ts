import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { MdMenuTrigger, MdDialog, MdSnackBar } from '@angular/material';
import { DirService } from '../../../providers/dir.service';
import { SettingStoreService } from '../../../providers/settings.service';
const Path = require('path');


@Component({
  selector: 'note-list-item',
  templateUrl: './note-list-item.component.html',
  styleUrls: ['./note-list-item.component.scss']

})
export class NoteListItem implements OnInit{
  @Input() note;
  @Input() currentFile;
  @ViewChild(MdMenuTrigger) menu: MdMenuTrigger;
  settings: any;


  constructor(
    public snackBar: MdSnackBar,
    private dirService: DirService,
    private settingService: SettingStoreService,
  ) { };

  ngOnInit(){
    this.settingService.dataObject.subscribe((data: any) => { this.settings = data });
  }

  onSelectedFile(path: string, note: any) {
    this.settingService.setSettings('currentFileOpen', note);
    this.settingService.setCurrentFiles(note)
  }

  deleteNote(path: string, file): void {
    this.dirService.deleteNote(path)
      .then(data => {
        if (this.settings.currentFileOpen == file && this.settings.currentFiles.length > 1) {
          console.log(this.settings.currentFiles.length)
          this.settingService.setSettings('currentFileOpen', this.settings.currentFiles[0]);
          this.settingService.delteCurrentFiles(file);
        } else if (this.settings.currentFiles.length == 1) {
          this.settingService.setSettings('currentFileOpen', '""');
          this.settingService.delteCurrentFiles(file);
        } else {
          this.settingService.delteCurrentFiles(file);
        }
        this.dirService.updateNotes();
        this.dirService.updateDir();
        this.snackBar.open('Succefully deleted ' + Path.basename(path), "That's fine", {duration: 3000})
      })
      .catch(err => this.snackBar.open('Something went wrong deleting  ' + Path.basename(path), "That's not fine", {duration: 3000}))
  }

  onRightClick() {
    this.menu.openMenu();
    return false;
  }

}