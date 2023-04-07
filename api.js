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
  throw new Error('This method has not been implemented yet.')
}
