import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import 'rxjs/add/operator/takeUntil';
import { join } from 'path';
import { MdDialog } from '@angular/material';
import { MarkdownService } from 'angular2-markdown';
import { Subject } from 'rxjs/Subject';
import { Editor } from '../editor/editor.component';

import { AddDialog } from '../add-dialog/add-dialog.component';
import { SettingDialog } from '../setting-dialog/setting-dialog.component';
import { DirService } from '../../providers/dir.service';
import { SettingStoreService } from '../../providers/settings.service';

import emojis from '../../providers/emojis';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private currentPath: string;
  public settings: any;
  private filePath: string;
  private tree: any;
  private notes: any;
  private marked: string = '';
  private markedOut: string;
  private editButton: Subject<object> = new Subject();
  private timer: any;
  private showEmoji: boolean = false;
  private emojis = emojis;
  rows = [0, 1, 2, 3];



  constructor(
    private dirService: DirService,
    private settingService: SettingStoreService,
    public dialog: MdDialog,
  ) {

  }

  @ViewChild(Editor)
  private editorChild: Editor;

  ngOnInit() {
    this.dirService.dirTree.subscribe((data: any) => { this.tree = data; console.log(data) });
    this.dirService.notes.subscribe((data: any) => { this.notes = data; console.log(data) });
    this.settingService.dataObject.subscribe((data: any) => { this.settings = data; this.openFile(data.currentFileOpen.path) });

    //workaround for https://github.com/angular/material2/issues/5268
    Promise.resolve().then(() => {
      if (this.settings.path == "none") {
        this.openSettings();
      }
    });
  }

  openSettings(): void {
    let _path = this.settings.path;
    if (this.settings.path == "none") {
      _path = undefined;
    }
    let dialogRef = this.dialog.open(SettingDialog, {
      width: '500px',
      data: { path: _path }
    });
  }

  openAddDialog(type: string, path: string): void {
    let dialogRef = this.dialog.open(AddDialog, {
      width: '500px',
      data: { type: type, path: path }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result) {
        result.type == "Note"
          ? this.dirService.createNote(join(result.path, (result.name + ".md")))
          : this.dirService.createNotebook(join(result.path, result.name))

        this.updateDir();
        this.updateNotes();
      }
    });
  }

  selectionChanged(event) {

    this.settingService.setSettings('currentFileOpen', this.settings.currentFiles[event.index]);
    console.log(this.settings.currentFileOpen)

  }

  onDrag(data) {
    const splitSize = {};
    let i = 0;

    for (var k in this.settings.toggle) {
      if (this.settings.toggle[k] == true) {
        splitSize[k] = data[i];
        i++
      }
    }

    this.settingService.setSettings('splitSize', splitSize)
  }

  toggleColumn(type: string) {
    var sum;
    const splitSize = {};

    if (this.settings.toggle[type] == true) {
      sum = 100 - this.settings.splitSize[type];

      for (var k in this.settings.splitSize) {
        if (k !== type) {
          splitSize[k] = (this.settings.splitSize[k] / sum) * 100;
        }
      }
      this.settingService.setSettings('splitSize', splitSize);
      this.settingService.setToggle(type, false);
    } else {
      sum = (100 + this.settingService.defaults.splitSize[type]);

      for (var k in this.settings.splitSize) {
        splitSize[k] = (this.settings.splitSize[k] / sum) * 100;
      }
      splitSize[type] = (this.settingService.defaults.splitSize[type] / sum) * 100;
      this.settingService.setSettings('splitSize', splitSize);
      this.settingService.setToggle(type, true);
    }
  }

  private updateDir() {
    this.dirService.updateDir();
  }

  private updateNotes() {
    this.dirService.updateNotes();
  }

  private findIndex() {
    if (this.settings.currentFiles.length > 0) {
      return this.settings.currentFiles.findIndex(x => x.path === this.settings.currentFileOpen.path)
    }
  }

  private closeFile(file: string) {
    console.log("deleteing file", file)
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

  }

  private openFile(path: string) {
    if (path) {
      this.filePath = path;
      this.marked = this.dirService.readFile(path);
this.markedOut = this.marked;

      // this.dirService.readFile(path).then(data => {
      //   this.marked = data;
      //   this.markedOut = data;
      // })
    } else {
      this.filePath = null;
      this.marked = null;
      this.markedOut = null;
    }

  }

  saveFile(value) {
    this.markedOut = value;
    this.dirService.safeFile(this.filePath, value)
  }

  onEditButton(type: string, emoji?: any) {
    this.editButton.next({ type: type, emoji: emoji });
  }

  oncheckedToDo(data: any) {
    this.marked = this.markedOut;

    if (this.marked.substring(this.marked.indexOf(data) - 6, this.marked.indexOf(data)) == "- [ ] ") {
      this.marked = this.marked.substring(0, this.marked.indexOf(data) - 3) + "x] " + this.marked.substring(this.marked.indexOf(data))
    } else {
      this.marked = this.marked.substring(0, this.marked.indexOf(data) - 3) + " ] " + this.marked.substring(this.marked.indexOf(data))
    }

  }


}

