# Getting Started with Cocktail Virtualization

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all the required packages to run the app.\

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Server and Base URL

You need to change the server url in setupProxy.js file.

You need to add the kubevirt-manager url in constants.js file to run the console.

## Cluster Node VM metrices

You need to install Prometheus and Metrics Server
If you want to access Prometheus from your local machine while it's running in a Kubernetes cluster, you might also use kubectl port-forward
# kubectl port-forward svc/prometheus 9090:9090 -n monitoring
