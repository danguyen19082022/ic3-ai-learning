export function downloadCsv(name, rows) {
  const content = '\uFEFF' + rows.map(r=>r.join(',')).join('\n');
  const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
}
