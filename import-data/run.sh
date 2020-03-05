#!/bin/bash

cd /import-data

if [[ ! -d ./node_modules ]]; then
  npm install
fi

node index.js