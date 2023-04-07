const { workerData, parentPort } = require('node:worker_threads')
const { RequestException } = require('../lib/exceptions');

const run = async () => {
  const {url, method, body} = workerData;
  try {
    const res = await fetch(url, {
      method: 'GET'
    })
    if(res.status != 200) {
      throw new RequestException(res.status, res.statusText)
    }
    const data = await res.json()
    parentPort.postMessage(data)
  }catch(e) {
    throw e;
  }
}
run();