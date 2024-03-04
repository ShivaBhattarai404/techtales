export function dateFormatter(date, format) {
  const newDate = new Date(date);
  return newDate.toLocaleDateString(
    "en-US",
    format || { year: "numeric", month: "long", day: "numeric" }
  );
}
