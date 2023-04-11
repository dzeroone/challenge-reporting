const { sendHttpRequest } = require("../lib/utils");

module.exports = {
  getCourseGradeStat,
  getGrades
}

let gradeCache = null;
let statCache = null;

async function getCourseGradeStat () {
  
  if(statCache) return statCache;

  const data = await getGrades()
  // const st = Date.now();

  const stat = {
    highest: Number.MIN_VALUE,
    lowest: Number.MAX_VALUE,
    avarage: 0
  }
  if(!data.length) {
    stat.highest = 0;
    stat.lowest = 0;
    return stat;
  }

  let sum = 0;
  data.forEach((score) => {
    sum += score.grade
    stat.highest = Math.max(stat.highest, score.grade)
    stat.lowest = Math.min(stat.lowest, score.grade)
  })
  stat.avarage = +(sum/data.length).toFixed(2)
  
  statCache = stat;

  // console.log('stat calculation complete time %f ms', Date.now() - st)
  
  return statCache;
}

async function getGrades () {
  if (gradeCache) return gradeCache;
  // const st = Date.now();
  gradeCache = await sendHttpRequest({
    url: 'https://outlier-coding-test-data.onrender.com/grades.json'
  })
  // console.log('remote http complete time %f ms', Date.now() - st)
  return gradeCache;
}