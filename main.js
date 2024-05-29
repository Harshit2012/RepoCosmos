document.getElementById('repoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const repository = document.getElementById('repository').value;

    fetch(`https://api.github.com/repos/${username}/${repository}`)
        .then(response => response.json())
        .then(data => {
            const forks = data.forks_count;
            const stars = data.stargazers_count;

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
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
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
                                text: 'Metric'
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