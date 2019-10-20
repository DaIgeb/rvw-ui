import { Injectable } from '@angular/core';
import { Sort, PageEvent } from '@angular/material';
import { isArray } from 'highcharts';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  constructor() {}

  isSort(obj: any): obj is Sort {
    if ((obj as Sort).active) {
      return true;
    }

    return false;
  }

  isPage(obj: any): obj is PageEvent {
    if ((obj as PageEvent).pageIndex !== undefined) {
      return true;
    }

    return false;
  }

  applyPaging<T>(data: T[], page: PageEvent, defaultPageSize: number = 5): T[] {
    if (!data) {
      return data;
    }
    const pageSize = page ? page.pageSize : defaultPageSize;
    const pageIndex = page ? page.pageIndex : 0;

    const minIdx = pageIndex * pageSize;
    const maxIdx = (pageIndex + 1) * pageSize;

    return data.filter((_, idx) => idx >= minIdx && idx < maxIdx);
  }

  applySort<T>(data: T[], sort: Sort, defaultColumn?: string | string[]): T[] {
    if (!data) {
      return data;
    }
    if (data.length > 0) {
      const sortDirection = sort === undefined ? 'asc' : sort.direction;

      const sortColumns: string[] = sort === undefined ? [] : [sort.active];
      if (isArray(defaultColumn)) {
        sortColumns.push(...defaultColumn);
      } else {
        sortColumns.push( (defaultColumn || Object.keys(data[0])[0]) as string);
      }

      data.sort((a, b) => {
        let comparison: number;
        const sortableColumns = [...sortColumns];
        do {
          const sortColumn = sortableColumns.splice(0, 1)[0];
          const valueA = a[sortColumn];
          const valueB = b[sortColumn];

          comparison = this.compareTo(valueA, valueB);
        } while (comparison === 0 && sortableColumns.length > 0);

        return sortDirection === 'asc' ? comparison : -1 * comparison;
      });

      return data;
    }
  }

  private compareTo = (a: any, b: any): number => {
    if (typeof a === 'string') {
      return a.localeCompare(b);
    }

    if (a === b) {
      return 0;
    }

    if (a < b) {
      return 1;
    }

    return -1;
  };
}
