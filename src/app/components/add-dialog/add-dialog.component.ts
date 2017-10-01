import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { DirService } from '../../providers/dir.service';

@Component({
  selector: 'add-dialog',
  templateUrl: 'add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss']
})
export class AddDialog implements OnInit {
  private dirs:any;

  constructor(
    private dirService: DirService,
    public dialogRef: MdDialogRef<AddDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.dirs = this.dirService.getDirArray();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}