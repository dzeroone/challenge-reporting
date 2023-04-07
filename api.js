const jsonist = require('jsonist')
const knex = require('./db')
const { NotFoundException } = require('./lib/exceptions')
const { asyncFilter } = require('./lib/utils')
const { getGrades, getCourseGradeStat } = require('./models/grade')

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

    const data = await getGrades();

    res.json({
      ...student,
      grades: await asyncFilter(data, grade => grade.id == studentId)
    })
  }catch(e){
    next(e)
  }
}

async function getCourseGradesReport (req, res, next) {
  try {
    const stat = await getCourseGradeStat();
    res.json(stat);
  }catch(e){
    next(e)
  }
}
