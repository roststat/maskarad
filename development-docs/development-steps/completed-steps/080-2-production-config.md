# 080-2 — Выпуск и серверная конфигурация

23 октября 2026. Код опубликован в `26ecfbcc84d6c21fcde294333321ad4c70865036` через origin/main. Штатный maskarad-auto-deploy.service завершился с Result=success; серверные HEAD и маркер успешного выпуска совпали.

Применён только `/etc/nginx/sites-available/maskarad`. Резервная копия: `/opt/maskarad/deploy-backups/maskarad-nginx-20261023T114523Z-888205.conf`. Nginx -t успешен до и после установки, reload успешен. Предупреждения о http2/OCSP присутствовали ещё до изменения и относятся к другим virtual hosts; их конфигурации не редактировались.

Доказательства: серверный HEAD/маркер и systemd success + Nginx -t/reload, PM2 maskarad-site online; maxflok-site и все процессы Fractera также online. Секреты и заявки не читались и не менялись.
