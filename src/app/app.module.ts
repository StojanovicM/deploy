import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from "@angular/forms";

import { FileUploadModule } from 'ng2-file-upload';

import { DataService } from './services/data.service';

import { AppComponent } from './app.component';
import { IngestorComponent } from './ingestor.component';
import { DataComponent } from './data.component';



@NgModule({
	declarations: [
		AppComponent,
		IngestorComponent,
		DataComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		FormsModule,
		FileUploadModule
	],
	providers: [ 
		HttpClientModule,
		DataService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
