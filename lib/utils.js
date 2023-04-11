const { Worker } = require('node:worker_threads');
const path = require('path')

module.exports = {
  sendHttpRequest,
}

async function sendHttpRequest ({ url }) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve('./workers/http-worker.js'), { workerData: { url } });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    })
  })
}