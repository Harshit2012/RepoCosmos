const themes = {
    default: {
        backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
        ],
        borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
        ]
    },
    dark: {
        backgroundColor: [
            'rgba(54, 54, 54, 0.2)',
            'rgba(77, 77, 77, 0.2)'
        ],
        borderColor: [
            'rgba(54, 54, 54, 1)',
            'rgba(77, 77, 77, 1)'
        ]
    },
    light: {
        backgroundColor: [
            'rgba(200, 200, 200, 0.2)',
            'rgba(220, 220, 220, 0.2)'
        ],
        borderColor: [
            'rgba(200, 200, 200, 1)',
            'rgba(220, 220, 220, 1)'
        ]
    },
    colorful: {
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)'
        ]
    }
};

document.getElementById('repoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const repository = document.getElementById('repository').value;
    const theme = document.getElementById('theme').value;

    fetch(`https://api.github.com/repos/${username}/${repository}`)
        .then(response => response.json())
        .then(data => {
            const forks = data.forks_count;
            const stars = data.stargazers_count;
            const themeColors = themes[theme];

            const ctx = document.getElementById('forksStarsChart').getContext('2d');
            if (window.forksStarsChart instanceof Chart) {
                window.forksStarsChart.destroy();
            }
            window.forksStarsChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Forks', 'Stars'],
                    datasets: [{
                        label: 'Count',
                        data: [forks, stars],
                        backgroundColor: themeColors.backgroundColor,
                        borderColor: themeColors.borderColor,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Count'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: repository
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching repository data:', error);
        });
});

document.getElementById('downloadButton').addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = window.forksStarsChart.toBase64Image();
    link.download = 'forks-stars-chart.png';
    link.click();
});
