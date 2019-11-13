import { Component, OnInit, Input } from '@angular/core';
import * as Papa from 'papaparse';

@Component({
  selector: 'rvw-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  @Input()
  fileName?= 'data.csv';

  @Input()
  items: any[];

  @Input()
  type = 'text/csv';

  constructor() { }

  ngOnInit() { }

  exportAll() {
    let content: string;

    switch (this.type) {
      case 'application/json':
        content = JSON.stringify(this.items, null, 0);
        break;
      default:
        content = Papa.unparse(this.items, {});
        break;
    }

    const dynamicDownload = document.createElement('a');
    const element = dynamicDownload;
    const fileType = this.type;
    element.setAttribute(
      'href',
      `data:${fileType};charset=utf-8,${encodeURIComponent(content)}`
    );
    element.setAttribute('download', this.fileName);

    const event = new MouseEvent('click');
    element.dispatchEvent(event);
  }
}
