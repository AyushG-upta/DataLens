DataLens Pro - EDA Dashboard

DataLens Pro is a modern, lightweight, and privacy-focused Exploratory Data Analysis (EDA) tool that runs entirely in your browser. It allows data scientists and analysts to instantly visualize distributions, correlations, and summary statistics from CSV files without writing a single line of code or uploading data to a server.

> Features

> Instant Analysis

Zero-Latency Processing: Drag and drop a CSV file to immediately generate insights.

Smart Detection: Automatically identifies numeric versus categorical columns.

Descriptive Statistics: Calculates Mean, Median, Standard Deviation, Min/Max, and Missing Value percentages instantly.

> Advanced Visualization

Interactive Scatter Plot: Select any two numeric variables to visualize relationships dynamically.

Correlation Matrix: A heatmap table displaying Pearson correlation coefficients between numeric variables.

Auto-Generated Charts:

Histograms for numeric data distribution.

Bar Charts for categorical frequency counts.

> Modern UI/UX

AMOLED Dark Mode: Features a toggleable, high-contrast dark theme optimized for OLED screens.

Glassmorphism Design: A polished interface with translucent elements and subtle gradients.

Responsive Layout: Fully functional on desktops, tablets, and mobile devices.

> Privacy First

Client-Side Only: All data processing happens locally within the browser using JavaScript. No data is ever sent to an external server.

>Technology Stack

HTML5 - Semantic structure.

Tailwind CSS - Utility-first styling for rapid UI development and Dark Mode.

Vanilla JavaScript (ES6+) - Core logic for parsing CSVs and calculating statistics.

Chart.js - Responsive, canvas-based charting library.

Lucide Icons - Lightweight, consistent iconography.

> File Structure

If you have separated the code into files as recommended:

/DataLens-Pro
│
├── index.html      # Main HTML structure and library CDNs
├── style.css       # Custom styles (Scrollbars, Glassmorphism)
└── script.js       # Core application logic, state management, and Chart.js config


> How to Run

Since DataLens Pro is a static web application, it requires no backend server installation.

Option 1: Direct Open

Download the project files.

Double-click index.html.

The application will launch in your default web browser.

Option 2: Local Server (Recommended)

For the best experience (avoiding CORS issues with local files in some browsers), run it with a simple local server like VSCode Live Server or Python:

# Python 3
python -m http.server 8000


Then navigate to http://localhost:8000.

> Usage Guide

Upload: Drag and drop a .csv file onto the upload zone or click to select one from your computer.

Overview Tab: View high-level metrics (row count, column count) and specific stats for every column.

Visualizations Tab:

Use the Variable Relationship Explorer dropdowns to plot two specific columns against each other.

Check the Correlation Matrix to find patterns.

Scroll down to see individual distribution charts for every column.

Raw Data: Switch to the "Raw Data" tab to inspect the first 100 rows of your dataset.

Export: Click the Download icon in the header to save the calculated statistical analysis as a .json file.

Reset: Click "Reset" to clear the data and upload a new file.

> Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Fork the project.

Create your feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

> License

This project is open source and available under the MIT License.
