import {Component, Input, ViewChild} from  '@angular/core';
import { MdMenuTrigger, MdDialog, MdSnackBar } from '@angular/material';
import { DirService } from '../../../providers/dir.service';
import { SettingStoreService } from '../../../providers/settings.service';
const Path = require('path');

@Component ({
  selector: 'file-tree-item',
  templateUrl: './file-tree-item.component.html',
  styleUrls: ['./file-tree-item.component.scss']
})
export class TreeViewItem {
  @Input() folder;
  @Input() currentPath;
  @ViewChild(MdMenuTrigger) menu: MdMenuTrigger;
  hideme:any = {};

  constructor(
    private settingService: SettingStoreService, 
    private dirService: DirService,
    public snackBar: MdSnackBar,
  ) {}

  onViewNotes(path: string) {
    this.dirService.setNotes(path);
    this.settingService.setSettings('currentPath', path);
  }

  deleteFolder(path: string): void {
    this.dirService.deleteDirectory(path)
      .then(data => {
        this.dirService.updateNotes();
        this.dirService.updateDir();
        this.snackBar.open('Succefully deleted ' + Path.basename(path), "That's fine", {duration: 3000})
      })
      .catch(err => {
        this.snackBar.open('Something went wrong deleting  ' + Path.basename(path), "That's not fine", {duration: 3000});
        console.log(err);
      })
  }

  onRightClick() {
    this.menu.openMenu();
    return false;
  }


}