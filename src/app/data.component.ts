import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { DataService } from './services/data.service';
import { IDataRow, ISingleRecord } from './../../server/common/interfaces';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/throttleTime';

@Component({
    selector: 'dt-data',
    template: `
        <h1>Data Sheet</h1>
        <form id='filterBox'>
            <input [(ngModel)]="filterModel.clientName" (input)="filterByTerm.next($event)"
            name='filterClientName' placeholder='filter by Client Name'>
            <input [(ngModel)]="filterModel.provider" (input)="filterByTerm.next($event)"
            name='filterProvider' placeholder='filter by Provider'>
            <input [(ngModel)]="filterModel.fileName" (input)="filterByTerm.next($event)"
            name='filterFileName' placeholder='filter by File Name'>
        </form>        
        <table>
            <thead>
                <tr>
                    <th>No.</th>
                    <th (click)="sortBy(0)" >Client Name</th>
                    <th (click)="sortBy(1)" >Amount</th>
                    <th (click)="sortBy(2)" >Provider</th>
                    <th (click)="sortBy(3)" >File Name</th>
                    <th (click)="sortBy(4)" >Input Date</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let record of records; let i = index;">
                    <td>{{ i + 1 }}.</td>
                    <td (click)="showModal(record.clientId)">{{ record.clientName }}</td>
                    <td>{{ record.amount | currency }}</td>
                    <td>{{ record.provider }}</td>
                    <td>{{ record.fileName }}</td>
                    <td>{{ record.inputDate | date }}</td>
                </tr>
            </tbody>
        </table>
        <div *ngIf="modalVisibility" id="dataModal">
            <ul>
                <li><span class='header'>Client Name:</span> <span class='data'>{{ singleRecord.clientName }}</span></li>
                <li><span class='header'>Created On:</span> <span class='data'>{{ singleRecord.createdOn | date }}</span></li>
                <li>
                    <span class='header'>Amount:</span>
                    <span [ngClass]="{'negative' : singleRecord.totalAmount < 0 }" class='data'>
                    {{ singleRecord.totalAmount | currency }}</span>
                </li>
                <li><span class='header'>Total records:</span> <span class='data'>{{ singleRecord.totalRecords }}</span></li>
                <li id='fileList'>
                    <span class='header'>Files:</span>
                    <p><span *ngFor="let file of singleRecord.fileNameList">{{ file }}</span></p>
                </li>
            </ul>
            <button (click)='modalVisibility = false' >close</button>
        </div>
    `,
    styleUrls: ["data.component.scss"]
})

export class DataComponent implements OnInit {

    records :IDataRow[] = [];
    singleRecord :ISingleRecord;
    sortByModel = { sortByCriteria: null, sortDirection: null }
    filterModel = { clientName: "", provider: "", fileName: ""}
    filterByTerm = new Subject<any>();
    offsetModel = { offset : 0, allDataLoaded : false };
    loadDataWithOffset :Subject<boolean> = new Subject<boolean>();
    unsubscribe :Subject<boolean> = new Subject<boolean>();
    modalVisibility = false;

    constructor(private _dataService :DataService) {}

    ngOnInit() {
        // When component shows load data
        this._dataService.getData().subscribe((records :IDataRow[]) => this.records = records);

        this.filterByTerm.debounceTime(650).subscribe(trm => this.filterBy(trm));

        
        // Fired when scrolled to the bottom of the list - ask for data
        this.loadDataWithOffset
            .throttleTime(250)
            .takeUntil(this.unsubscribe)
            .subscribe( e => {
                this.offsetModel.offset +=1;
                this._dataService.getData(
                    [this.sortByModel.sortByCriteria, +this.sortByModel.sortDirection ],
                    this.filterModel, this.offsetModel.offset).subscribe((records :IDataRow[]) => {
                        if (records.length < 50) this.offsetModel.allDataLoaded = true;
                        this.records = this.records.concat(records);
                    });
        });
    }

    sortBy(criteria) {
        // Sort criteray needed globaly. If same just reverse direction
        this.sortByModel.sortByCriteria = criteria;
        if (this.sortByModel.sortByCriteria === criteria) this.sortByModel.sortDirection = !this.sortByModel.sortDirection;
        this.offsetModel.offset = 0;
        this.offsetModel.allDataLoaded = false;

        let sortData = [this.sortByModel.sortByCriteria, +this.sortByModel.sortDirection ];
        this._dataService.getData(sortData, this.filterModel).subscribe((records :IDataRow[]) => this.records = records);
    }

    filterBy(evt) {
        this.offsetModel.offset = 0;
        this.offsetModel.allDataLoaded = false;
        let sortData = [this.sortByModel.sortByCriteria, +this.sortByModel.sortDirection ];
        this._dataService.getData(sortData, this.filterModel).subscribe((records :IDataRow[]) => this.records = records);
    }

    /* When bottom of the table is reached (30px from bottom) ask for new chunk - offset of data, unless all data are loaded */
       @HostListener('scroll', ["$event.target"]) onScroll(element) {
        if (element.scrollHeight - element.clientHeight - element.scrollTop < 30 && !this.offsetModel.allDataLoaded) { 
            this.loadDataWithOffset.next(true);
        }
    }

    showModal(id) {
        this._dataService.getSingleData(id).subscribe((record :ISingleRecord) => {
            this.singleRecord = record
            this.modalVisibility = true;
        });        
    }

    ngOnDestroy() {
        this.unsubscribe.next(true);
        this.unsubscribe.unsubscribe();
        this.loadDataWithOffset.unsubscribe();
    }

    
 }