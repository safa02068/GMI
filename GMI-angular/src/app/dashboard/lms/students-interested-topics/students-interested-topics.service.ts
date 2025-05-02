import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class StudentsInterestedTopicsService {

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
                            name: "Courses",
                            data: [47, 69, 37, 17, 28, 40]
                        }
                    ],
                    chart: {
                        type: "bar",
                        height: 424,
                        toolbar: {
                            show: false
                        }
                    },
                    colors: [
                        "#605DFF"
                    ],
                    plotOptions: {
                        bar: {
                            barHeight: '21px',
                            horizontal: true
                        }
                    },
                    grid: {
                        show: true,
                        borderColor: "#ECEEF2"
                    },
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        categories: [
                            "UX/UI Design",
                            "WordPress",
                            "Motion Design",
                            "Video Editing",
                            "Angular",
                            "Python"
                        ],
                        axisTicks: {
                            show: true,
                            color: '#ECEEF2'
                        },
                        axisBorder: {
                            show: true,
                            color: '#ECEEF2'
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
                        labels: {
                            style: {
                                colors: "#64748B",
                                fontSize: "12px"
                            }
                        },
                        axisBorder: {
                            show: true,
                            color: '#ECEEF2'
                        },
                        axisTicks: {
                            show: true,
                            color: '#ECEEF2'
                        }
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#lms_students_interested_topics_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}