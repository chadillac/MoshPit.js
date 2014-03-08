#!/bin/bash 

preamble=$(cat preamble.txt);

exec uglifyjs --preamble "$preamble" -e -m -v ../moshpit.js;
