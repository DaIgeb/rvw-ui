import { Injectable } from '@angular/core';
import { Sort, PageEvent } from '@angular/material';

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

  applySort<T>(data: T[], sort: Sort, defaultColumn?: string): T[] {
    if (!data) {
      return data;
    }
    if (data.length > 0) {
      defaultColumn = defaultColumn || Object.keys(data[0])[0];

      const sortColumn = sort === undefined ? defaultColumn : sort.active;
      const sortDirection = sort === undefined ? 'asc' : sort.direction;

      data.sort((a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        const comparison = this.compareTo(valueA, valueB);

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
