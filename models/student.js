const knex = require("../db");
const { getGrades } = require("./grade");

const studentCache = {};
const studentGradeCache = {};

module.exports = {
  getStudentById,
  getStudentGradesById
}

async function getStudentById(id) {
  if(studentCache[id]) return studentCache[id];
  studentCache[id] = await knex('students').where('id', id).limit(1).first()
  return studentCache[id];
}

async function getStudentGradesById(id) {
  if(studentGradeCache[id]) return studentGradeCache[id];
  const data = await getGrades()
  studentGradeCache[id] = data.filter(grade => grade.id == id)
  return studentGradeCache[id];
}