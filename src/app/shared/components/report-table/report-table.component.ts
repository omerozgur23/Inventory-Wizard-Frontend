import { Component, Input, OnInit } from '@angular/core';
import { TableColumn } from '../table/dto/table';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrl: './report-table.component.scss'
})
export class ReportTableComponent implements OnInit{
  @Input() tableTitle = '';
  @Input() tableData: any[] = [];
  @Input() columns: TableColumn[] = [];

  ngOnInit(): void {}
}
