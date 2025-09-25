import Papa from "papaparse";

class DataLoader {
	static async loadCSV(filePath) {
		const response = await fetch(filePath);
		const csvText = await response.text();

		return new Promise((resolve) => {
			Papa.parse(csvText, {
				header: true,
				skipEmptyLines: true,
				complete: (results) => {
					resolve(results.data);
				},
			});
		});
	}

	static async loadAllData() {
		const [cyanobacteria1, cyanobacteria2, chemistry, probeProfiles] =
			await Promise.all([
				this.loadCSV(
					"/data/DateRange__2000-01-10 00_00_00_-_2023-09-18 00_00_00__Stations_A_Depths_NaN-NaN_Vars_cyanophyta_chroococales_2-microcystis_flos-aquae+cyanophyta_hormogonales_2-cylindrospermopsis_raciborskyi.csv"
				),
				this.loadCSV(
					"/data/DateRange__2000-01-10 00_00_00_-_2023-09-18 00_00_00__Stations_A_Depths_NaN-NaN_Vars_cyanophyta_hormogonales_2-aphanizomenon_oval.csv"
				),
				this.loadCSV("/data/iolr.chemistry_00-20.csv"),
				this.loadCSV("/data/iolr.a_probe_profiles.csv"),
			]);

		return {
			cyanobacteria: this.mergeCyanobacteriaData(
				cyanobacteria1,
				cyanobacteria2
			),
			chemistry: this.processChemistryData(chemistry),
			probeProfiles: this.processProbeData(probeProfiles),
		};
	}

	static mergeCyanobacteriaData(data1, data2) {
		// Merge the two cyanobacteria datasets by date
		const merged = data1.map((row1) => {
			const row2 = data2.find((r) => r.date === row1.date);
			return {
				...row1,
				...row2,
				date: new Date(row1.date.replace(/"/g, "")),
			};
		});
		return merged.sort((a, b) => a.date - b.date);
	}

	static processChemistryData(data) {
		return data
			.map((row) => ({
				...row,
				date: new Date(row.date),
				avg_cl: parseFloat(row.avg_cl),
				avg_nitrate: parseFloat(row.avg_nitrate),
				avg_nitrit: parseFloat(row.avg_nitrit),
				avg_ph: parseFloat(row.avg_ph),
				avg_turbidity: parseFloat(row.avg_turbidity),
			}))
			.sort((a, b) => a.date - b.date);
	}

	static processProbeData(data) {
		return data
			.map((row) => ({
				...row,
				date: new Date(row.date || `${row.year}-01-01`),
				temperature: parseFloat(
					row.temperature || row[Object.keys(row)[4]]
				),
				chlorophyll: parseFloat(
					row.chlorophyll || row[Object.keys(row)[5]]
				),
				ph: parseFloat(row.ph || row[Object.keys(row)[6]]),
				dissolved_oxygen: parseFloat(
					row.dissolved_oxygen || row[Object.keys(row)[7]]
				),
			}))
			.sort((a, b) => a.date - b.date);
	}
}

export default DataLoader;
