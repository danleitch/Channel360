#!/bin/bash

# Base release name
BASE_RELEASE_NAME="core-services"

# Chart name
CHART_NAME="c360-service"

# Path to your values files
VALUES_PATH="./c360-service/values/staging"

# Helm repo update (optional, uncomment if you need to update your Helm repo)
# helm repo update

echo "Starting upgrade process..."

# Loop through each values file in the staging directory
for VALUES_FILE in $VALUES_PATH/*.yaml; do
    # Extract the microservice name from the values file name
    SERVICE_NAME=$(basename $VALUES_FILE .yaml)

    # Construct the full release name by appending the microservice name to the base release name
    FULL_RELEASE_NAME="${BASE_RELEASE_NAME}-${SERVICE_NAME}"

    # Build and execute the Helm upgrade command for each microservice
    echo "Upgrading $SERVICE_NAME with release name $FULL_RELEASE_NAME"
    helm upgrade $FULL_RELEASE_NAME $CHART_NAME -f $VALUES_FILE

    # Check if the upgrade was successful
    if [ $? -eq 0 ]; then
        echo "$SERVICE_NAME upgraded successfully."
    else
        echo "Failed to upgrade $SERVICE_NAME. Check the logs for errors."
        # Optional: Exit the script if an upgrade fails
        # exit 1
    fi

    # Optional: Add a pause or wait for confirmation if needed between upgrades
    # read -p "Press enter to continue to the next service"
done

echo "Upgrade process completed."
