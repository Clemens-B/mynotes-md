import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AngularSplitModule } from 'angular-split';
import { MatButtonModule, MatListModule, MatTabsModule, MatCardModule, MatIconModule, MatMenuModule, MatTooltipModule, MatDialogModule, MatSelectModule, MatInputModule, MatSnackBarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { TreeView } from './components/file-tree/file-tree.component';
import { TreeViewItem } from './components/file-tree/file-tree-item/file-tree-item.component';
import { NoteList } from './components/note-list/note-list.component';
import { NoteListItem } from './components/note-list/note-list-item/note-list-item.component';
import { AddDialog } from './components/add-dialog/add-dialog.component';
import { SettingDialog } from './components/setting-dialog/setting-dialog.component';
import { MarkdownComponent } from './components/markdown/markdown.component';
import { Editor } from './components/editor/editor.component';

import { AppRoutingModule } from './app-routing.module';

import { ElectronService } from './providers/electron.service';
import { CountFiles } from './providers/count-files.pipe';
import { SubDir } from './providers/has-subdirs.pipe';
import { DirService } from './providers/dir.service';
import { SettingStoreService } from './providers/settings.service';
import { MarkdownService } from './providers/markdown.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TreeView,
    TreeViewItem,
    CountFiles,
    SubDir,
    NoteList,
    NoteListItem,
    AddDialog,
    SettingDialog,
    Editor,
    MarkdownComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularSplitModule,
    MatButtonModule, MatListModule, MatTabsModule, MatCardModule, MatIconModule, MatMenuModule, MatTooltipModule, MatDialogModule, MatSelectModule, MatInputModule, MatSnackBarModule
  ],
  entryComponents: [AddDialog, SettingDialog],
  providers: [ElectronService, DirService, SettingStoreService, MarkdownService],
  bootstrap: [AppComponent]
})
export class AppModule { }
