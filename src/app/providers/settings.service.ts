const electron = require('electron');
const path = require('path');
const fs = require('fs');

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class SettingStoreService {

    private pathToSettings: string;
    public data: any;
    public defaults: any = {
        path: "none",
        currentPath: "none",
        currentFileOpen: "",
        currentFiles: [],
        toggle: {
            notebooks: true, 
            notes: true, 
            markdown: true, 
            preview: true
        },
        splitSize: {
            notebooks: 20, 
            notes: 20, 
            markdown: 30, 
            preview: 30
        }
    };

    private dataObjectSource = new BehaviorSubject<string>(null);
    public dataObject = this.dataObjectSource.asObservable();

    constructor() {
        this.pathToSettings = path.join((electron.app || electron.remote.app).getPath('userData'), 'settings.json');
        this.data = this.parseDataFile(this.pathToSettings, this.defaults);
        this.dataObjectSource.next(this.data);
    }

    parseDataFile(filePath, defaults) {
        try {
          return JSON.parse(fs.readFileSync(filePath));
        } catch(error) {
          fs.writeFileSync(this.pathToSettings, JSON.stringify(this.defaults));
          return JSON.parse(fs.readFileSync(filePath));
        }
      }

    getSetting(key) {
        return this.data[key];
    }

    getAllSettings() {
        return this.data;
    }

    setAllSettings(data) {
        this.data = data;
        this.dataObjectSource.next(this.data)
        fs.writeFileSync(this.pathToSettings, JSON.stringify(this.data));
    }

    setSettings(key: any, val) {
        this.data[key] = val;
        this.dataObjectSource.next(this.data)
        fs.writeFileSync(this.pathToSettings, JSON.stringify(this.data));
    }

    setToggle(key: any, val) {
        this.data.toggle[key] = val;
        this.dataObjectSource.next(this.data);
        fs.writeFileSync(this.pathToSettings, JSON.stringify(this.data));
    }

    setCurrentFiles(file: any) {
        let found = this.data.currentFiles.some((el) => {
            return el.path === file.path
        })

        if(!found){
            this.data.currentFiles.push(file);
            this.dataObjectSource.next(this.data);
            fs.writeFileSync(this.pathToSettings, JSON.stringify(this.data));
        }else {
            console.log("File already in Array")
        }
    }

    delteCurrentFiles(file: any){
        let index = this.data.currentFiles.indexOf(file);
        console.log(this.data.currentFiles.indexOf(file))
        if (index > -1) {
            this.data.currentFiles.splice(index, 1);
            this.dataObjectSource.next(this.data);
            fs.writeFileSync(this.pathToSettings, JSON.stringify(this.data));
        }
        
    }


}