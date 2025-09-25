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
                            console.warn("CSV parsing warnings:", results.errors);
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
            const [cyanobacteria1, cyanobacteria2] = await Promise.all([
                this.loadCSV(
                    "/data/DateRange__2000-01-10 00_00_00_-_2023-09-18 00_00_00__Stations_A_Depths_NaN-NaN_Vars_cyanophyta_chroococales_2-microcystis_flos-aquae+cyanophyta_hormogonales_2-cylindrospermopsis_raciborskyi.csv"
                ),
                this.loadCSV(
                    "/data/DateRange__2000-01-10 00_00_00_-_2023-09-18 00_00_00__Stations_A_Depths_NaN-NaN_Vars_cyanophyta_hormogonales_2-aphanizomenon_oval.csv"
                ),
            ]);

            return this.mergeCyanobacteriaData(cyanobacteria1, cyanobacteria2);
        } catch (error) {
            console.warn("Could not load cyanobacteria data:", error.message);
            return this.generateSampleCyanobacteriaData();
        }
    }

    static mergeCyanobacteriaData(data1, data2) {
        const merged = data1.map((row1) => {
            const row2 = data2.find((r) => r.date === row1.date);
            return {
                ...row1,
                ...row2,
                date: new Date(row1.date.replace(/"/g, "")),
                // Map the CSV column names to chart-friendly names
                microcystis_flos_aquae: parseFloat(
                    row1["cyanophyta_chroococales_2-microcystis_flos-aquae"] || 0
                ),
                cylindrospermopsis_raciborskyi: parseFloat(
                    row1["cyanophyta_hormogonales_2-cylindrospermopsis_raciborskyi"] || 0
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

        for (
            let d = new Date(startDate);
            d <= endDate;
            d.setMonth(d.getMonth() + 1)
        ) {
            data.push({
                date: new Date(d),
                microcystis_flos_aquae: Math.random() * 1000 + 100,
                cylindrospermopsis_raciborskyi: Math.random() * 500 + 50,
                aphanizomenon_ovalisporum: Math.random() * 300 + 30,
            });
        }

        return data;
    }
}

export default CyanobacteriaDataLoader;