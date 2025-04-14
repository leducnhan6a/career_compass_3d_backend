'use strict';
import mongoose from 'mongoose';
import os from 'os';
import process from 'process';

const _SECOND = 5000;

const countConnectdb = () => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of connections ${numConnections}`);
};

// chek overload (moniter overload server)
const checkOverload = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // example maximum number of connections based on number of corse
        const maxConnections = numCores * 5;

        console.log(`Active connections: ${numConnections}`);
        console.log(`Memory use: ${memoryUsage / 1024 / 1024} MB`);

        if (numConnections > maxConnections) {
            console.log(`Connection overload detected`);
            // notify.send(...)
        }

    }, _SECOND); //monitor every 5 seconds
};

export { countConnectdb, checkOverload };
