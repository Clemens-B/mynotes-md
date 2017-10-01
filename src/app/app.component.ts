import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
const { BrowserWindow } = require('electron').remote

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  

  constructor(public electronService: ElectronService) {

    if (electronService.isElectron()) {
      console.log('Mode electron');
      // Check if electron is correctly injected (see externals in webpack.config.js)
      console.log('c', electronService.ipcRenderer);
      // Check if nodeJs childProcess is correctly injected (see externals in webpack.config.js)
      console.log('c', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  minimize() {
    let window = BrowserWindow.getFocusedWindow();
    window.minimize(); 
  }

  maximize() {
    let window = BrowserWindow.getFocusedWindow();
    window.maximize(); 
  }

  close() {
    let window = BrowserWindow.getFocusedWindow();
    window.close(); 
  }

}
