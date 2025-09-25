import React, { useEffect, useState } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { parseISO, isValid, format } from "date-fns";
import AIInsights from "./AIInsights";
import "./ChartWithFilters.css";

// ---- helpers ----
const toDate = (d) => {
	if (d instanceof Date) return d;
	if (typeof d === "string") {
		const p = parseISO(d); // handles "2021-07-01" etc.
		return isValid(p) ? p : new Date(d); // fallback for other strings
	}
	return new Date(d);
};

const toNum = (v) => (v == null || v === "" ? null : Number(v));

const CyanobacteriaChart = ({ data }) => {
	const [visibleLines, setVisibleLines] = useState({
		microcystis_flos_aquae: true,
		cylindrospermopsis_raciborskyi: true,
		aphanizomenon_ovalisporum: true,
	});

	// Build chart data safely for prod (no pre-formatting of dates)
	const chartData = (data ?? []).map((item) => ({
		date: toDate(item.date),
		microcystis_flos_aquae: toNum(item.microcystis_flos_aquae),
		cylindrospermopsis_raciborskyi: toNum(
			item.cylindrospermopsis_raciborskyi
		),
		aphanizomenon_ovalisporum: toNum(item.aphanizomenon_ovalisporum),
	}));

	const toggleLine = (key) =>
		setVisibleLines((prev) => ({ ...prev, [key]: !prev[key] }));

	// If inside a tab/accordion, force a layout pass so ResponsiveContainer measures correctly
	useEffect(() => {
		window.dispatchEvent(new Event("resize"));
	}, []);

	// Empty state instead of a blank chart
	if (!chartData.length) {
		return (
			<div className="chart-with-filters">
				<div className="chart-filters">
					<h4>Show Parameters:</h4>
					<div className="filter-checkboxes">
						<label>
							<input
								type="checkbox"
								checked={visibleLines.microcystis_flos_aquae}
								onChange={() =>
									toggleLine("microcystis_flos_aquae")
								}
							/>
							Microcystis flos-aquae (cells/mL)
						</label>
						<label>
							<input
								type="checkbox"
								checked={
									visibleLines.cylindrospermopsis_raciborskyi
								}
								onChange={() =>
									toggleLine("cylindrospermopsis_raciborskyi")
								}
							/>
							Cylindrospermopsis raciborskyi (cells/mL)
						</label>
						<label>
							<input
								type="checkbox"
								checked={visibleLines.aphanizomenon_ovalisporum}
								onChange={() =>
									toggleLine("aphanizomenon_ovalisporum")
								}
							/>
							Aphanizomenon ovalisporum (cells/mL)
						</label>
					</div>
				</div>
				<div style={{ padding: 16, opacity: 0.7 }}>
					No data available.
				</div>
			</div>
		);
	}

	return (
		<div className="chart-with-filters">
			<div className="chart-filters">
				<h4>Show Parameters:</h4>
				<div className="filter-checkboxes">
					<label>
						<input
							type="checkbox"
							checked={visibleLines.microcystis_flos_aquae}
							onChange={() =>
								toggleLine("microcystis_flos_aquae")
							}
						/>
						Microcystis flos-aquae (cells/mL)
					</label>
					<label>
						<input
							type="checkbox"
							checked={
								visibleLines.cylindrospermopsis_raciborskyi
							}
							onChange={() =>
								toggleLine("cylindrospermopsis_raciborskyi")
							}
						/>
						Cylindrospermopsis raciborskyi (cells/mL)
					</label>
					<label>
						<input
							type="checkbox"
							checked={visibleLines.aphanizomenon_ovalisporum}
							onChange={() =>
								toggleLine("aphanizomenon_ovalisporum")
							}
						/>
						Aphanizomenon ovalisporum (cells/mL)
					</label>
				</div>
			</div>

			<ResponsiveContainer width="100%" height={400}>
				<LineChart data={chartData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey="date"
						tickFormatter={(d) =>
							d ? format(new Date(d), "yyyy-MM") : ""
						}
					/>
					<YAxis />
					<Tooltip
						labelFormatter={(d) =>
							d ? format(new Date(d), "yyyy-MM") : ""
						}
					/>
					<Legend />
					{visibleLines.microcystis_flos_aquae && (
						<Line
							type="monotone"
							dataKey="microcystis_flos_aquae"
							stroke="#e74c3c"
							name="Microcystis flos-aquae (cells/mL)"
							dot={false}
						/>
					)}
					{visibleLines.cylindrospermopsis_raciborskyi && (
						<Line
							type="monotone"
							dataKey="cylindrospermopsis_raciborskyi"
							stroke="#f39c12"
							name="Cylindrospermopsis raciborskyi (cells/mL)"
							dot={false}
						/>
					)}
					{visibleLines.aphanizomenon_ovalisporum && (
						<Line
							type="monotone"
							dataKey="aphanizomenon_ovalisporum"
							stroke="#3498db"
							name="Aphanizomenon ovalisporum (cells/mL)"
							dot={false}
						/>
					)}
				</LineChart>
			</ResponsiveContainer>

			<AIInsights
				data={data}
				chartType="cyanobacteria"
				title="Cyanobacteria Analysis"
			/>
		</div>
	);
};

export default CyanobacteriaChart;
