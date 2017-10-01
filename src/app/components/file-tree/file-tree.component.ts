import {Component, Input, Output, EventEmitter} from  '@angular/core';
import { DirService } from '../../providers/dir.service';
import { SettingStoreService } from '../../providers/settings.service';

@Component ({
  selector: 'tree-view',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class TreeView {
  @Input() treeData;
  @Input() currentPath;
  hideme:any = {};

  constructor(private settingService: SettingStoreService, private dirService: DirService) {}

  onViewNotes(path: string) {
    this.dirService.setNotes(path);
    this.settingService.setSettings('currentPath', path);
  }

}