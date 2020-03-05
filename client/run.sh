#!/bin/bash

if [[ ! -d ./node_modules ]]; then
  npm install
fi

npx ember server --proxy http://server:8080