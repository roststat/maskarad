#!/usr/bin/env bash
# Run on the confirmed Maskarad VPS after deploying the matching application.
set -euo pipefail

app_dir=/opt/maskarad/app
config=/etc/nginx/sites-available/maskarad
candidate="$app_dir/scripts/server/nginx/maskarad.conf"
backup_dir=/opt/maskarad/deploy-backups

[[ "$(id -u)" == 0 ]] || { echo 'Run as root on the confirmed VPS.' >&2; exit 1; }
[[ "$(readlink -f /etc/nginx/sites-enabled/maskarad)" == "$config" ]] || { echo 'Unexpected Nginx site attachment.' >&2; exit 1; }
[[ -f "$candidate" && -f "$config" ]] || exit 1
# Validate the existing shared Nginx configuration before changing this site.
nginx -t
if cmp -s "$candidate" "$config"; then
  echo 'Maskarad canonical host configuration already applied.'
  exit 0
fi
mkdir -p "$backup_dir"
backup="$backup_dir/maskarad-nginx-$(date -u +%Y%m%dT%H%M%SZ)-$$.conf"
cp -p "$config" "$backup"
installed=false
rollback() {
  if [[ "$installed" == true ]]; then
    cp -p "$backup" "$config"
    nginx -t && systemctl reload nginx
    echo "Restored Maskarad Nginx configuration from $backup" >&2
  fi
}
trap rollback EXIT
installed=true
install -m 0644 "$candidate" "$config"
nginx -t
systemctl reload nginx
installed=false
trap - EXIT
printf 'MASKARAD_CANONICAL_HOST_OK backup=%s\n' "$backup"
