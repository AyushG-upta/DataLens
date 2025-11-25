 
 tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        violet: { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065', },
                    }
                }
            }
        }

        const state = {
            data: [],
            headers: [],
            fileName: null,
            analysis: null,
            darkMode: true,
            activeTab: 'overview',
            charts: {}, // Store Chart.js instances to destroy them later
            scatterX: '',
            scatterY: ''
        };

        // --- DOM Elements ---
        const els = {
            html: document.documentElement,
            header: document.getElementById('header'),
            brandText: document.getElementById('brand-text'),
            themeToggle: document.getElementById('theme-toggle'),
            themeIcon: document.getElementById('theme-icon'),
            bgLight: document.getElementById('bg-light'),
            bgDark: document.getElementById('bg-dark'),
            
            // Views
            viewUpload: document.getElementById('view-upload'),
            viewLoading: document.getElementById('view-loading'),
            viewDashboard: document.getElementById('view-dashboard'),
            
            // Upload
            fileInput: document.getElementById('file-input'),
            dropZone: document.getElementById('drop-zone'),
            errorMessage: document.getElementById('error-message'),
            errorText: document.getElementById('error-text'),
            
            // Header Info
            fileBadge: document.getElementById('file-badge'),
            filenameDisplay: document.getElementById('filename-display'),
            actionButtons: document.getElementById('action-buttons'),
            btnReset: document.getElementById('btn-reset'),
            btnDownload: document.getElementById('btn-download'),

            // Tabs
            tabContainer: document.getElementById('tab-container'),
            tabBtns: document.querySelectorAll('.tab-btn'),
            
            // Tab Contents
            contentOverview: document.getElementById('tab-content-overview'),
            contentVisuals: document.getElementById('tab-content-visuals'),
            contentData: document.getElementById('tab-content-data'),
            
            // Grids/Containers
            statsGrid: document.getElementById('stats-grid'),
            columnsGrid: document.getElementById('columns-grid'),
            chartsGrid: document.getElementById('charts-grid'),
            scatterSection: document.getElementById('scatter-section'),
            correlationSection: document.getElementById('correlation-section'),
            correlationTable: document.getElementById('correlation-table'),
            scatterX: document.getElementById('scatter-x'),
            scatterY: document.getElementById('scatter-y'),
            
            // Table
            tableHeadRow: document.getElementById('table-head-row'),
            tableBody: document.getElementById('table-body'),
            
            // Styling elements that change with theme
            heroTitle: document.getElementById('hero-title'),
            heroSubtitle: document.getElementById('hero-subtitle'),
            uploadIconBg: document.getElementById('upload-icon-bg'),
            uploadText: document.getElementById('upload-text'),
            uploadSubtext: document.getElementById('upload-subtext'),
        };

        // --- Initialization ---
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();
            updateTheme();
            
            // Event Listeners
        els.themeToggle.addEventListener('click', toggleTheme);
        els.fileInput.addEventListener('change', handleFileUpload);
        
        // Removed the click listener on dropZone to prevent double-triggering
        
        els.dropZone.addEventListener('dragover', (e) => { e.preventDefault(); els.dropZone.classList.add('border-violet-500', 'bg-neutral-900/80'); });
        els.dropZone.addEventListener('dragleave', (e) => { e.preventDefault(); els.dropZone.classList.remove('border-violet-500', 'bg-neutral-900/80'); });
        els.dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                els.dropZone.classList.remove('border-violet-500', 'bg-neutral-900/80');
                if (e.dataTransfer.files.length) handleFileUpload({ target: { files: e.dataTransfer.files } });
            });
            
            els.btnReset.addEventListener('click', resetApp);
            els.btnDownload.addEventListener('click', downloadAnalysis);
            
            // Tab Switching
            els.tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tab = btn.dataset.tab;
                    setActiveTab(tab);
                });
            });

            // Scatter Plot Listeners
            els.scatterX.addEventListener('change', (e) => { state.scatterX = e.target.value; renderScatterPlot(); });
            els.scatterY.addEventListener('change', (e) => { state.scatterY = e.target.value; renderScatterPlot(); });
        });

        // --- Logic: Theme ---
        function toggleTheme() {
            state.darkMode = !state.darkMode;
            updateTheme();
        }

        function updateTheme() {
            const isDark = state.darkMode;
            if (isDark) {
                els.html.classList.add('dark');
                els.bgDark.classList.remove('hidden');
                els.bgLight.classList.add('hidden');
                els.themeIcon.setAttribute('data-lucide', 'sun');
                
                // Header styling
                els.header.classList.replace('bg-white/70', 'bg-black/80');
                els.header.classList.replace('border-slate-200/60', 'border-neutral-900');
                els.brandText.classList.replace('text-slate-900', 'text-white');
                
                // Upload styling
                els.dropZone.className = "group relative flex flex-col items-center justify-center w-full max-w-xl h-64 rounded-3xl cursor-pointer border-2 border-dashed transition-all duration-300 shadow-sm overflow-hidden bg-neutral-900/40 border-neutral-800 hover:border-violet-500 hover:bg-neutral-900/80";
                els.uploadIconBg.className = "w-16 h-16 mb-4 rounded-2xl flex items-center justify-center transition-transform shadow-sm group-hover:scale-110 bg-neutral-800 text-violet-400";
                els.uploadText.className = "mb-2 text-lg font-semibold group-hover:text-violet-500 transition-colors text-slate-200";
                els.uploadSubtext.className = "text-sm text-slate-500";
                els.heroTitle.className = "text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white";
                els.heroSubtitle.className = "text-lg text-slate-400";
                
                // Tab container
                els.tabContainer.className = "flex p-1.5 rounded-2xl border shadow-inner bg-neutral-900 border-neutral-800";
                
            } else {
                els.html.classList.remove('dark');
                els.bgDark.classList.add('hidden');
                els.bgLight.classList.remove('hidden');
                els.themeIcon.setAttribute('data-lucide', 'moon');
                
                // Header styling
                els.header.classList.replace('bg-black/80', 'bg-white/70');
                els.header.classList.replace('border-neutral-900', 'border-slate-200/60');
                els.brandText.classList.replace('text-white', 'text-slate-900');

                // Upload styling
                els.dropZone.className = "group relative flex flex-col items-center justify-center w-full max-w-xl h-64 rounded-3xl cursor-pointer border-2 border-dashed transition-all duration-300 shadow-sm overflow-hidden bg-white/60 border-slate-300 hover:border-violet-500 hover:bg-violet-50/30";
                els.uploadIconBg.className = "w-16 h-16 mb-4 rounded-2xl flex items-center justify-center transition-transform shadow-sm group-hover:scale-110 bg-violet-50 text-violet-600";
                els.uploadText.className = "mb-2 text-lg font-semibold group-hover:text-violet-500 transition-colors text-slate-700";
                els.uploadSubtext.className = "text-sm text-slate-400";
                els.heroTitle.className = "text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900";
                els.heroSubtitle.className = "text-lg text-slate-500";
                
                // Tab container
                els.tabContainer.className = "flex p-1.5 rounded-2xl border shadow-inner bg-slate-200/50 border-slate-200/60 backdrop-blur-sm";
            }
            
            // Re-render active tab buttons
            updateTabStyling();
            
            // If charts exist, update their colors (requires re-rendering)
            if (state.analysis) renderVisuals();
            
            lucide.createIcons();
        }

        // --- Logic: Data Processing ---
        function handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
                showError("Please upload a valid CSV file.");
                return;
            }
            
            state.fileName = file.name;
            els.filenameDisplay.textContent = file.name;
            showView('loading');
            
            setTimeout(() => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const result = parseCSV(e.target.result);
                        if (result && result.data.length > 0) {
                            state.data = result.data;
                            state.headers = result.headers;
                            runAnalysis();
                            renderApp();
                        } else {
                            showError("Could not parse CSV or file is empty.");
                            showView('upload');
                        }
                    } catch (err) {
                        console.error(err);
                        showError("Error parsing file. Check format.");
                        showView('upload');
                    }
                };
                reader.readAsText(file);
            }, 300);
        }

        function parseCSV(text) {
            const lines = text.split('\n').filter(l => l.trim() !== '');
            if (lines.length < 2) return null;
            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            const data = lines.slice(1).map(line => {
                const regex = /(?:^|,)(\"(?:[^\"]+|\"\")*\"|[^,]*)/g;
                let matches = [];
                let match;
                while ((match = regex.exec(line))) {
                    matches.push(match[1].replace(/^"|"$/g, '').replace(/""/g, '"'));
                }
                if (matches.length === 0) matches = line.split(',');
                
                const obj = {};
                headers.forEach((h, i) => {
                    let val = matches[i]?.trim();
                    if (val && !isNaN(val) && val !== '') val = parseFloat(val);
                    obj[h] = val;
                });
                return obj;
            });
            return { headers, data };
        }

        function runAnalysis() {
            const { data, headers } = state;
            const stats = {};
            const numericCols = [];

            headers.forEach(col => {
                const values = data.map(row => row[col]);
                const validValues = values.filter(v => v !== undefined && v !== '' && v !== null);
                const numericValues = validValues.filter(v => typeof v === 'number');
                const isNumeric = numericValues.length > validValues.length * 0.5;

                if (isNumeric) {
                    numericCols.push(col);
                    const sum = numericValues.reduce((a, b) => a + b, 0);
                    const mean = sum / numericValues.length;
                    const median = getMedian(numericValues);
                    const stdDev = getStdDev(numericValues, mean);
                    const min = Math.min(...numericValues);
                    const max = Math.max(...numericValues);

                    stats[col] = {
                        type: 'numeric',
                        mean: mean.toFixed(2),
                        median: median.toFixed(2),
                        stdDev: stdDev.toFixed(2),
                        min,
                        max,
                        count: numericValues.length,
                        missing: data.length - validValues.length,
                        histogram: createHistogram(data, col)
                    };
                } else {
                    const counts = {};
                    validValues.forEach(v => counts[v] = (counts[v] || 0) + 1);
                    const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
                    const top = sortedCounts[0];

                    stats[col] = {
                        type: 'categorical',
                        unique: Object.keys(counts).length,
                        top: top ? `${top[0]} (${Math.round((top[1] / validValues.length) * 100)}%)` : 'N/A',
                        count: validValues.length,
                        missing: data.length - validValues.length,
                        chartData: sortedCounts.slice(0, 10).map(([k, v]) => ({ name: k.substring(0, 15), value: v }))
                    };
                }
            });

            // Correlation
            const correlationMatrix = [];
            const targetCols = numericCols.slice(0, 8);
            targetCols.forEach(rowCol => {
                const row = { name: rowCol };
                targetCols.forEach(colCol => {
                    if (rowCol === colCol) {
                        row[colCol] = 1;
                    } else {
                        const x = []; const y = [];
                        data.forEach(d => {
                            if (typeof d[rowCol] === 'number' && typeof d[colCol] === 'number') {
                                x.push(d[rowCol]); y.push(d[colCol]);
                            }
                        });
                        row[colCol] = getCorrelation(x, y);
                    }
                });
                correlationMatrix.push(row);
            });

            state.analysis = { stats, numericCols, correlationMatrix };
            
            // Set default scatter
            if (numericCols.length >= 2) {
                state.scatterX = numericCols[0];
                state.scatterY = numericCols[1];
            }
        }

        // Stats Helpers
        const getMedian = (arr) => {
            if (arr.length === 0) return 0;
            const sorted = [...arr].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        };
        const getStdDev = (arr, mean) => {
            if (arr.length === 0) return 0;
            const squareDiffs = arr.map(val => Math.pow(val - mean, 2));
            const avgSqDiff = squareDiffs.reduce((a, b) => a + b, 0) / arr.length;
            return Math.sqrt(avgSqDiff);
        };
        const getCorrelation = (x, y) => {
            const n = x.length;
            if (n !== y.length || n === 0) return 0;
            const sumX = x.reduce((a, b) => a + b, 0);
            const sumY = y.reduce((a, b) => a + b, 0);
            const sumXY = x.reduce((s, xi, i) => s + xi * y[i], 0);
            const sumX2 = x.reduce((s, xi) => s + xi * xi, 0);
            const sumY2 = y.reduce((s, yi) => s + yi * yi, 0);
            const num = (n * sumXY) - (sumX * sumY);
            const den = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));
            return den === 0 ? 0 : num / den;
        };
        const createHistogram = (data, key, buckets = 10) => {
            const vals = data.map(d => d[key]).filter(v => typeof v === 'number');
            if (vals.length === 0) return [];
            const min = Math.min(...vals);
            const max = Math.max(...vals);
            if (min === max) return [{ name: min.toFixed(1), count: vals.length }];
            const step = (max - min) / buckets;
            const hist = Array.from({ length: buckets }, (_, i) => ({
                name: (min + i * step).toFixed(1),
                count: 0
            }));
            vals.forEach(v => {
                const idx = Math.min(Math.floor((v - min) / step), buckets - 1);
                if(hist[idx]) hist[idx].count++;
            });
            return hist;
        };

        // --- Logic: Rendering ---
        function renderApp() {
            showView('dashboard');
            els.fileBadge.classList.remove('hidden');
            els.fileBadge.classList.add('flex');
            els.actionButtons.classList.remove('hidden');
            
            renderOverview();
            renderVisuals();
            renderData();
        }

        function renderOverview() {
            const { stats, numericCols } = state.analysis;
            
            // Stats Grid
            const metrics = [
                { label: 'Rows', val: state.data.length.toLocaleString(), color: 'text-violet-500' },
                { label: 'Columns', val: state.headers.length, color: state.darkMode ? 'text-slate-200' : 'text-slate-700' },
                { label: 'Numeric', val: numericCols.length, color: 'text-emerald-500' },
                { label: 'Categorical', val: state.headers.length - numericCols.length, color: 'text-amber-500' }
            ];
            
            els.statsGrid.innerHTML = metrics.map(m => `
                <div class="rounded-2xl border transition-all duration-300 p-6 flex flex-col items-center justify-center py-6 ${state.darkMode ? 'bg-black border-neutral-800 shadow-[0_0_15px_-3px_rgba(255,255,255,0.03)] text-slate-200' : 'bg-white border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] text-slate-800'}">
                    <span class="text-3xl font-extrabold tracking-tight ${m.color}">${m.val}</span>
                    <span class="text-xs font-bold uppercase tracking-wider mt-1 ${state.darkMode ? 'text-slate-500' : 'text-slate-400'}">${m.label}</span>
                </div>
            `).join('');

            // Columns Grid
            els.columnsGrid.innerHTML = state.headers.map(col => {
                const s = stats[col];
                const isNum = s.type === 'numeric';
                const completeness = ((1 - (s.missing / state.data.length)) * 100).toFixed(0);
                
                const cardBase = `rounded-2xl border transition-all duration-300 p-6 ${state.darkMode ? 'bg-black border-neutral-800 text-slate-200' : 'bg-white border-slate-100 text-slate-800'} relative group overflow-hidden`;
                const hoverBorder = isNum 
                    ? (state.darkMode ? 'hover:border-emerald-900/50' : 'hover:border-emerald-200')
                    : (state.darkMode ? 'hover:border-amber-900/50' : 'hover:border-amber-200');
                
                const iconBg = isNum 
                    ? (state.darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                    : (state.darkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600');
                    
                const pillBg = completeness < 100 
                    ? (state.darkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-500')
                    : (state.darkMode ? 'bg-neutral-800 text-slate-500' : 'bg-slate-100 text-slate-400');

                let details = '';
                if (isNum) {
                    const boxClass = `p-2 rounded-lg ${state.darkMode ? 'bg-neutral-900' : 'bg-slate-50'}`;
                    const labelClass = `text-[10px] uppercase font-bold ${state.darkMode ? 'text-slate-500' : 'text-slate-400'}`;
                    const valClass = `font-mono font-medium truncate ${state.darkMode ? 'text-slate-300' : 'text-slate-700'}`;
                    
                    details = `
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div class="${boxClass}"><div class="${labelClass}">Mean</div><div class="${valClass}">${s.mean}</div></div>
                            <div class="${boxClass}"><div class="${labelClass}">Median</div><div class="${valClass}">${s.median}</div></div>
                            <div class="${boxClass}"><div class="${labelClass}">Std Dev</div><div class="${valClass}">${s.stdDev}</div></div>
                            <div class="${boxClass}"><div class="${labelClass}">Range</div><div class="${valClass}">${s.min} - ${s.max}</div></div>
                        </div>
                    `;
                } else {
                    const rowClass = `p-2 rounded-lg ${state.darkMode ? 'bg-neutral-900' : 'bg-slate-50'}`;
                    details = `
                        <div class="flex justify-between items-center ${rowClass}">
                            <span class="text-xs font-bold uppercase ${state.darkMode ? 'text-slate-500' : 'text-slate-400'}">Unique</span>
                            <span class="font-mono font-medium ${state.darkMode ? 'text-slate-300' : 'text-slate-700'}">${s.unique}</span>
                        </div>
                        <div class="mt-2 ${rowClass}">
                            <span class="text-xs font-bold uppercase block mb-1 ${state.darkMode ? 'text-slate-500' : 'text-slate-400'}">Most Common</span>
                            <span class="font-medium text-sm truncate block ${state.darkMode ? 'text-slate-300' : 'text-slate-700'}" title="${s.top}">${s.top}</span>
                        </div>
                    `;
                }

                return `
                    <div class="${cardBase} ${hoverBorder}">
                        <div class="flex justify-between items-start mb-4">
                            <div class="flex items-center gap-2 max-w-[80%]">
                                <div class="p-1.5 rounded-lg shrink-0 ${iconBg}">
                                    <i data-lucide="${isNum ? 'hash' : 'type'}" width="14"></i>
                                </div>
                                <h3 class="font-bold truncate" title="${col}">${col}</h3>
                            </div>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${pillBg}">${completeness}% Filled</span>
                        </div>
                        <div class="space-y-3">${details}</div>
                    </div>
                `;
            }).join('');
            
            lucide.createIcons();
        }

        function renderVisuals() {
            // Destroy all previous charts
            Object.values(state.charts).forEach(c => c.destroy());
            state.charts = {};

            const { stats, numericCols, correlationMatrix } = state.analysis;
            const gridColor = state.darkMode ? '#333' : '#e2e8f0';
            const textColor = state.darkMode ? '#94a3b8' : '#64748b';

            // 1. Scatter Plot
            if (numericCols.length >= 2) {
                els.scatterSection.classList.remove('hidden');
                els.scatterSection.className = `rounded-2xl border transition-all duration-300 p-6 ${state.darkMode ? 'bg-black border-neutral-800 text-slate-200' : 'bg-white border-slate-100 text-slate-800'}`;
                
                // Populate Selects
                const options = numericCols.map(c => `<option value="${c}">${c}</option>`).join('');
                if (els.scatterX.innerHTML === '') { // Only populate if empty
                    els.scatterX.innerHTML = options;
                    els.scatterY.innerHTML = options;
                    els.scatterX.value = state.scatterX;
                    els.scatterY.value = state.scatterY;
                }
                
                renderScatterPlot();
            }

            // 2. Correlation
            if (numericCols.length > 1) {
                els.correlationSection.classList.remove('hidden');
                els.correlationSection.className = `rounded-2xl border transition-all duration-300 p-6 ${state.darkMode ? 'bg-black border-neutral-800 text-slate-200' : 'bg-white border-slate-100 text-slate-800'}`;
                
                let tableHtml = '<thead><tr><th class="p-2"></th>';
                correlationMatrix.forEach(r => tableHtml += `<th class="p-2 font-bold max-w-[100px] truncate text-xs ${state.darkMode ? 'text-slate-400' : 'text-slate-600'}" title="${r.name}">${r.name}</th>`);
                tableHtml += '</tr></thead><tbody>';
                
                correlationMatrix.forEach(row => {
                    tableHtml += `<tr><td class="p-2 font-bold text-left max-w-[100px] truncate text-xs ${state.darkMode ? 'text-slate-400' : 'text-slate-600'}" title="${row.name}">${row.name}</td>`;
                    correlationMatrix.forEach(col => {
                        const val = row[col.name];
                        let bg, text;
                        if (val > 0.7) { bg = 'bg-violet-500'; text = 'text-white'; }
                        else if (val > 0.3) { bg = state.darkMode ? 'bg-violet-900/50' : 'bg-violet-200'; text = state.darkMode ? 'text-violet-200' : 'text-violet-800'; }
                        else if (val < -0.7) { bg = 'bg-red-500'; text = 'text-white'; }
                        else if (val < -0.3) { bg = state.darkMode ? 'bg-red-900/50' : 'bg-red-100'; text = state.darkMode ? 'text-red-200' : 'text-red-800'; }
                        else { bg = state.darkMode ? 'bg-neutral-900' : 'bg-slate-50'; text = state.darkMode ? 'text-slate-400' : 'text-slate-800'; }
                        
                        tableHtml += `<td class="p-1"><div class="py-2 rounded-md font-mono text-xs ${bg} ${text}">${val !== undefined ? val.toFixed(2) : '-'}</div></td>`;
                    });
                    tableHtml += '</tr>';
                });
                tableHtml += '</tbody>';
                els.correlationTable.innerHTML = tableHtml;
            }

            // 3. Distributions
            els.chartsGrid.innerHTML = ''; // Clear container
            
            state.headers.forEach((col, idx) => {
                const s = stats[col];
                const cardClass = `rounded-2xl border transition-all duration-300 p-6 min-h-[400px] flex flex-col ${state.darkMode ? 'bg-black border-neutral-800 text-slate-200' : 'bg-white border-slate-100 text-slate-800'}`;
                
                if (s.type === 'categorical' && s.unique <= 15) {
                    const canvasId = `chart-cat-${idx}`;
                    const card = document.createElement('div');
                    card.className = cardClass;
                    card.innerHTML = `
                        <h3 class="font-bold mb-6 flex items-center gap-2"><i data-lucide="bar-chart-2" width="16" class="text-amber-500"></i> ${col} Distribution</h3>
                        <div class="flex-1 w-full min-h-[300px] relative"><canvas id="${canvasId}"></canvas></div>
                    `;
                    els.chartsGrid.appendChild(card);
                    
                    const ctx = document.getElementById(canvasId).getContext('2d');
                    state.charts[canvasId] = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: s.chartData.map(d => d.name),
                            datasets: [{ label: 'Count', data: s.chartData.map(d => d.value), backgroundColor: '#fbbf24', borderRadius: 4 }]
                        },
                        options: {
                            indexAxis: 'y',
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                x: { grid: { display: false }, ticks: { color: textColor } },
                                y: { grid: { display: false }, ticks: { color: textColor } }
                            }
                        }
                    });
                } else if (s.type === 'numeric') {
                    const canvasId = `chart-num-${idx}`;
                    const card = document.createElement('div');
                    card.className = cardClass;
                    card.innerHTML = `
                        <h3 class="font-bold mb-6 flex items-center gap-2"><i data-lucide="trending-up" width="16" class="text-emerald-500"></i> ${col} Histogram</h3>
                        <div class="flex-1 w-full min-h-[300px] relative"><canvas id="${canvasId}"></canvas></div>
                    `;
                    els.chartsGrid.appendChild(card);

                    const ctx = document.getElementById(canvasId).getContext('2d');
                    state.charts[canvasId] = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: s.histogram.map(d => d.name),
                            datasets: [{ label: 'Frequency', data: s.histogram.map(d => d.count), backgroundColor: '#10b981', barPercentage: 1.0, categoryPercentage: 1.0 }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                x: { grid: { color: gridColor }, ticks: { color: textColor } },
                                y: { grid: { color: gridColor }, ticks: { color: textColor } }
                            }
                        }
                    });
                }
            });
            lucide.createIcons();
        }

        function renderScatterPlot() {
            const ctx = document.getElementById('scatterChart').getContext('2d');
            if (state.charts['scatterChart']) state.charts['scatterChart'].destroy();
            
            const scatterData = state.data.slice(0, 500).map(row => ({
                x: row[state.scatterX],
                y: row[state.scatterY]
            })).filter(p => !isNaN(p.x) && !isNaN(p.y));

            const gridColor = state.darkMode ? '#333' : '#e2e8f0';
            const textColor = state.darkMode ? '#94a3b8' : '#64748b';

            state.charts['scatterChart'] = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Data Points',
                        data: scatterData,
                        backgroundColor: '#8b5cf6'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { 
                            title: { display: true, text: state.scatterX, color: textColor },
                            grid: { color: gridColor },
                            ticks: { color: textColor }
                        },
                        y: { 
                            title: { display: true, text: state.scatterY, color: textColor },
                            grid: { color: gridColor },
                            ticks: { color: textColor }
                        }
                    }
                }
            });
        }

        function renderData() {
            // Header
            els.tableHeadRow.innerHTML = state.headers.map(h => `<th class="px-6 py-4 font-bold tracking-wider whitespace-nowrap">${h}</th>`).join('');
            
            // Body (Limit to 100 rows for performance)
            const rows = state.data.slice(0, 100).map((row, i) => {
                const trClass = `transition-colors ${state.darkMode ? 'bg-black hover:bg-neutral-900' : 'bg-white hover:bg-violet-50/50'}`;
                const tds = state.headers.map(h => {
                    const val = row[h] !== undefined ? row[h] : '<span class="opacity-50">-</span>';
                    return `<td class="px-6 py-3 whitespace-nowrap truncate max-w-[200px] font-mono text-xs">${val}</td>`;
                }).join('');
                return `<tr class="${trClass}">${tds}</tr>`;
            }).join('');
            
            els.tableBody.innerHTML = rows;
        }

        // --- UI Helpers ---
        function setActiveTab(tab) {
            state.activeTab = tab;
            
            // Hide all contents
            els.contentOverview.classList.add('hidden');
            els.contentVisuals.classList.add('hidden');
            els.contentData.classList.add('hidden');
            
            // Show active
            if (tab === 'overview') els.contentOverview.classList.remove('hidden');
            if (tab === 'visuals') {
                els.contentVisuals.classList.remove('hidden');
                renderVisuals(); // Re-render charts to fix canvas sizing issues
            }
            if (tab === 'data') els.contentData.classList.remove('hidden');
            
            updateTabStyling();
        }

        function updateTabStyling() {
            els.tabBtns.forEach(btn => {
                const isSelected = btn.dataset.tab === state.activeTab;
                if (isSelected) {
                    btn.className = `tab-btn flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm ${state.darkMode ? 'bg-neutral-800 text-white' : 'bg-white text-violet-700'}`;
                } else {
                    btn.className = `tab-btn flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${state.darkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`;
                }
            });
        }

        function showView(viewName) {
            els.viewUpload.classList.add('hidden');
            els.viewLoading.classList.add('hidden');
            els.viewDashboard.classList.add('hidden');
            
            if (viewName === 'upload') els.viewUpload.classList.remove('hidden');
            if (viewName === 'loading') els.viewLoading.classList.remove('hidden');
            if (viewName === 'dashboard') els.viewDashboard.classList.remove('hidden');
        }

        function showError(msg) {
            els.errorText.textContent = msg;
            els.errorMessage.classList.remove('hidden');
        }

        function resetApp() {
            state.data = [];
            state.headers = [];
            state.fileName = null;
            state.analysis = null;
            state.activeTab = 'overview';
            state.scatterX = '';
            state.scatterY = '';
            
            els.fileInput.value = '';
            els.filenameDisplay.textContent = '';
            els.fileBadge.classList.add('hidden');
            els.fileBadge.classList.remove('flex');
            els.actionButtons.classList.add('hidden');
            els.errorMessage.classList.add('hidden');
            
            // Clear Scatter Plot Dropdowns so they regenerate for new data
            els.scatterX.innerHTML = '';
            els.scatterY.innerHTML = '';
            
            showView('upload');
            setActiveTab('overview');
        }
        
        function downloadAnalysis() {
            if (!state.analysis) return;
            const jsonString = JSON.stringify(state.analysis.stats, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const href = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.download = `${state.fileName || 'data'}_analysis.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
