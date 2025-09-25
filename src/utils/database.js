import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database operations
export const DatabaseService = {
	// Get all saved files
	async getSavedFiles() {
		const { data, error } = await supabase
			.from("uploaded_files")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) throw error;
		return data;
	},

	// Save uploaded file data
	async saveFileData(filename, dataType, data) {
		const { data: result, error } = await supabase
			.from("uploaded_files")
			.insert({
				filename,
				data_type: dataType,
				data: data,
				record_count: data.length,
				created_at: new Date().toISOString(),
			})
			.select();

		if (error) throw error;
		return result[0];
	},

	// Delete file
	async deleteFile(id) {
		const { error } = await supabase
			.from("uploaded_files")
			.delete()
			.eq("id", id);

		if (error) throw error;
	},

	// Get all data for dashboard
	async getAllData() {
		const { data, error } = await supabase
			.from("uploaded_files")
			.select("*");

		if (error) throw error;

		// Group by data type
		const grouped = {
			cyanobacteria: [],
			chemistry: [],
			probeProfiles: [],
		};

		data.forEach((file) => {
			if (grouped[file.data_type]) {
				grouped[file.data_type].push(...file.data);
			}
		});

		console.log("Grouped data:", grouped); // Debug log

		// Process the data to match chart expectations
		const processed = {
			cyanobacteria: this.processCyanobacteriaData(grouped.cyanobacteria),
			chemistry: this.processChemistryData(grouped.chemistry),
			probeProfiles: this.processProbeData(grouped.probeProfiles),
		};

		console.log("Processed data:", processed); // Debug log
		return processed;
	},

	processCyanobacteriaData(data) {
		console.log("Raw cyanobacteria sample:", data.slice(0, 2));

		// Group by date to merge multiple records for the same date
		const groupedByDate = {};

		data.forEach((row) => {
			// Better date parsing
			let date;
			const dateStr = row.date
				? row.date.toString().replace(/"/g, "")
				: "";
			date = new Date(dateStr);

			if (isNaN(date.getTime()) && dateStr.includes("-")) {
				const parts = dateStr.split("-");
				if (parts.length === 3) {
					date = new Date(`${parts[1]} ${parts[0]}, ${parts[2]}`);
				}
			}

			if (isNaN(date.getTime())) return; // Skip invalid dates

			const dateKey = date.toISOString().split("T")[0]; // Use date as key

			if (!groupedByDate[dateKey]) {
				groupedByDate[dateKey] = {
					date: date,
					microcystis_flos_aquae: 0,
					cylindrospermopsis_raciborskyi: 0,
					aphanizomenon_ovalisporum: 0,
				};
			}

			// Sum values from this row (instead of Math.max)
			const current = groupedByDate[dateKey];
			current.microcystis_flos_aquae += parseFloat(
				row.microcystis_flos_aquae ||
					row["cyanophyta_chroococales_2-microcystis_flos-aquae"] ||
					0
			);
			current.cylindrospermopsis_raciborskyi += parseFloat(
				row.cylindrospermopsis_raciborskyi ||
					row[
						"cyanophyta_hormogonales_2-cylindrospermopsis_raciborskyi"
					] ||
					0
			);
			current.aphanizomenon_ovalisporum += parseFloat(
				row.aphanizomenon_ovalisporum ||
					row["cyanophyta_hormogonales_2-aphanizomenon_oval"] ||
					0
			);
		});

		// Convert back to array and sort
		return Object.values(groupedByDate).sort((a, b) => a.date - b.date);
	},

	processChemistryData(data) {
		return data
			.map((row) => ({
				...row,
				date: new Date(row.date),
				avg_cl: parseFloat(row.avg_cl || 0),
				avg_nitrate: parseFloat(row.avg_nitrate || 0),
				avg_nitrit: parseFloat(row.avg_nitrit || 0),
				avg_ph: parseFloat(row.avg_ph || 0),
				avg_turbidity: parseFloat(row.avg_turbidity || 0),
			}))
			.filter((row) => !isNaN(row.date.getTime()))
			.sort((a, b) => a.date - b.date);
	},

	processProbeData(data) {
		console.log("Raw probe data sample:", data.slice(0, 2));
		return data
			.map((row) => {
				// Better date parsing
				let date;
				const dateStr = row.date
					? row.date.toString().replace(/"/g, "")
					: "";
				date = new Date(dateStr);

				if (isNaN(date.getTime()) && dateStr.includes("-")) {
					const parts = dateStr.split("-");
					if (parts.length === 3) {
						date = new Date(`${parts[1]} ${parts[0]}, ${parts[2]}`);
					}
				}

				const processed = {
					...row,
					date: date,
					temperature: parseFloat(row.temp_deg_c_avg || 0),
					chlorophyll: parseFloat(row.chl_ug_l_avg || 0),
					ph: parseFloat(row.ph_units_avg || 0),
					dissolved_oxygen: parseFloat(row.hdo_mg_l_avg || 0),
				};
				return processed;
			})
			.filter((row) => !isNaN(row.date.getTime()))
			.sort((a, b) => a.date - b.date);
	},
};
