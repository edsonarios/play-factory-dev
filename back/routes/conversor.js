const express = require('express')
const app = express.Router()
const path = require('path')
const fs = require('node:fs')
const { exec } = require('child_process')
const pc = require('picocolors')

app.get('/', (req, res) => {
  res.send('Download some part of video .ts')
})

app.post('/', async (req, res) => {
  const body = req.body
  console.log(body)
  const destinationFolder = path.join(__dirname, 'converted')
  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder)
  }

  // exec(`python D:/Code/tool-download/scripts-to-download/list_parts.py "${nameVideo}"`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error when execute script: ${error}`)
  //     return
  //   }
  //   console.error(`stderr: ${stderr}`)
  //   console.log(pc.green(`stdout: ${stdout}`))
  //   console.log('Finished')
  // })
  res.send('Converted')
})

module.exports = app
