#!/bin/sh
# Arma index.html del sistema de SebaChavez Car Service:
# núcleo (tools/base.html) + módulos Sistema VB (menú digital, Club, garantías, RR. HH., tareas…).
# Los módulos son los mismos de la demo raveholding/tallermecnicoSVBdemo (carpeta tools/).
set -e
D=$(dirname "$0")
cp "$D/base.html" index.html
python3 "$D/demo_patch.py" index.html --cliente
