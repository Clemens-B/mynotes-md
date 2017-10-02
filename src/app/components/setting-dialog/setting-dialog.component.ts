import { Component, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { SettingStoreService } from '../../providers/settings.service';
import { DirService } from '../../providers/dir.service';

@Component({
  selector: 'setting-dialog',
  templateUrl: 'setting-dialog.component.html',
})
export class SettingDialog {
  public settingData: any;

  constructor(
    public dialogRef: MdDialogRef<SettingDialog>,
    private settingService: SettingStoreService,
    private dirService: DirService,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.settingService.setSettings('path', this.data.path);
    this.dirService.setDirTree(this.data.path);
    this.dialogRef.close();
  }

}