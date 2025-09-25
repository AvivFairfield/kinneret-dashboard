import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapIntegration.css";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapIntegration = ({ data }) => {
	// Lake Kinneret coordinates
	const lakeCenter = [32.8, 35.6];

	// Monitoring stations with real coordinates
	const monitoringStations = [
		{
			id: "A",
			name: "Station A - North",
			position: [32.85, 35.58],
			location: "North",
			status: "Normal",
			lastUpdate: "2023-10-01",
			parameters: ["Temperature", "pH"],
		},
		{
			id: "B",
			name: "Station B - Center",
			position: [32.8, 35.6],
			location: "Center",
			status: "Warning",
			lastUpdate: "2023-10-02",
			parameters: ["Temperature", "pH", "Turbidity"],
		},
		{
			id: "C",
			name: "Station C - South",
			position: [32.75, 35.62],
			location: "South",
			status: "Normal",
			lastUpdate: "2023-10-03",
			parameters: ["Temperature", "pH", "Turbidity", "Conductivity"],
		},
	];

	return (
		<div className="map-integration">
			<h3>🗺️ Lake Kinneret Monitoring Stations</h3>

			<div className="map-container-leaflet">
				<MapContainer
					center={lakeCenter}
					zoom={11}
					style={{ height: "100%", width: "100%" }}
				>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					/>

					{/* Lake outline */}
					<Circle
						center={lakeCenter}
						radius={8000}
						pathOptions={{
							color: "#3498db",
							fillColor: "#74b9ff",
							fillOpacity: 0.3,
							weight: 2,
						}}
					/>

					{/* Monitoring stations */}
					{monitoringStations.map((station, index) => (
						<Marker key={index} position={station.position}>
							<Popup>
								<div>
									<h4>{station.name}</h4>
									<p>
										<strong>Status:</strong>{" "}
										{station.status}
									</p>
									<p>
										<strong>Last Update:</strong>{" "}
										{station.lastUpdate}
									</p>
									<p>
										<strong>Parameters:</strong>{" "}
										{station.parameters.join(", ")}
									</p>
								</div>
							</Popup>
						</Marker>
					))}
				</MapContainer>
			</div>

			<div className="station-status">
				<h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem" }}>
					Station Status
				</h4>
				{monitoringStations.map((station, index) => (
					<div key={index} className="station-item">
						<div className="station-dot"></div>
						<span>
							{station.name} - {station.location}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default MapIntegration;
