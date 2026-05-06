#!/bin/bash

export GIT_REPOSITORY_LINK="$GIT_REPOSITORY_LINK";

git clone "$GIT_REPOSITORY_LINK" /home/app/output

exec node /home/app/output/dist/index.js