let myChart = null;

function updateChart(realPrice, marketPrice) {
    const ctx = document.getElementById('bubbleChart').getContext('2d');
    
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['ارزش واقعی', 'حباب'],
            datasets: [{
                data: [realPrice, Math.max(0, marketPrice - realPrice)],
                backgroundColor: ['#df920f', '#f4433620'],
                borderColor: ['#df920f', '#f44336'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            cutout: '80%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// اضافه کردن منطق محاسباتی (نسخه دقیق قبلی) به EventListener فرم
// ... (همان کدهایی که برای GoldCalculator نوشتیم اینجا قرار می‌گیرند)
// و در انتهای تابع displayResults، این را صدا بزن:
// updateChart(realPrice, marketPrice);