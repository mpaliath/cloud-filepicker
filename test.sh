#!/bin/bash

# Get all packages with "react" in their name
packages=$(npm search react | awk '{print $1}')

# Loop through each package and get its download count
for package in $packages
do
  downloads=$(npm-stat downloads $package)
  echo "$package: $downloads"
done
