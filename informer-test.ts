import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

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

console.log("Getting ready to start creating and updating pods...");

// Schedule pod creation every minute
setInterval(async () => {
    for (let i = 0; i < 2; i++) {
        createAndLabelPod();
    }
}, 30000);

// Create a pod and schedule adding a label
function createAndLabelPod() {
    const podName = `test-pod-${Math.random().toString(36).substring(7)}`;
    const pod = {
        metadata: {
            name: podName,
            namespace: 'default'
        },
        spec: {
            containers: [{
                name: podName,
                image: 'nginx',
                command: ['sh', '-c', 'sleep 3600']
            }]
        }
    };
    const namespace = 'default';
    k8sApi.createNamespacedPod(namespace, pod).then(createdPod => {
        console.log(`\x1b[32mTest script created pod: ${createdPod.body.metadata!.name}\x1b[0m`);
        const addLabelAfter = Math.floor(Math.random() * (25000 - 10000 + 1) + 10000); // Random time between 10 and 25 seconds
        setTimeout(async () => {
            try {
                const podsRes = await k8sApi.listNamespacedPod(namespace);
                const patch = [
                    {
                        op: 'replace',
                        path: '/metadata/labels',
                        value: {
                            peprinformer: 'deletedeletedelete',
                        },
                    },
                ];
                const options = { headers: { 'Content-type': k8s.PatchUtils.PATCH_FORMAT_JSON_PATCH } };
                const podPatchRes = await k8sApi.patchNamespacedPod(
                    podsRes.body.items[0].metadata.name,
                    namespace,
                    patch,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    options,
                );
                console.log(`${podName} pod patched: `, podPatchRes.body.metadata?.labels);
            }catch(err) {
                console.error(`Informer script failed to create pod ${podName}: ${err}`);
            };
        });
    });
}
