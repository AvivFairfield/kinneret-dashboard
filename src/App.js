import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import { DatabaseService } from "./utils/database";
import "./App.css";

function App() {
	const [data, setData] = useState({
		cyanobacteria: [],
		chemistry: [],
		probeProfiles: [],
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadDataFromDatabase();
	}, []);

	const loadDataFromDatabase = async () => {
		try {
			const dbData = await DatabaseService.getAllData();
			console.log("Loaded data from database:", dbData);
			setData(dbData);
		} catch (error) {
			console.error("Error loading data from database:", error);
			// Fallback to original data loading if database fails
			loadFallbackData();
		} finally {
			setLoading(false);
		}
	};

	const loadFallbackData = async () => {
		// Your original data loading logic here as fallback
		console.log("Using fallback data loading...");
	};

	const handleDataUpdate = async () => {
		// Reload all data from database
		const updatedData = await DatabaseService.getAllData();
		console.log("Updated data:", updatedData); // Debug log
		setData(updatedData);
	};

	if (loading) {
		return (
			<div className="App">
				<div className="water-particles">
					<div className="water-particle"></div>
					<div className="water-particle"></div>
					<div className="water-particle"></div>
					<div className="water-particle"></div>
					<div className="water-particle"></div>
					<div className="water-particle"></div>
					<div className="water-particle"></div>
					<div className="water-particle"></div>
					<div className="water-particle"></div>
				</div>
				<div className="loading">Loading Kinneret Lake data...</div>
			</div>
		);
	}

	return (
		<div className="App">
			<div className="water-particles">
				<div className="water-particle"></div>
				<div className="water-particle"></div>
				<div className="water-particle"></div>
				<div className="water-particle"></div>
				<div className="water-particle"></div>
				<div className="water-particle"></div>
				<div className="water-particle"></div>
				<div className="water-particle"></div>
				<div className="water-particle"></div>
			</div>
			<header className="App-header">
				<div className="header-droplets">
					<div className="header-droplet"></div>
					<div className="header-droplet"></div>
					<div className="header-droplet"></div>
					<div className="header-droplet"></div>
					<div className="header-droplet"></div>
					<div className="header-droplet"></div>
				</div>
				<h1>Hydraph - Kinneret Lake Water Quality Dashboard</h1>
				<p>
					Real-time monitoring and analysis of Lake Kinneret's
					ecosystem
				</p>
				<div className="header-wave"></div>
			</header>
			<Dashboard data={data} onDataUpdate={handleDataUpdate} />
		</div>
	);
}

export default App;
