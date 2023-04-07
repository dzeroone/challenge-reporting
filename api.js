const knex = require('./db')
const { NotFoundException } = require('./lib/exceptions')

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
  throw new Error('This method has not been implemented yet.')
}

async function getCourseGradesReport (req, res, next) {
  throw new Error('This method has not been implemented yet.')
}
