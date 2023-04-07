const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.ok(data.success, 'should have successful healthcheck')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('get_student_by_id', async (t) => {
  const url = `${endpoint}/student/1`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error(response.statusMessage)
    }
    t.ok(data.id == 1, 'should return data for student id 1')
  } catch(e) {
    t.error(e)
  } finally {
    t.end()
  }
})

tape('get grades for student 1', async (t) => {
  const url = `${endpoint}/student/1/grades`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error(response.statusMessage)
    }
    t.ok(Array.isArray(data.grades), 'should return an array of student grades')
  } catch(e) {
    t.error(e)
  } finally {
    t.end()
  }
})

tape('get course grade report', async (t) => {
  const url = `${endpoint}/course/all/grades`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error(response.statusMessage)
    }
    t.ok(data.hasOwnProperty('highest'), 'should return an object with grade statistics')
  } catch(e) {
    t.error(e)
  } finally {
    t.end()
  }
})

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})
