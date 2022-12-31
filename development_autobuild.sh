#!/bin/bash

# So that conf.py is set correctly to show TODO items
export BUILD_TYPE="Development"

rm -Rf _site
bundle exec jekyll serve --livereload
