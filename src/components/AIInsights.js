import React, { useState, useEffect } from "react";
import "./AIInsights.css";

const AIInsights = ({ data, chartType, title }) => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        generateInsights();
    }, [data, chartType]);

    const generateInsights = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Simulate AI processing time for better UX
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const dataSummary = prepareDataSummary(data, chartType);
            const smartInsights = generateAdvancedInsights(dataSummary, chartType);
            setInsights(smartInsights);
        } catch (err) {
            console.error('Error generating insights:', err);
            setError('Analysis temporarily unavailable');
            setInsights([{
                type: 'info',
                icon: '📊',
                title: 'Data Available',
                description: `Monitoring ${data?.length || 0} data points for ${chartType} analysis.`,
                confidence: 75
            }]);
        } finally {
            setLoading(false);
        }
    };

    const prepareDataSummary = (dataset, type) => {
        if (!dataset || dataset.length === 0) return null;

        const recent = dataset.slice(-10);
        const all = dataset;
        const summary = {
            dataType: type,
            totalPoints: dataset.length,
            recentPoints: recent.length,
            timeSpan: getTimeSpan(dataset)
        };

        switch (type) {
            case "cyanobacteria":
                summary.statistics = {
                    microcystis: calculateAdvancedStats(all, recent, 'microcystis_flos_aquae'),
                    cylindrospermopsis: calculateAdvancedStats(all, recent, 'cylindrospermopsis_raciborskyi'),
                    aphanizomenon: calculateAdvancedStats(all, recent, 'aphanizomenon_ovalisporum')
                };
                break;
            case "chemistry":
                summary.statistics = {
                    ph: calculateAdvancedStats(all, recent, 'avg_ph'),
                    turbidity: calculateAdvancedStats(all, recent, 'avg_turbidity'),
                    chloride: calculateAdvancedStats(all, recent, 'avg_cl'),
                    nitrate: calculateAdvancedStats(all, recent, 'avg_nitrate'),
                    nitrite: calculateAdvancedStats(all, recent, 'avg_nitrit')
                };
                break;
            case "probe":
                summary.statistics = {
                    temperature: calculateAdvancedStats(all, recent, 'temperature'),
                    ph: calculateAdvancedStats(all, recent, 'ph'),
                    chlorophyll: calculateAdvancedStats(all, recent, 'chlorophyll'),
                    dissolved_oxygen: calculateAdvancedStats(all, recent, 'dissolved_oxygen')
                };
                break;
        }

        return summary;
    };

    const getTimeSpan = (data) => {
        if (!data || data.length === 0) return null;
        const dates = data.map(d => new Date(d.date)).filter(d => !isNaN(d));
        if (dates.length === 0) return null;
        
        const earliest = new Date(Math.min(...dates));
        const latest = new Date(Math.max(...dates));
        const daysDiff = Math.ceil((latest - earliest) / (1000 * 60 * 60 * 24));
        
        return {
            earliest,
            latest,
            daysDiff,
            isRecent: daysDiff < 90
        };
    };

    const calculateAdvancedStats = (allData, recentData, field) => {
        const allValues = allData.map(item => parseFloat(item[field])).filter(val => !isNaN(val));
        const recentValues = recentData.map(item => parseFloat(item[field])).filter(val => !isNaN(val));
        
        if (allValues.length === 0) return null;

        const allAvg = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;
        const recentAvg = recentValues.length > 0 ? recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length : allAvg;
        
        return {
            min: Math.min(...allValues),
            max: Math.max(...allValues),
            avg: allAvg,
            recentAvg: recentAvg,
            trend: calculateTrend(allValues),
            recentTrend: calculateTrend(recentValues),
            volatility: calculateVolatility(allValues),
            percentile90: calculatePercentile(allValues, 90),
            percentile10: calculatePercentile(allValues, 10),
            changeFromHistorical: ((recentAvg - allAvg) / allAvg) * 100
        };
    };

    const calculateTrend = (values) => {
        if (values.length < 3) return 'insufficient_data';
        
        const firstThird = values.slice(0, Math.floor(values.length / 3));
        const lastThird = values.slice(-Math.floor(values.length / 3));
        
        const firstAvg = firstThird.reduce((sum, val) => sum + val, 0) / firstThird.length;
        const lastAvg = lastThird.reduce((sum, val) => sum + val, 0) / lastThird.length;
        
        const change = ((lastAvg - firstAvg) / firstAvg) * 100;
        
        if (change > 15) return 'strongly_increasing';
        if (change > 5) return 'increasing';
        if (change < -15) return 'strongly_decreasing';
        if (change < -5) return 'decreasing';
        return 'stable';
    };

    const calculateVolatility = (values) => {
        if (values.length < 2) return 0;
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return Math.sqrt(variance);
    };

    const calculatePercentile = (values, percentile) => {
        const sorted = [...values].sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[index];
    };

    const generateAdvancedInsights = (dataSummary, chartType) => {
        const insights = [];
        const stats = dataSummary?.statistics;
        const timeSpan = dataSummary?.timeSpan;

        if (chartType === 'cyanobacteria' && stats) {
            // Microcystis analysis
            if (stats.microcystis) {
                const level = stats.microcystis.recentAvg || stats.microcystis.avg;
                if (level > 2000) {
                    insights.push({
                        type: 'danger',
                        icon: '🚨',
                        title: 'Critical Microcystis Bloom',
                        description: `Severe bloom detected at ${Math.round(level)} cells/mL. Immediate water contact restrictions recommended. Potential liver toxicity risk.`,
                        confidence: 95
                    });
                } else if (level > 1000) {
                    insights.push({
                        type: 'danger',
                        icon: '⚠️',
                        title: 'High Microcystis Levels',
                        description: `Dangerous levels at ${Math.round(level)} cells/mL. Swimming and water sports not recommended. Monitor for symptoms.`,
                        confidence: 92
                    });
                } else if (level > 500) {
                    insights.push({
                        type: 'warning',
                        icon: '🔶',
                        title: 'Elevated Microcystis',
                        description: `Moderate risk at ${Math.round(level)} cells/mL. Limit water contact, especially for children and pets.`,
                        confidence: 88
                    });
                } else if (level > 100) {
                    insights.push({
                        type: 'info',
                        icon: '📊',
                        title: 'Low Microcystis Detected',
                        description: `Manageable levels at ${Math.round(level)} cells/mL. Continue monitoring for bloom development.`,
                        confidence: 85
                    });
                } else if (level > 0) {
                    insights.push({
                        type: 'success',
                        icon: '✅',
                        title: 'Safe Microcystis Levels',
                        description: `Minimal presence at ${Math.round(level)} cells/mL. Water contact generally safe for recreation.`,
                        confidence: 90
                    });
                }

                // Trend analysis
                if (stats.microcystis.recentTrend === 'strongly_increasing') {
                    insights.push({
                        type: 'warning',
                        icon: '📈',
                        title: 'Rapid Microcystis Growth',
                        description: 'Sharp upward trend detected. Bloom conditions may be developing rapidly. Increase monitoring frequency.',
                        confidence: 87
                    });
                }
            }

            // Multi-species analysis
            if (stats.cylindrospermopsis && stats.aphanizomenon) {
                const totalCyano = (stats.cylindrospermopsis.recentAvg || 0) + (stats.aphanizomenon.recentAvg || 0) + (stats.microcystis?.recentAvg || 0);
                if (totalCyano > 1500) {
                    insights.push({
                        type: 'warning',
                        icon: '🦠',
                        title: 'Multi-Species Bloom',
                        description: `Combined cyanobacteria at ${Math.round(totalCyano)} cells/mL. Multiple toxin-producing species present.`,
                        confidence: 89
                    });
                }
            }
        }

        if (chartType === 'chemistry' && stats) {
            // pH analysis
            if (stats.ph) {
                const ph = stats.ph.recentAvg || stats.ph.avg;
                if (ph < 6.0) {
                    insights.push({
                        type: 'danger',
                        icon: '🔴',
                        title: 'Acidic Water Conditions',
                        description: `pH at ${ph.toFixed(1)} is dangerously acidic. Harmful to aquatic life and may corrode infrastructure.`,
                        confidence: 94
                    });
                } else if (ph > 9.0) {
                    insights.push({
                        type: 'danger',
                        icon: '🔵',
                        title: 'Highly Alkaline Water',
                        description: `pH at ${ph.toFixed(1)} is excessively alkaline. May indicate algae blooms or chemical contamination.`,
                        confidence: 92
                    });
                } else if (ph < 6.5 || ph > 8.5) {
                    insights.push({
                        type: 'warning',
                        icon: '⚗️',
                        title: 'pH Outside Optimal Range',
                        description: `pH at ${ph.toFixed(1)} stresses aquatic ecosystems. Optimal range: 6.5-8.5 for freshwater lakes.`,
                        confidence: 88
                    });
                } else {
                    insights.push({
                        type: 'success',
                        icon: '⚗️',
                        title: 'Healthy pH Levels',
                        description: `pH at ${ph.toFixed(1)} supports diverse aquatic life and ecosystem stability.`,
                        confidence: 91
                    });
                }
            }

            // Turbidity analysis
            if (stats.turbidity) {
                const turb = stats.turbidity.recentAvg || stats.turbidity.avg;
                if (turb > 25) {
                    insights.push({
                        type: 'warning',
                        icon: '🌊',
                        title: 'High Turbidity Levels',
                        description: `Turbidity at ${turb.toFixed(1)} NTU severely limits light penetration. May indicate erosion or algae blooms.`,
                        confidence: 86
                    });
                } else if (turb > 10) {
                    insights.push({
                        type: 'info',
                        icon: '🌊',
                        title: 'Elevated Turbidity',
                        description: `Turbidity at ${turb.toFixed(1)} NTU reduces water clarity. Monitor for sediment sources.`,
                        confidence: 82
                    });
                }
            }

            // Nutrient analysis
            if (stats.nitrate && stats.nitrite) {
                const totalN = (stats.nitrate.recentAvg || 0) + (stats.nitrite.recentAvg || 0);
                if (totalN > 5) {
                    insights.push({
                        type: 'warning',
                        icon: '🌱',
                        title: 'Elevated Nitrogen Levels',
                        description: `Total nitrogen at ${totalN.toFixed(2)} mg/L promotes algae growth. Potential eutrophication risk.`,
                        confidence: 84
                    });
                }
            }
        }

        if (chartType === 'probe' && stats) {
            // Temperature analysis
            if (stats.temperature) {
                const temp = stats.temperature.recentAvg || stats.temperature.avg;
                if (temp > 30) {
                    insights.push({
                        type: 'danger',
                        icon: '🌡️',
                        title: 'Critically High Temperature',
                        description: `Water temperature at ${temp.toFixed(1)}°C creates severe stress for cold-water fish. Promotes harmful algae blooms.`,
                        confidence: 93
                    });
                } else if (temp > 25) {
                    insights.push({
                        type: 'warning',
                        icon: '🌡️',
                        title: 'Elevated Water Temperature',
                        description: `Temperature at ${temp.toFixed(1)}°C favors algae growth and reduces oxygen solubility.`,
                        confidence: 89
                    });
                } else if (temp < 10) {
                    insights.push({
                        type: 'info',
                        icon: '❄️',
                        title: 'Cold Water Conditions',
                        description: `Temperature at ${temp.toFixed(1)}°C indicates seasonal cooling. Beneficial for oxygen levels.`,
                        confidence: 85
                    });
                }
            }

            // Dissolved oxygen analysis
            if (stats.dissolved_oxygen) {
                const do_level = stats.dissolved_oxygen.recentAvg || stats.dissolved_oxygen.avg;
                if (do_level < 4) {
                    insights.push({
                        type: 'danger',
                        icon: '💨',
                        title: 'Critical Oxygen Depletion',
                        description: `DO at ${do_level.toFixed(1)} mg/L threatens fish survival. Immediate ecosystem stress. Possible fish kills.`,
                        confidence: 96
                    });
                } else if (do_level < 6) {
                    insights.push({
                        type: 'warning',
                        icon: '💨',
                        title: 'Low Dissolved Oxygen',
                        description: `DO at ${do_level.toFixed(1)} mg/L stresses aquatic life. Cold-water fish particularly vulnerable.`,
                        confidence: 91
                    });
                } else if (do_level > 15) {
                    insights.push({
                        type: 'info',
                        icon: '💨',
                        title: 'Supersaturated Oxygen',
                        description: `DO at ${do_level.toFixed(1)} mg/L indicates intense photosynthesis. Possible algae bloom activity.`,
                        confidence: 83
                    });
                } else {
                    insights.push({
                        type: 'success',
                        icon: '💨',
                        title: 'Optimal Oxygen Levels',
                        description: `DO at ${do_level.toFixed(1)} mg/L supports healthy aquatic ecosystems and fish populations.`,
                        confidence: 94
                    });
                }
            }

            // Chlorophyll analysis
            if (stats.chlorophyll) {
                const chl = stats.chlorophyll.recentAvg || stats.chlorophyll.avg;
                if (chl > 30) {
                    insights.push({
                        type: 'danger',
                        icon: '🌿',
                        title: 'Severe Algae Bloom',
                        description: `Chlorophyll at ${chl.toFixed(1)} μg/L indicates hypereutrophic conditions. Water quality severely impaired.`,
                        confidence: 92
                    });
                } else if (chl > 15) {
                    insights.push({
                        type: 'warning',
                        icon: '🌿',
                        title: 'Active Algae Bloom',
                        description: `Chlorophyll at ${chl.toFixed(1)} μg/L shows eutrophic conditions. Recreational use may be impacted.`,
                        confidence: 88
                    });
                } else if (chl > 7) {
                    insights.push({
                        type: 'info',
                        icon: '🌿',
                        title: 'Moderate Algae Activity',
                        description: `Chlorophyll at ${chl.toFixed(1)} μg/L indicates mesotrophic conditions. Monitor for bloom development.`,
                        confidence: 84
                    });
                }
            }
        }

        // Seasonal and temporal insights
        if (timeSpan && timeSpan.isRecent) {
            insights.push({
                type: 'info',
                icon: '📅',
                title: 'Recent Data Analysis',
                description: `Analysis based on ${timeSpan.daysDiff} days of recent monitoring data. Trends reflect current conditions.`,
                confidence: 80
            });
        }

        // Default insight if no specific conditions met
        if (insights.length === 0) {
            insights.push({
                type: 'success',
                icon: '📊',
                title: 'Parameters Within Acceptable Range',
                description: `Current monitoring shows ${dataSummary?.totalPoints || 0} data points with values within typical ranges for lake ecosystems.`,
                confidence: 82
            });
        }

        return insights.slice(0, 3); // Limit to top 3 most important insights
    };

    if (loading) {
        return (
            <div className="ai-insights loading">
                <div className="loading-animation">
                    <div className="pulse"></div>
                    <p>Analyzing water quality data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ai-insights">
            <div className="insight-header">
                <h4>🤖 Advanced Water Quality Analysis</h4>
                <button onClick={generateInsights} className="refresh-btn" title="Refresh Analysis">
                    🔄
                </button>
            </div>
            
            <div className="insights-list">
                {insights.map((insight, index) => (
                    <div key={index} className={`insight-card ${insight.type}`}>
                        <div className="insight-icon">{insight.icon}</div>
                        <div className="insight-content">
                            <h5>{insight.title}</h5>
                            <p>{insight.description}</p>
                            <div className="confidence">
                                Confidence: {insight.confidence}%
                                <div className="confidence-bar">
                                    <div 
                                        className="confidence-fill" 
                                        style={{ width: `${insight.confidence}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AIInsights;