# informer

Set up the test:

```bash
k3d cluster delete --all
k3d cluster create
docker build --no-cache -t kaschaefer/informer:v1alpha5 .
docker push kaschaefer/informer:v1alpha5
k3d image import kaschaefer/informer:v1alpha5 -c k3s-default
```

```bash
k apply -f manifests.yaml
sleep 10;
k logs -n informer -l app=informer -f
```

```bash
npm run test
```

If needed, force a new rollout:

```bash
kubectl rollout restart deployment/informer-deployment -n informer
```

If images need to be removed from cluster:

```bash
docker exec k3d-k3s-default-server-0 sh -c "for image in \$(ctr image list -q | grep 'docker.io/kaschaefer/informer'); do ctr image rm \$image; done"
```

-----
-----

Set up the test:

```bash
k3d cluster delete --all
k3d cluster create
npm run build
```

To save both stderr and output to file and show on screen:

```bash
# start informer
npm run start 2>$1 | tee logFile.txt

# start informer-test in another console
npm run test

```

To get logs from api server:

```bash
docker ps | grep k3d #to find container name
docker logs k3d-k3s-default-server-0 2>$1 | tee apiFile.txt
```

-----
-----

```bash
k3d cluster delete --all
k3d cluster create
docker build --no-cache -t kaschaefer/informer:v1alpha4 .
k3d image import kaschaefer/informer:v1alpha4 -c k3s-default
```

```bash
k apply -f pod-patcher-setup.yaml
sleep 10;
k apply -f informer-deployment.yaml
sleep 10;
k logs -n informer -l app=informer -f
```

```bash
k apply -f manifests.yaml
sleep 10;
k logs -n informer -l app=informer -f
```

```bash
k run i --image=nginx
```

If needed, force a new rollout:

```bash
kubectl rollout restart deployment/informer-deployment
```

If images need to be removed from cluster:

```bash
docker exec k3d-k3s-default-server-0 sh -c "for image in \$(ctr image list -q | grep 'docker.io/kaschaefer/informer'); do ctr image rm \$image; done"
```

-----
-----

Create 10 `CronJob`(s) that produces 10 pods with sidecars every 60 seconds

```yaml
kubectl apply -f -<<EOF
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen0
  namespace: default
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            "zarf.dev/agent": "ignore"
            bug: "reproduce"
            api: "call"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen1
  namespace: default
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            bug: "reproduce"
            api: "call"
            "zarf.dev/agent": "ignore"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen2
  namespace: default
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            "zarf.dev/agent": "ignore"
            bug: "reproduce"
            api: "call"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen3
  namespace: default
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            "zarf.dev/agent": "ignore"
            bug: "reproduce"
            api: "call"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen4
  namespace: default
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            "zarf.dev/agent": "ignore"
            bug: "reproduce"
            api: "call"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen5
  namespace: default
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            bug: "reproduce"
            api: "call"
            "zarf.dev/agent": "ignore"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen6
  namespace: default
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            bug: "reproduce"
            api: "call"
            "zarf.dev/agent": "ignore"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen7
  namespace: default
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            bug: "reproduce"
            api: "call"
            "zarf.dev/agent": "ignore"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen8
  namespace: default
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            bug: "reproduce"
            api: "call"
            "zarf.dev/agent": "ignore"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen9
  namespace: default
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            bug: "reproduce"
            api: "call"
            "zarf.dev/agent": "ignore"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
EOF
```