function graph(key, id) {
    console.log("hi", data.dates.time);
    console.log(data[key]);
    console.log(id)

    new Chart(document.getElementById(id), {
        type: 'line',
        data: {
            labels: data.dates.time,
            datasets: [{
                data: data[key][key],
                label: key,
                borderColor: "#3e95cd",
                fill: false
            }
            ]
        },
        options: {
            title: {
                display: true,
                text: key
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: key,
                    },
                    ticks: {
                        min: 0
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Time(date)'
                    }
                }]
            }
        }
    });

}