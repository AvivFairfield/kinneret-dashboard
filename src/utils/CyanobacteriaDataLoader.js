import Papa from "papaparse";

class CyanobacteriaDataLoader {
	static async loadCSV(filePath) {
		try {
			const response = await fetch(filePath);
			const csvText = await response.text();

			return new Promise((resolve, reject) => {
				Papa.parse(csvText, {
					header: true,
					skipEmptyLines: true,
					complete: (results) => {
						if (results.errors.length > 0) {
							console.warn(
								"CSV parsing warnings:",
								results.errors
							);
						}
						resolve(results.data);
					},
					error: (error) => {
						reject(error);
					},
				});
			});
		} catch (error) {
			console.error(`Error loading CSV from ${filePath}:`, error);
			throw error;
		}
	}

	static async loadCyanobacteriaData() {
		try {
			console.log("Attempting to load cyanobacteria CSV files...");
			const [cyanobacteria1, cyanobacteria2] = await Promise.all([
				this.loadCSV(
					"/data/DateRange__2000-01-10 00_00_00_-_2023-09-18 00_00_00__Stations_A_Depths_NaN-NaN_Vars_cyanophyta_chroococales_2-microcystis_flos-aquae+cyanophyta_hormogonales_2-cylindrospermopsis_raciborskyi.csv"
				),
				this.loadCSV(
					"/data/DateRange__2000-01-10 00_00_00_-_2023-09-18 00_00_00__Stations_A_Depths_NaN-NaN_Vars_cyanophyta_hormogonales_2-aphanizomenon_oval.csv"
				),
			]);

			console.log("CSV files loaded successfully");
			return this.mergeCyanobacteriaData(cyanobacteria1, cyanobacteria2);
		} catch (error) {
			console.error("Failed to load cyanobacteria CSV files:", error);
			console.log("Falling back to sample data...");
			return this.generateSampleCyanobacteriaData();
		}
	}

	static mergeCyanobacteriaData(data1, data2) {
		console.log("Merging data1:", data1.length, "records");
		console.log("Merging data2:", data2.length, "records");

		// If data1 is empty but data2 has data, use data2 as base
		if (data1.length === 0 && data2.length > 0) {
			console.log("data1 is empty, using data2 as base");
			return data2
				.map((row2) => ({
					date: new Date(row2.date.replace(/"/g, "")),
					microcystis_flos_aquae: 0, // No data from data1
					cylindrospermopsis_raciborskyi: 0, // No data from data1
					aphanizomenon_ovalisporum: parseFloat(
						row2["cyanophyta_hormogonales_2-aphanizomenon_oval"] ||
							0
					),
				}))
				.sort((a, b) => a.date - b.date);
		}

		// If data2 is empty but data1 has data, use data1 as base
		if (data2.length === 0 && data1.length > 0) {
			console.log("data2 is empty, using data1 as base");
			return data1
				.map((row1) => ({
					date: new Date(row1.date.replace(/"/g, "")),
					microcystis_flos_aquae: parseFloat(
						row1[
							"cyanophyta_chroococales_2-microcystis_flos-aquae"
						] || 0
					),
					cylindrospermopsis_raciborskyi: parseFloat(
						row1[
							"cyanophyta_hormogonales_2-cylindrospermopsis_raciborskyi"
						] || 0
					),
					aphanizomenon_ovalisporum: 0, // No data from data2
				}))
				.sort((a, b) => a.date - b.date);
		}

		// Original merge logic for when both have data
		const merged = data1.map((row1) => {
			const row2 = data2.find((r) => r.date === row1.date);
			return {
				date: new Date(row1.date.replace(/"/g, "")),
				microcystis_flos_aquae: parseFloat(
					row1["cyanophyta_chroococales_2-microcystis_flos-aquae"] ||
						0
				),
				cylindrospermopsis_raciborskyi: parseFloat(
					row1[
						"cyanophyta_hormogonales_2-cylindrospermopsis_raciborskyi"
					] || 0
				),
				aphanizomenon_ovalisporum: parseFloat(
					row2?.["cyanophyta_hormogonales_2-aphanizomenon_oval"] || 0
				),
			};
		});

		return merged.sort((a, b) => a.date - b.date);
	}

	static generateSampleCyanobacteriaData() {
		const data = [];
		const startDate = new Date("2020-01-01");
		const endDate = new Date("2023-12-31");

		// Fix the infinite loop issue
		for (
			let d = new Date(startDate);
			d <= endDate;
			d.setMonth(d.getMonth() + 1)
		) {
			data.push({
				date: new Date(d), // Create new Date object to avoid reference issues
				microcystis_flos_aquae: Math.random() * 1000 + 100,
				cylindrospermopsis_raciborskyi: Math.random() * 500 + 50,
				aphanizomenon_ovalisporum: Math.random() * 300 + 30,
			});

			// Safety check to prevent infinite loops
			if (data.length > 100) break;
		}

		console.log(
			"Generated sample cyanobacteria data:",
			data.length,
			"records"
		);
		return data;
	}
}

export default CyanobacteriaDataLoader;
