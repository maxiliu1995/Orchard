#!/bin/bash

# Function to calculate directory size
calculate_size() {
    du -sh "$1" 2>/dev/null | cut -f1
}

# Function to show what would be deleted
show_files() {
    echo "Would remove the following:"
    find . -type f -name "*.log" -print
    find . -type d -name "node_modules" -not -path "./node_modules" -print
    find . -type d -name ".cache" -print
    find . -type d -name ".npm" -print
    find . -type d -name "dist" -print
    find . -type d -name "build" -print
    find . -type d -name ".next" -print
    find . -type d -name "out" -print
    find . -type d -name ".idea" -print
    find . -type d -name ".vscode" -print
    find . -type f -name ".DS_Store" -print
    find . -type f -name "Thumbs.db" -print
}

# Parse command line arguments
DRY_RUN=0
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --dry-run) DRY_RUN=1 ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Show initial project size
echo "Initial project size: $(calculate_size .)"

if [ $DRY_RUN -eq 1 ]; then
    show_files
    exit 0
fi

# Ask for confirmation
read -p "Are you sure you want to proceed with cleanup? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleanup cancelled."
    exit 1
fi

# Perform cleanup
echo "Starting cleanup..."

# Remove log files
find . -type f -name "*.log" -exec rm -f {} +

# Remove node_modules (except in root)
find . -type d -name "node_modules" -not -path "./node_modules" -exec rm -rf {} +

# Remove cache directories
find . -type d -name ".cache" -exec rm -rf {} +
find . -type d -name ".npm" -exec rm -rf {} +

# Remove build directories
find . -type d -name "dist" -exec rm -rf {} +
find . -type d -name "build" -exec rm -rf {} +
find . -type d -name ".next" -exec rm -rf {} +
find . -type d -name "out" -exec rm -rf {} +

# Remove IDE specific directories
find . -type d -name ".idea" -exec rm -rf {} +
find . -type d -name ".vscode" -exec rm -rf {} +

# Remove OS specific files
find . -type f -name ".DS_Store" -exec rm -f {} +
find . -type f -name "Thumbs.db" -exec rm -f {} +

# Show space saved
echo "Cleanup completed!"
echo "Final project size: $(calculate_size .)" 