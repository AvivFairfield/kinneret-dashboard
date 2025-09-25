import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { DatabaseService } from "../utils/database";
import "./FileUpload.css";

const FileUpload = ({ onDataUpload }) => {
	const [uploading, setUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState("");

	const determineDataType = (filename, data) => {
		const name = filename.toLowerCase();
		if (name.includes("cyano") || name.includes("bacteria")) {
			return "cyanobacteria";
		} else if (name.includes("chemistry") || name.includes("quality")) {
			return "chemistry";
		} else {
			return "probeProfiles";
		}
	};

	const parseExcelFile = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const data = new Uint8Array(e.target.result);
					const workbook = XLSX.read(data, { type: "array" });

					// Get first worksheet
					const firstSheetName = workbook.SheetNames[0];
					const worksheet = workbook.Sheets[firstSheetName];

					// Convert to JSON
					const jsonData = XLSX.utils.sheet_to_json(worksheet, {
						header: 1,
					});

					// Convert to objects with headers
					if (jsonData.length === 0) {
						reject(new Error("Excel file is empty"));
						return;
					}

					const headers = jsonData[0];
					const rows = jsonData.slice(1);

					const processedData = rows
						.filter((row) =>
							row.some(
								(cell) =>
									cell !== null &&
									cell !== undefined &&
									cell !== ""
							)
						)
						.map((row) => {
							const obj = {};
							headers.forEach((header, index) => {
								obj[header] = row[index] || "";
							});
							return obj;
						});

					resolve(processedData);
				} catch (error) {
					reject(error);
				}
			};
			reader.onerror = () =>
				reject(new Error("Failed to read Excel file"));
			reader.readAsArrayBuffer(file);
		});
	};

	const handleFileUpload = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		setUploading(true);
		setUploadStatus("📤 Processing file...");

		try {
			let results;
			const fileExtension = file.name.split(".").pop().toLowerCase();

			if (fileExtension === "csv") {
				// Handle CSV files
				results = await new Promise((resolve, reject) => {
					Papa.parse(file, {
						header: true,
						skipEmptyLines: true,
						complete: resolve,
						error: reject,
					});
				});
				results = results.data;
			} else if (["xlsx", "xls"].includes(fileExtension)) {
				// Handle Excel files
				results = await parseExcelFile(file);
			} else {
				throw new Error(
					"Unsupported file format. Please upload CSV or Excel files."
				);
			}

			const processedData = results.map((row) => ({
				...row,
				date: new Date(row.date || row.Date || row.DATE),
				...Object.keys(row).reduce((acc, key) => {
					const value = row[key];
					if (!isNaN(value) && value !== "" && value !== null) {
						acc[key] = parseFloat(value);
					} else {
						acc[key] = value;
					}
					return acc;
				}, {}),
			}));

			const dataType = determineDataType(file.name, processedData);

			// Save to database
			await DatabaseService.saveFileData(
				file.name,
				dataType,
				processedData
			);

			// Update dashboard
			onDataUpload(processedData, file.name, dataType);

			// Show success alert
			alert(`✅ Successfully uploaded ${processedData.length} records!`);

			// Clear the file input
			event.target.value = "";
		} catch (error) {
			console.error("Error processing file:", error);
			alert(`❌ Error: ${error.message}`);
		} finally {
			setUploading(false);
			setUploadStatus("");
		}
	};

	return (
		<div className="file-upload">
			<h3>📁 Upload Data File</h3>
			<input
				type="file"
				accept=".csv,.xlsx,.xls"
				onChange={handleFileUpload}
				disabled={uploading}
			/>
			<p className="file-types">Supported: CSV, Excel (.xlsx, .xls)</p>
			{uploading && (
				<div className="upload-status">📤 Processing file...</div>
			)}
		</div>
	);
};

export default FileUpload;
