# 002-2 — Инвентаризация FTP-выгрузки старого сайта

Дата: 2026-10-02.

## Что сделано

- Добавлен скрипт `scripts/migration/inventory_old_site.py`.
- Из локальной FTP-выгрузки `old-site-source/ftp` и актуального SQL-дампа `old-site-source/db/maskarad-phpmyadmin-2026-10-02.sql` разобраны публичные CMS-источники: страницы, карточки, меню, URL и медиа.
- Исключены таблицы заказов, пользователей, администраторов и клиентских данных.
- Сформирован отчет `development-docs/reports/old-site-inventory/README.md`.
- Сформирована карта приоритетного переноса `development-docs/reports/old-site-inventory/priority-migration-map.md`.

## Доказательства

- `MASKARAD_SQL_PATH=old-site-source/db/maskarad-phpmyadmin-2026-10-02.sql python3 scripts/migration/inventory_old_site.py` сформировал CSV-отчеты.
- В отчете зафиксированы 159 страниц, 3542 карточки, 356 уникальных URL и 2653 медиафайла.
- `old-site-source/` добавлен в `.gitignore`, поэтому FTP-выгрузка не попадет в git.

## Следующее

- Продолжить точечный перенос коммерческих страниц: спектакли, услуги и выпускные/школьные/садовские кластеры.
- Использовать CSV-отчеты как карту URL, метаданных и медиа, а не как источник механического копирования.
