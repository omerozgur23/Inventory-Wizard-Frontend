import { Injectable } from '@angular/core';
import { ShelfService } from '../../modules/warehouse/service/shelf.service';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  constructor(
    // private shelfService: ShelfService,
  ) { }

  uuidSplit(data: any[]): any[] {
    return data.map(item => {
      const shortId = '#' + item.id.split('-')[0];
      return { ...item, shortId };
    });
  }

  // tableData: any[] = []
  // onSearchInputChange(searchKeyword: string, loadShelvesCallback: () => void) {
  //   this.tableData = []
  //   if (searchKeyword.trim() !== '' && searchKeyword !== undefined && searchKeyword !== null) {
  //     setTimeout(() =>
  //       this.shelfService.search(searchKeyword).subscribe({
  //         next: (result) => {
  //           this.tableData = this.uuidSplit(result);
  //           this.getSearchResponse(this.tableData)
  //         },
  //         error: (err) => {
  //           console.log(err);
  //         }
  //       }),
  //       300
  //     );
  //   } else {
  //     loadShelvesCallback();
  //   }
  // }

  // getSearchResponse(tableData: any = ""){
  //   console.log("search response method: ", tableData);
  //   return tableData;
  // }
}
