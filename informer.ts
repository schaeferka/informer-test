import * as k8s from '@kubernetes/client-node';

// Set up express for liveness and readiness probes
const express = require('express');
const app = express();
const port = 8443;  // Ensure this matches the exposed port in your Dockerfile and Kubernetes config

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/ready', (req, res) => {
    // Implement any readiness checks you need here. For simplicity, we're just sending OK.
    res.status(200).send('OK');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Set up informer
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const listFn = () => k8sApi.listNamespacedPod('default');
const informer = k8s.makeInformer(kc, '/api/v1/namespaces/default/pods', listFn);

console.log("Informer started and ready to test...");

// Store the previous states of the pods
const previousPodStates = new Map<string, k8s.V1Pod>();

informer.on('add', (obj: k8s.V1Pod) => {
    console.log(`Added: ${obj.metadata!.name}`);
    previousPodStates.set(obj.metadata!.name!, obj);
});

informer.on('update', (obj: k8s.V1Pod) => {
    const previousObj = previousPodStates.get(obj.metadata!.name!);
    if (previousObj) {
        //console.log(`Checking updated labels: ${obj.metadata!.name}`);
        logDifferences(previousObj, obj);

        // Check if the label was added or changed to 'deletedeletedelete'
        const labelValue = obj.metadata.labels ? obj.metadata.labels["peprinformer"] : null;
        if (labelValue === "deletedeletedelete") {
            k8sApi.deleteNamespacedPod(obj.metadata.name!, 'default').then(() => {
                console.log(`\x1b[31mInformer detected label change to deletedeletedelete and deleted pod: ${obj.metadata!.name}\x1b[0m`);
            }).catch(err => {
                console.error(`Failed to delete pod ${obj.metadata!.name}: ${err}`);
            });
        }
    }
    previousPodStates.set(obj.metadata!.name!, obj);
});

informer.on('delete', (obj: k8s.V1Pod) => {
    console.log(`Deleted pod: ${obj.metadata!.name}`);
    previousPodStates.delete(obj.metadata!.name!);
});

informer.on('error', (err) => {
    console.error(err);
    setTimeout(() => informer.start(), 1000);
});

informer.start();

// Function to log differences between old and new pod states
function logDifferences(oldPod: k8s.V1Pod, newPod: k8s.V1Pod) {
    const changes: string[] = [];
    if (oldPod.status?.phase !== newPod.status?.phase) {
        changes.push(`Phase changed from ${oldPod.status?.phase} to ${newPod.status?.phase}`);
    }
    if (oldPod.metadata?.labels !== newPod.metadata?.labels) {
        changes.push(`Labels changed from ${oldPod.metadata?.labels} to ${newPod.metadata?.labels}`);
    }
    //if (changes.length > 0) {
    //    console.log(`Changes for ${newPod.metadata!.name}: ${changes.join(', ')}`);
    //} else {
        //console.log(`Updated ${newPod.metadata!.name} with no significant changes detected.`);
    //}
}
