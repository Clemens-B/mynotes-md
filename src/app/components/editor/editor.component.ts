import { Component, Input, Output, ViewChild, ElementRef, AfterViewInit, EventEmitter } from '@angular/core';
import { MarkdownService } from '../../providers/markdown.service';
import { Subject } from 'rxjs/Subject';

declare var ace: any;

@Component({
    selector: 'editor',
    templateUrl: './editor.component.html',
})

export class Editor implements AfterViewInit {
    @Output() markdownOut = new EventEmitter();
    @Input()
    set markdown(text: string) {
        this.setText(text);
    }
    @Input() editButton: Subject<string>;
    editor: any;
    private timer: any;

    constructor(
        private elementRef: ElementRef,
        private markdownService: MarkdownService,

    ) {
        let el = elementRef.nativeElement;
        this.editor = ace.edit(el);
    }

    ngOnInit() {
        this.markdownService.toDo.subscribe((data: any) => this.onCheckToDo(data));
        this.editButton.subscribe(buttonObject => {
            this.onEditButton(buttonObject)
        });
    }

    ngAfterViewInit() {
        this.editor.$blockScrolling = Infinity;
        this.editor.setTheme("ace/theme/github");
        this.editor.getSession().setUseWrapMode(true);
        this.editor.getSession().setMode("ace/mode/markdown");
        this.editor.resize();

        this.editor.on('change', () => this.updateMarkdownOut());
        this.editor.on('paste', () => this.updateMarkdownOut());
    }

    ngAfterViewChecked() {
        this.editor.resize();
    }

    onCheckToDo(toDo) {

        if (toDo) {
            let range = this.editor.find(toDo);
            range.start.column = 1;

            console.log(range)
            let cbrange = this.editor.findAll('- [ ]', {
                range: range
            });
            console.log(cbrange)
        }
    }

    updateMarkdownOut() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            let value = this.editor.getValue();
            this.markdownOut.emit(value)
        }, 1000);
    }

    setText(text: string) {
        if (text === null || text === undefined) {
            text = "";
        }
        this.editor.getSession().setValue(text);
    }

    onEditButton(button: any) {
        let range = this.editor.selection.getRange();
        let selectedText = this.editor.getSelectedText();
        let insertText = '';
        let cursorPos = {
            column: 0,
            row: 1
        }

        switch (button["type"]) {
            case 'bold':
                if (/^.[**]{2}|.[**]{2}$/g.test(selectedText)) {
                    insertText = `${selectedText.slice(2, -2)}`
                } else {
                    insertText = `**${selectedText || insertText}**`;
                    cursorPos.column = 2;
                }
                break;
            case 'italic':
                if (/^.[*]{1}|.[*]{1}$/g.test(selectedText)) {
                    insertText = `${selectedText.slice(1, -1)}`
                } else {
                    insertText = `*${selectedText || insertText}*`;
                    cursorPos.column = 1;
                }
                break;
            case 'link':
                insertText = `[](${selectedText || "http://"})`;
                cursorPos.column = 1;
                selectedText = false;
                break;
            case 'task':
                insertText = `- [ ] ${selectedText || insertText}`;
                cursorPos.column = 6;
                break;
            case 'bullet':
                insertText = `- ${selectedText || insertText}`;
                cursorPos.column = 2;
                break;
            case 'number':
                insertText = `1. ${selectedText || insertText}`;
                cursorPos.column = 3;
                break;
            case 'code':
                insertText = "```javascript\r\n" + (selectedText || insertText) + "\r\n```";
                cursorPos.row += 1;
                break;
            case 'emoji':
                insertText = button["emoji"];
                cursorPos.column += 2;
                break;
            default:
                break;
        }
        this.editor.session.replace(range, insertText);
        if (!selectedText) {
            this.editor.gotoLine(range.start.row += cursorPos.row, range.start.column += cursorPos.column, false);
        }
        this.editor.focus();
    }


}