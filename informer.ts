import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const listFn = () => k8sApi.listNamespacedPod('default');
const informer = k8s.makeInformer(kc, '/api/v1/namespaces/default/pods', listFn);

console.log("Informer started with pod deletion...");

// Store the previous states of the pods
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
    setTimeout(() => informer.start(), 5000);
});

informer.start();

// Function to log differences between old and new pod states
function logDifferences(oldPod: k8s.V1Pod, newPod: k8s.V1Pod) {
    const changes: string[] = [];
    if (oldPod.status?.phase !== newPod.status?.phase) {
        changes.push(`Phase changed from ${oldPod.status?.phase} to ${newPod.status?.phase}`);
    }
    if (changes.length > 0) {
        console.log(`Changes for ${newPod.metadata!.name}: ${changes.join(', ')}`);
    } else {
        console.log(`Updated ${newPod.metadata!.name} with no significant changes detected.`);
    }
}

console.log("Getting ready to start creating and deleting pods...");

// Schedule pod creation every minute
setInterval(async () => {
    for (let i = 0; i < 10; i++) {
        createAndScheduleDeletionOfPod();
    }
}, 60000);

// Create a pod and schedule its deletion
function createAndScheduleDeletionOfPod() {
    const podName = `test-pod-${Math.random().toString(36).substring(7)}`;
    const pod = {
        metadata: {
            name: podName,
            namespace: 'default'
        },
        spec: {
            containers: [{
                name: 'test',
                image: 'nginx',
                command: ['sh', '-c', 'sleep 3600']
            }]
        }
    };

    k8sApi.createNamespacedPod('default', pod).then(createdPod => {
        console.log(`\x1b[32mInformer script created pod: ${createdPod.body.metadata!.name}\x1b[0m`);
        const deleteAfter = Math.floor(Math.random() * (25000 - 10000 + 1) + 10000); // Random time between 10 and 25 seconds
        setTimeout(() => {
            k8sApi.deleteNamespacedPod(podName, 'default').then(() => {
                console.log(`\x1b[31mInformer script deleted pod: ${podName}\x1b[0m`);
            }).catch(err => {
                console.error(`Informer script failed to delete pod ${podName}: ${err}`);
            });
        }, deleteAfter);
    }).catch(err => {
        console.error(`Informer script failed to create pod ${podName}: ${err}`);
    });
}
