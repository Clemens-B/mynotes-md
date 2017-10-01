import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
const Path = require('path');
const fs = require('fs');

import { SettingStoreService } from './settings.service';

var dirTree = require('directory-tree');

@Injectable()
export class DirService {

    public dirs: any[] = [];
    private settings;

    private dirSource = new BehaviorSubject<string>(null);
    public dirTree = this.dirSource.asObservable();

    private noteSource = new BehaviorSubject<string>(null);
    public notes = this.noteSource.asObservable();

    constructor(private settingService: SettingStoreService, ) {
        this.settingService.dataObject.subscribe((data: any) => { this.settings = data; });
        this.setDirTree(this.settings.path);
        this.setNotes(this.settings.currentPath)
    }

    getDirByPath(path: string) {
        if (path === Path.basename(path)) {
            console.log("not a valid path")
            return path
        } else {
            const tree = dirTree(path);
            return tree.children;
        }

    }

    updateDir() {
        this.dirSource.next(this.getDirByPath(this.settings.path))
    }

    updateNotes() {
        this.noteSource.next(this.getDirByPath(this.settings.currentPath))
    }

    setDirTree(path: string) {
        this.dirSource.next(this.getDirByPath(Path.normalize(path)));
    }

    setNotes(path: string) {
        this.noteSource.next(this.getDirByPath(Path.normalize(path)));
    }

    createNote(path: string) {
        const _path = Path.normalize(path);
        fs.writeFile(_path, "", { flag: 'wx' }, (err) => {
            if (err) console.log(err);
            console.log("It's saved!");
        });
    }

    safeFile(path: string, value: string) {
        const _path = Path.normalize(path);
        fs.writeFile(_path, value, (err) => {
            if (err) console.log(err);
        });
    }

    // readFile(absPath): Promise<string> {
    //     const _path = Path.normalize(absPath);
    //     return new Promise((resolve, reject) => {
    //         fs.readFile(_path, 'utf-8', (err, content) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(content);
    //             }
    //         });
    //     });
    // }

    //Above async is problematic, if user switches files while fs.readfile is processing. So lets go with the sync version - needs testing on big files
    readFile(absPath) {
        return fs.readFileSync(absPath, 'utf8');
    }

    deleteNote(path: string): Promise<any> {
        const _path = Path.normalize(path);

        if (_path == this.settingService.getSetting('currentFileOpen')) {
            this.settingService.setSettings('currentFileOpen', '')
        }

        return new Promise((resolve, reject) => {
            fs.unlink(_path, (err) => {
                if (err) reject(err);
                resolve(null);
            })
        })
    }

    createNotebook(path: string) {
        const _path = Path.normalize(path);
        if (!fs.existsSync(_path)) {
            fs.mkdirSync(_path);
        }
    }

    deleteFile(dir, file): Promise<any> {
        return new Promise((resolve, reject) => {
            var filePath = Path.join(dir, file);
            fs.lstat(filePath, (err, stats) => {
                if (err) {
                    return reject(err);
                }
                if (stats.isDirectory()) {
                    resolve(this.deleteDirectory(filePath));
                } else {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        if (this.settings.currentFileOpen.path == filePath) {
                            this.settingService.setSettings('currentFileOpen', '')
                        }
                        resolve();
                    });
                }
            });
        });
    };

    deleteDirectory(dir): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.access(dir, (err) => {
                if (err) {
                    return reject(err);
                }
                fs.readdir(dir, (err, files) => {
                    if (err) {
                        return reject(err);
                    }
                    Promise.all(files.map((file) => {
                        return this.deleteFile(dir, file);
                    })).then(() => {
                        fs.rmdir(dir, (err) => {
                            if (err) {
                                return reject(err);
                            }
                            if (this.settings.currentPath == dir) {
                                this.settingService.setSettings('currentPath', '')
                            }
                            resolve();
                        });
                    }).catch(reject);
                });
            });
        });
    };

    getNotePath() {
        return this.settings.currentPath;
    }

    getDirPath() {
        return this.settings.path;
    }

    getDirArray() {
        this.dirs = [];
        this.dirTreeArray(this.settings.path);
        return this.dirs;
    }

    dirTreeArray(path: string) {

        var stats = fs.lstatSync(path),
            info = {
                path: path,
                name: Path.basename(path)
            };
        if (stats.isDirectory()) {
            this.dirs.push(info)
        }
        if (stats.isDirectory()) {

            info = fs.readdirSync(path).map((child) => {
                return this.dirTreeArray(Path.join(path, child));
            });

        }

        return info;
    }



}