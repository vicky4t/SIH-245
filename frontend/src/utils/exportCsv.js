export function exportToCsv(filename, data, headers) {
  if (!data || !data.length) {
    alert("No data available to export");
    return;
  }

  // If headers mapping provided: [{ key: 'id', label: 'ID' }, ...]
  const keys = headers ? headers.map(h => h.key) : Object.keys(data[0]);
  const headerLabels = headers ? headers.map(h => h.label) : keys;

  const csvRows = [];
  csvRows.push(headerLabels.join(","));

  for (const row of data) {
    const values = keys.map(k => {
      let val = row[k];
      if (val === null || val === undefined) val = "";
      if (typeof val === "object") val = JSON.stringify(val);
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\r\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
