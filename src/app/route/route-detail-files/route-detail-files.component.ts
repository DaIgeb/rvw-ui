import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { IRouteFile } from 'rvw-model/lib/route/route';
import { ILocation } from 'selenium-webdriver';
import { IRestaurant } from 'rvw-model/lib/location';

@Component({
  selector: 'rvw-route-detail-files',
  templateUrl: './route-detail-files.component.html',
  styleUrls: ['./route-detail-files.component.scss']
})
export class RouteDetailFilesComponent implements OnInit, AfterViewInit {
  @Input()
  files: IRouteFile[];

  @Input()
  locations: ILocation[] = [];

  @Input()
  restaurants: IRestaurant[] = [];

  @Output()
  onFileUpload = new EventEmitter<File>();

  @ViewChild('gmap', { static: true }) mapElement: ElementRef;
  map: google.maps.Map;

  constructor(
  ) { }

  ngOnInit() {
    console.log("files", this.files, this.locations, this.restaurants)
  }

  ngAfterViewInit(): void {
    const mapProperties: google.maps.MapOptions = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      mapProperties
    );

    this.loadMap();
  }

  selectFile(path: string) {
    new google.maps.KmlLayer({
      url: path,
      map: this.map
    });
  }

  private loadMap() {
    if (this.files) {
      const kmz = this.files.find(f => f.type === 'kmz');
      if (kmz) {
        this.selectFile(kmz.path);
      }
    }

    if (this.locations) {

    }
  }

  onUploadFile() {
    const inputNode: HTMLInputElement = document.querySelector('#routeFile');
    const file = inputNode.files[0];

    this.onFileUpload.emit(file);
  }
}
