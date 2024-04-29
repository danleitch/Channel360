#!/bin/bash

# Base release name
BASE_RELEASE_NAME="core-services"

# Chart name (unused in restart, but kept for consistency)
CHART_NAME="c360-service"

# Path to your values files
VALUES_PATH="./c360-service/values/staging"

# Loop through each values file in the staging directory
for VALUES_FILE in $VALUES_PATH/*.yaml; do
    # Extract the microservice name from the values file name
    # This strips the path and the .yaml extension, leaving just the microservice identifier
    SERVICE_NAME=$(basename $VALUES_FILE .yaml)

    # Construct the full release name by appending the microservice name to the base release name
    FULL_DEPLOYMENT_NAME="${SERVICE_NAME}-depl"

    # Perform a rollout restart for each microservice's deployment
    echo "Restarting deployments for $SERVICE_NAME with release name $FULL_DEPLOYMENT_NAME"
    kubectl rollout restart deployment $FULL_DEPLOYMENT_NAME

    # Optional: Add a pause or wait for confirmation if needed between restarts
    # read -p "Press enter to continue to the next service"
done

echo "All specified services have been restarted."
