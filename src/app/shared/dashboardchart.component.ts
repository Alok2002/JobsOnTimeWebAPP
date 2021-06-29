import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DashboardServices } from '../services/dashboard.services';
import { SharedServices } from '../services/shared.services';
import { isPlatformBrowser } from '@angular/common';
//import { JobTrackerComponent } from '../shared/jobtracker';

@Component({
  selector: 'DashboardChart',
  templateUrl: './dashboardchart.component.html'
})

export class DashboardChartComponent implements OnInit {
  isBrowser = false;

  constructor(private sharedService: SharedServices, 
    private dashboardservice: DashboardServices, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.generateChart();
  }



  // lineChart
  public lineChartData: Array<any> = [
    { data: [], label: 'Sales' },
    // { data: [], label: 'Job' },
  ];
  public lineChartData1: Array<any> = [
    { data: [], label: 'Job' },
    // { data: [], label: 'Job' },
  ];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          userCallback: function (label, index, labels) {
            // when the floored value is the same as the value we have a whole number
            if (Math.floor(label) === label) {
              return label;
            }

          },
        }
      }]
    },
    legend: {
      display: false,
    }
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(90,181,31,0.2)',
      borderColor: '#5ab51f',
      pointBackgroundColor: '#5ab51f',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#5ab51f'
    }];
  public lineChartColors1: Array<any> = [
    { // dark grey
      backgroundColor: 'rgba(234,177,38,0.2)',
      borderColor: '#eab126',
      pointBackgroundColor: '#eab126',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#eab126'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  generateChart() {
    this.lineChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.dashboardservice.getDashboardSalesReport()
      .subscribe((res: any) => {
        console.log(res);

        this.lineChartLabels = res.value.columns;
        this.lineChartLabels.forEach((lb) => {
          res.value.data.forEach(val => {
            if (lb == val.saleMonth) {
              this.lineChartData[0].data.push(val.totalSaleAmount);
              this.lineChartData1[0].data.push(val.totalSales);
            }
          });
        });

        console.log(this.lineChartData);
        //let clone = JSON.parse(JSON.stringify(this.lineChartData));
        this.lineChartData = this.lineChartData;

        //let clone1 = JSON.parse(JSON.stringify(this.lineChartData1));
        this.lineChartData1 = this.lineChartData1;
      });
  }
}
