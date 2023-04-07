const { Worker } = require('node:worker_threads');
const path = require('path')

const asyncFilter = async (data, filterFn) => {
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

const asyncGradeStat = async (data) => {
  return new Promise((resolve, reject) => {
    if(!Array.isArray(data)){ return reject('param types are not matching') }
    const stat = {
      highest: Number.MIN_VALUE,
      lowest: Number.MAX_VALUE,
      avarage: 0
    }
    if(!data.length) {
      stat.highest = 0;
      stat.lowest = 0;
      return resolve(stat);
    }

    const sum = 0;
    const lastIndex = data.length -1;
    const calc = (index) => {
      sum += data[index]
      stat.highest = Math.max(stat.highest, data[index])
      stat.lowest = Math.min(stat.lowest, data[index])
      if(index == lastIndex) {
        stat.avarage = (sum/data.length).toFixed(2)
        resolve(stat);
      }
      else setImmediate(filter.add(null, index + 1))
    }
    calc(0)
  })
}

const sendHttpRequest = (data) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve('./workers/http-worker.js'), { workerData: data });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    })
  })
}

module.exports = {
  asyncFilter,
  asyncGradeStat,
  sendHttpRequest
}