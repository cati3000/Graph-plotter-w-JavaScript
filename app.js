// Define a simple arithmetic expression evaluator
function evaluateExpression(expression, xValue) {
    try {
        // Replace '^' with '**' for correct exponentiation
        expression = expression.replaceAll('^', '**');

        // Map trigonometric and other Math functions to their Math object counterparts
        const safeExpression = expression
            .replaceAll('sin', 'Math.sin')
            .replaceAll('cos', 'Math.cos')
            .replaceAll('tan', 'Math.tan')
            .replaceAll('x', `(${xValue})`);

        // Evaluate the expression
        const result = new Function('return ' + safeExpression)();
        return result;
    } catch (error) {
        console.error('Error evaluating expression:', error);
        throw new Error('Invalid mathematical expression.');
    }
}

// Function to generate data points from the user's input expression
function generateDataPoints(expression, rangeStart, rangeEnd) {
    const dataPoints = [];
    for (let x = rangeStart; x <= rangeEnd; x += 0.1) { // Smaller increment for more data points
        try {
            const y = evaluateExpression(expression, x);
            if (!isNaN(y)) {
                dataPoints.push({ x, y });
            }
        } catch (error) {
            console.error('Error generating data point:', error);
        }
    }
    return dataPoints;
}

// Initialize the chart
const ctx = document.getElementById('graphCanvas').getContext('2d');
window.myChart = new Chart(ctx, {
    type: 'line', // or 'scatter' based on your requirements
    data: {
        datasets: [{
            label: 'Expression Result',
            data: [], // Start with an empty data array
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    },
    options: {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom'
            },
            y: {
                beginAtZero: true
            }
        }
    }
});

// Function to update the chart with new data
function updateChart(expression, rangeStart, rangeEnd) {
    const dataPoints = generateDataPoints(expression, rangeStart, rangeEnd);
    window.myChart.data.datasets[0].data = dataPoints;
    window.myChart.update();
}

// Event listener for form submission
document.getElementById('function-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const expressionInput = document.getElementById('expressionInput').value;
    const rangeStart = Number(document.getElementById('rangeStart').value);
    const rangeEnd = Number(document.getElementById('rangeEnd').value);

    try {
        updateChart(expressionInput, rangeStart, rangeEnd);
    } catch (error) {
        console.error('Error updating chart:', error);
    }
});