import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const listFn = () => k8sApi.listNamespacedPod('default');

const informer = k8s.makeInformer(kc, '/api/v1/namespaces/default/pods', listFn);

console.log("Informer started with update details...");

// Map to store the previous states of the pods
const previousPodStates = new Map<string, k8s.V1Pod>();

informer.on('add', (obj: k8s.V1Pod) => {
    console.log(`Added: ${obj.metadata!.name}`);
    previousPodStates.set(obj.metadata!.name!, obj);
});

informer.on('update', (obj: k8s.V1Pod) => {
    const previousObj = previousPodStates.get(obj.metadata!.name!);
    if (previousObj) {
        console.log(`Updated: ${obj.metadata!.name}`);
        logDifferences(previousObj, obj);
    }
    previousPodStates.set(obj.metadata!.name!, obj);
});

informer.on('delete', (obj: k8s.V1Pod) => {
    console.log(`Deleted: ${obj.metadata!.name}`);
    previousPodStates.delete(obj.metadata!.name!);
});

informer.on('error', (err) => {
    console.error(err);
    // Restart informer after 5sec
    setTimeout(() => {
        informer.start();
    }, 5000);
});

informer.start();

// Function to log differences between old and new pod states
function logDifferences(oldPod: k8s.V1Pod, newPod: k8s.V1Pod) {
    const changes: string[] = [];
    // Checking for changes in some fields
    if (oldPod.status?.phase !== newPod.status?.phase) {
        changes.push(`Phase changed from ${oldPod.status?.phase} to ${newPod.status?.phase}`);
    }
    // Add other fields to compare based on needs
    if (changes.length > 0) {
        console.log(`Changes for ${newPod.metadata!.name}: ${changes.join(', ')}`);
    } else {
        console.log(`Updated ${newPod.metadata!.name} with no significant changes detected.`);
    }
}
