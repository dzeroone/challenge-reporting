const { Worker } = require('node:worker_threads');
const path = require('path')

module.exports = {
  asyncFilter,
  sendHttpRequest,
}

async function asyncFilter (data, filterFn) {
  return new Promise((resolve, reject) => {
    if(!Array.isArray(data) || typeof filterFn != 'function'){ return reject('param types are not matching') }
    const filtered = [];
    const lastIndex = data.length -1;
    const filter = (index) => {
      if(filterFn(data[index])) filtered.push(data[index])
      if(index == lastIndex) return resolve(filtered)
      else setImmediate(filter.bind(null, index + 1))
    }
    filter(0)
  })
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