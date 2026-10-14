#!/bin/bash
# Enciende la base de datos de Cerca. Dejá esta terminal abierta.
cd "$(dirname "$0")"
chmod +x pocketbase
./pocketbase superuser upsert admin@cerca.local cerca12345678 >/dev/null 2>&1
echo "========================================"
echo " Tu IP (ponela en lib/pocketbase.js):"
hostname -I 2>/dev/null | awk '{print "  http://"$1":8090"}'
echo " Panel: http://127.0.0.1:8090/_/"
echo " Usuario: admin@cerca.local  Clave: cerca12345678"
echo "========================================"
./pocketbase serve --http=0.0.0.0:8090
