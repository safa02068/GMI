import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class PatientAdmissionsDischargesService {

    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    async loadChart(): Promise<void> {
        if (this.isBrowser) {
            try {
                // Dynamically import ApexCharts
                const ApexCharts = (await import('apexcharts')).default;

                // Define chart options
                const options = {
                    series: [
                        {
                            name: "Admissions",
                            data: [170, 420, 300, 550, 550, 650, 820]
                        },
                        {
                            name: "Discharges",
                            data: [320, 300, 650, 400, 750, 650, 600]
                        }
                    ],
                    chart: {
                        type: "area",
                        height: 338,
                        zoom: {
                            enabled: false
                        },
                        toolbar: {
                            show: false
                        }
                    },
                    colors: [
                        "#4936F5", "#EC1F00"
                    ],
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: "smooth",
                        width: [2, 2]
                    },
                    grid: {
                        show: true,
                        borderColor: "#ECEEF2",
                        strokeDashArray: 10,
                        xaxis: {
                            lines: {
                                show: true
                            }
                        }
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            stops: [0, 90, 100],
                            shadeIntensity: 1,
                            opacityFrom: 0,
                            opacityTo: 0.5
                        }
                    },
                    xaxis: {
                        categories: [
                            "Sun",
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat"
                        ],
                        axisTicks: {
                            show: false,
                            color: '#ECEEF2'
                        },
                        axisBorder: {
                            show: true,
                            color: '#D5D9E2'
                        },
                        labels: {
                            show: true,
                            style: {
                                colors: "#8695AA",
                                fontSize: "12px"
                            }
                        }
                    },
                    yaxis: {
                        tickAmount: 5,
                        max: 1000,
                        min: 0,
                        labels: {
                            style: {
                                colors: "#64748B",
                                fontSize: "12px"
                            }
                        },
                        axisBorder: {
                            show: true,
                            color: '#D5D9E2'
                        },
                        axisTicks: {
                            show: false,
                            color: '#ECEEF2'
                        }
                    },
                    legend: {
                        show: true,
                        position: 'top',
                        fontSize: '12px',
                        horizontalAlign: 'left',
                        itemMargin: {
                            horizontal: 8,
                            vertical: 0
                        },
                        labels: {
                            colors: '#64748B'
                        },
                        markers: {
                            size: 7,
                            offsetX: -2,
                            offsetY: -.5,
                            shape: 'diamond'
                        }
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#patient_admissions_discharges_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}