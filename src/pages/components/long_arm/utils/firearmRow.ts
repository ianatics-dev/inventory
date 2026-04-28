export function getGun(row: any) {
  return row?.gun ?? row?.guns ?? row ?? null;
}

export function getGunId(row: any): number | null {
  const g = getGun(row);
  const id = g?.id ?? row?.gun_id ?? null;
  return typeof id === "number" ? id : id ? Number(id) : null;
}

export function getLatestIssuedImages(row: any): string[] {
  const gun = getGun(row);
  const history = Array.isArray(gun?.history) ? gun.history : [];

  const issuedRows = history.filter((h: any) => h?.event_type === "ISSUED");
  if (!issuedRows.length) return [];

  const latest = issuedRows[0];
  const urls = Array.isArray(latest?.image_urls) ? latest.image_urls : [];

  return urls.filter(Boolean).slice(0, 2);
}