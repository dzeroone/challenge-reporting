const jsonist = require('jsonist')
const knex = require('./db')
const { NotFoundException, RequestException } = require('./lib/exceptions')
const gradesUrl = 'https://outlier-coding-test-data.onrender.com/grades.json'

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

async function getHealth (req, res, next) {
  try {
    await knex('students').first()
    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudent (req, res, next) {
  const studentId = req.params.id;
  try {
    const student = await knex('students').where('id', studentId).first();
    if(!student) {
      throw new NotFoundException(`student ${studentId} not found`);
    }
    // console.log('sss', student)
    return res.json(student)
  }catch(e) {
    next(e)
  }
}

async function getStudentGradesReport (req, res, next) {
  try {
    const studentId = req.params.id;

    const student = await knex('students').where('id', studentId).first();
    if(!student) {
      throw new NotFoundException(`student ${studentId} not found`);
    }
    const { data, response } = await jsonist.get(gradesUrl)
    if(response.statusCode !== 200) {
      throw new RequestException(response.statusCode, res.statusMessage)
    }

    res.json({
      ...student,
      grades: data.filter(grade => grade.id == studentId)
    })
  }catch(e){
    next(e)
  }
}

async function getCourseGradesReport (req, res, next) {
  try {
    const { data, response } = await jsonist.get(gradesUrl)
    if(response.statusCode !== 200) {
      throw new RequestException(response.statusCode, res.statusMessage)
    }
    const stat = {
      highest: Number.MIN_VALUE,
      lowest: Number.MAX_VALUE,
      avarage: 0
    };
    if(!data.length) {
      stat.highest = 0;
      stat.lowest = 0;
      return res.json(stat)
    }
    
    let totalGrade = 0

    data.forEach(score => {
      stat.highest = Math.max(stat.highest, score.grade)
      stat.lowest = Math.min(stat.lowest, score.grade)
      totalGrade += stat.grade;
    })
    stat.avarage = (totalGrade/data.length).toFixed(2)

    res.json(stat);
  }catch(e){
    next(e)
  }
}
