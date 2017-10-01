import { Component, Input, ElementRef, Output, EventEmitter, Renderer2 } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { MarkdownService } from '../../providers/markdown.service';
import * as  marked from 'marked';
import * as Clipboard from 'clipboard';
const shell = require('electron').shell;

import './prism.languages';
import * as Prism from 'prismjs';

@Component({
    selector: 'markdown',
    template: '<ng-content></ng-content>',
    styleUrls: ['./mardown.component.scss']
})
export class MarkdownComponent {
    @Input() set data(value: string) { this.onDataChange(value); };
    @Output() checkedToDo = new EventEmitter();

    private renderService: any = new marked.Renderer();
    markedService: any;

    constructor(
        private el: ElementRef,
        private markdownService: MarkdownService,
        private renderer: Renderer2,
        public snackBar: MdSnackBar,
    ) {
        this.extendRenderer();
        this.markedService = marked.setOptions({ renderer: this.renderService });
    }

    extendRenderer() {
        this.renderService.listitem = (text: string) => {
            if (/^\s*\[[x ]\]\s*/.test(text)) {
                text = text
                    .replace(/^\s*\[ \]\s*/, '<input type="checkbox">')
                    .replace(/^\s*\[x\]\s*/, '<input type="checkbox" checked>');
                return '<li style="list-style: none">' + text + '</li>';
            }
            else {
                return '<li>' + text + '</li>';
            }
        }
    }

    onDataChange(data: string) {
        if (data) {
            this.parseDataToHtml(data)
                .then(html => {
                    this.el.nativeElement.innerHTML = html;
                    this.addCustomEventListener();
                    Prism.highlightAll(false);
                })
        } else {
            this.el.nativeElement.innerHTML = '';
        }
    }

    parseDataToHtml(data: string) {
        return new Promise((resolve, reject) => {
            this.markedService(data, (err, content) => {
                if (err) reject(err);
                resolve(content);
            });
        })
    }

    addCustomEventListener() {
        console.log("add eventlistender");
        //checklist
        let tasklist = this.el.nativeElement.querySelectorAll('input[type="checkbox"]');
        for (var i = 0; i < tasklist.length; i++) {
            tasklist[i].addEventListener('change', this.emitCheckedToDo.bind(this));
        }

        //external links
        var Anchors = this.el.nativeElement.getElementsByTagName("a");
        for (var i = 0; i < Anchors.length; i++) {
            Anchors[i].addEventListener("click",
                function (event) {
                    event.preventDefault();
                    console.log(this.href);
                    shell.openExternal(this.href);
                },
                false);
        }

        //clipboard
        if (Clipboard.isSupported()) {
            const blocks = this.el.nativeElement.querySelectorAll("pre > code")
            Array.prototype.forEach.call(blocks, (block, index) => {
                const id = `code${index}`

                //Create button
                let button = this.renderer.createElement("button");
                this.renderer.addClass(button, "md-clipboard");
                let icon = this.renderer.createElement("i");
                icon.textContent = "content_copy";
                this.renderer.addClass(icon, "material-icons");
                this.renderer.appendChild(button, icon);
                this.renderer.setAttribute(button, "data-clipboard-target", `#${id}`);
                this.renderer.setAttribute(button, "mdTooltip", "tooltip?")

                //insert button, reference codeblock via "id"
                const parent = block.parentNode;
                block.id = id
                parent.insertBefore(button, block)
            })

            // Initialize Clipboard
            const copy = new Clipboard(".md-clipboard")

            copy.on("success", action => {
                action.clearSelection()
                this.snackBar.open('Copied to Clipboard ', "Huyah 🤘", {duration: 3000})
            })
        }
    }

    emitCheckedToDo() {
        let value = event['path'][1]['textContent'];

        if (/[\n\r]/g.test(value)) {
            value = value.split(/[\n\r]/g)[0];
        }
        this.checkedToDo.emit(value);
    }
}