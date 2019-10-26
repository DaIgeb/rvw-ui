import { Component, OnInit, Input } from '@angular/core';
import * as Papa from 'papaparse';

@Component({
  selector: 'rvw-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  @Input()
  fileName? = 'data.csv';

  @Input()
  items: any[];

  constructor() {}

  ngOnInit() {}

  exportAll() {
    const content = Papa.unparse(this.items, {});

    const dynamicDownload = document.createElement('a');
    const element = dynamicDownload;
    const fileType = 'text/csv';
    element.setAttribute(
      'href',
      `data:${fileType};charset=utf-8,${encodeURIComponent(content)}`
    );
    element.setAttribute('download', this.fileName);

    const event = new MouseEvent('click');
    element.dispatchEvent(event);
  }
}
