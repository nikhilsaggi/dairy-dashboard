

function graph2(key, id, label) {
    var list = []
    console.log(data)

    data.forEach(cow => {
        if(cow[key]!= null){
            var x = cow[key][key]
            if(x != null) list.push(x)
        }

    })
    console.log(list)



    new Chart(document.getElementById(id), {
        type: 'line',
        data: {
            labels: data[0].dates.time,
            datasets: [{
                data: list[0],
                label: 'COW 2714',
                borderColor: "#3e95cd",
                fill: false
            },
            {
                data: list[1],
                label: 'COW 26',
                borderColor: "#128C55",
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
                        labelString: label,
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
function graph(key, id, timeTable, xTable, label) {


    console.log(timeTable, xTable)
    console.log(id)
    new Chart(document.getElementById(id), {
        type: 'line',
        data: {
            labels: timeTable,
            datasets: [{
                data: xTable,
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
                        labelString: label,
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