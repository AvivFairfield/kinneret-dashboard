import React, { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import DataLoader from "./utils/DataLoader";
import CyanobacteriaDataLoader from "./utils/CyanobacteriaDataLoader";

function App() {
	const [data, setData] = useState({
		cyanobacteria: [],
		chemistry: [],
		probeProfiles: [],
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				// Load regular data with original loader
				const regularData = await DataLoader.loadAllData();

				// Load cyanobacteria data with specialized loader
				const cyanobacteriaData =
					await CyanobacteriaDataLoader.loadCyanobacteriaData();

				const loadedData = {
					...regularData,
					cyanobacteria: cyanobacteriaData,
				};

				console.log("Loaded data:", loadedData);
				setData(loadedData);
			} catch (error) {
				console.error("Error loading data:", error);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	const handleDataUpdate = (newData) => {
		setData((prevData) => ({
			...prevData,
			...newData,
		}));
	};

	if (loading) {
		return (
			<div className="App">
				<div className="loading">Loading Kinneret Lake data...</div>
			</div>
		);
	}

	return (
		<div className="App">
			<header className="App-header">
				<h1>Hydraph - Kinneret Lake Water Quality Dashboard</h1>
				<p>
					Real-time monitoring and analysis of Lake Kinneret's
					ecosystem
				</p>
			</header>
			<Dashboard data={data} onDataUpdate={handleDataUpdate} />
		</div>
	);
}

export default App;
