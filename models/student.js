const knex = require("../db");
const { getGrades } = require("./grade");

const studentCache = {};
const studentGrageCache = {};

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
  if(studentGrageCache[id]) return studentGrageCache[id];
  const data = await getGrades()
  studentGrageCache[id] = data.filter(grade => grade.id == id)
  return studentGrageCache[id];
}