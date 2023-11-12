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
  const { videoName, filePath, cutStart, cutEnd, volume, format } = req.body
  console.log(req.body)
  const destinationFolder = path.join(__dirname, 'converted')
  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder)
  }
  const commandToExecute = `ffmpeg -ss ${cutStart} -t ${cutEnd} -i "${filePath}\\${videoName}" -c copy "${filePath}\\convertido.mp4" -y`
  console.log(commandToExecute)
  exec(commandToExecute, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error when execute script: ${error}`)
      return
    }
    console.error(`stderr: ${stderr}`)
    console.log(pc.green(`stdout: ${stdout}`))
    console.log('Finished')
  })
  res.send('Converted')
})

module.exports = app
