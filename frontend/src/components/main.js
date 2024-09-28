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
                'Blue',
                'Yellow'
            ],
            datasets: [{
                label: 'My First Dataset',
                data: [300, 50, 100],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
        };

        const data2 = {
            labels: [
                'Red',
                'Blue',
                'Yellow'
            ],
            datasets: [{
                label: 'My First Dataset',
                data: [300, 50, 100],
                backgroundColor: [
                    'rgb(208,29,29)',
                    'rgb(54,84,235)',
                    'rgb(255,241,86)'
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
            data: data2,
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
