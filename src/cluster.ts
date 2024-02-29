// import os from 'node:os';
import cluster from 'cluster';

const runPrimaryProcess = () => {

    import('./start');
    import('./cron');

    const processesCount = 4;

    console.log(`Primary ${process.pid} is running`);
    console.log(`Forkinng Server with ${processesCount} process`);

    for (let index = 0; index < processesCount; index++) cluster.fork();

    cluster.on('exit', (worker, code) => {
        if (code != 0 && !worker.exitedAfterDisconnect) {
            console.log(`Worker ${worker.process.pid} died... scheduling another one!`);
            cluster.fork();
        }
    });
};

// Processos que executam os códigos
const runWorkerProcess = async () => {
    await import('./server');
};

cluster.isPrimary ? runPrimaryProcess() : runWorkerProcess();
