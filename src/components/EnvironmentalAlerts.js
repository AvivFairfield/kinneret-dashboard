const formatAlertValue = (value, parameter) => {
	if (typeof value !== "number") return value;

	switch (parameter) {
		case "ph":
			return value.toFixed(1);
		case "temperature":
			return `${value.toFixed(1)}°C`;
		case "dissolved_oxygen":
			return `${value.toFixed(1)} mg/L`;
		case "turbidity":
			return `${value.toFixed(1)} NTU`;
		case "chloride":
			return `${value.toFixed(0)} mg/L`;
		default:
			return value.toFixed(2);
	}
};

// Update alert generation to use better formatting
const generateAlert = (value, parameter, date, threshold) => {
	return {
		type: "warning",
		message: `${parameter.replace(
			"_",
			" "
		)} out of range: ${formatAlertValue(value, parameter)}`,
		date: new Date(date).toLocaleDateString(),
		severity: getSeverity(value, parameter, threshold),
	};
};
