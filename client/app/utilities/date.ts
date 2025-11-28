export function getFormattedDate(date: Date = new Date()) {
	const today = date.toLocaleDateString("lt-LT", {
		month: "long",
		day: "numeric",
		weekday: "long",
	});
	const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);

	return formattedDate;
}
