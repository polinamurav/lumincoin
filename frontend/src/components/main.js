import { Chart, registerables } from 'chart.js';

export class Main {
    constructor() {
        console.log('ГЛАВНАЯ');

        Chart.register(...registerables);

        const ctx = document.getElementById('myChart').getContext('2d');
        const ctx2 = document.getElementById('diagram2').getContext('2d');

        const data = {
            labels: [
                'Red',
                'Orange',
                'Yellow',
                'Green',
                'Blue'
            ],
            datasets: [{
                label: 'My First Dataset',
                data: [250, 50, 100, 80, 60],
                backgroundColor: [
                    '#DC3545',
                    '#FD7E14',
                    '#FFC107',
                    '#20C997',
                    '#0D6EFD',
                ],
                hoverOffset: 4
            }]
        };

        new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive: true, //адаптивность графика
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            }
        });

        new Chart(ctx2, {
            type: 'pie',
            data: data,
            options: {
                responsive: true, //адаптивность графика
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            }
        });
    }
}
