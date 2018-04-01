import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { environment } from './../environments/environment';

@Component({
    selector: 'dt-ingestor',
    template: `
        <h1>The Ingestor</h1>
        <div *ngIf='!loadStatus' id='uploadBox'>
            <input #input (change)="input.value = ''" ng2FileSelect id="file" type="file" [uploader]="uploader" />
            <label for="file">Insert file</label>            
        </div>
        <div *ngIf='loadStatus > 0' id='loadingScreen'>
            <img *ngIf='loadStatus == 1' src="assets/images/oval.svg" />
            <p *ngIf='loadStatus == 1; else fileLoaded'>Processing File</p>
            <ng-template #fileLoaded>
                <p id='finished'>File Processed: {{ lastUploadedFileName }}</p>
                <div id='buttonWrapper'>
                    <button (click)="loadStatus = 0">try again</button>
                    <button (click)="showData.emit(true)">see data</button>
                </div>
                
            </ng-template>
        </div>
    `,
    styleUrls: ["ingestor.component.scss"]
})

export class IngestorComponent implements OnInit {

    @Output() showData = new EventEmitter<boolean>();
    loadStatus = 0;
    lastUploadedFileName = 'somefile.tst';

    public uploader:FileUploader = new FileUploader({
        url: environment.rootUrl + "/ingest",
        allowedMimeType: ['application/vnd.ms-excel'],
		autoUpload: true,
		isHTML5: true,
		itemAlias: "datasheet",
    });


    ngOnInit() {

        this.uploader.onWhenAddingFileFailed = (item, filter: any, options: any) => {
            if(this.uploader.options.allowedMimeType.indexOf(item.type) == -1) { alert("Wrong file type inserted"); }
		};

        this.uploader.onAfterAddingFile = (item :FileItem) => { 
            this.lastUploadedFileName = item.file.name;
            this.uploader.uploadItem(item);
            this.loadStatus = 1;
        }

        this.uploader.onSuccessItem = (item: FileItem, res: any, status: number) => {
            if (status === 200) this.loadStatus = 2;
        }

        this.uploader.onErrorItem = (item: FileItem, res: any, status: number) => {            
            alert(JSON.parse(res).message);
            this.loadStatus = 0;
        }
    }


}