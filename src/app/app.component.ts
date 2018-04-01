import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	template: `
		<dt-ingestor *ngIf="!showDataView" (showData)="showDataView = true"></dt-ingestor>
		<dt-data *ngIf="showDataView"></dt-data>
  `,
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	showDataView = true;
}
