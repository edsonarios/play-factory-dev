const express = require('express')
const app = express.Router()
const path = require('path')
const fs = require('node:fs')
const { exec } = require('child_process')
const pc = require('picocolors')

app.get('/', (req, res) => {
  res.send('Convert video')
})

app.post('/', async (req, res) => {
  const { videoName, filePath, cutStart, cutEnd, volume, format } = req.body
  console.log(req.body)
  const destinationFolder = path.join(__dirname, 'converted')
  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder)
  }
  let commandToExecute = `ffmpeg -ss ${cutStart} `

  if (cutEnd !== '00:00:00') {
    commandToExecute += `-to ${cutEnd} `
  }

  commandToExecute += `-i "${filePath}\\${videoName}" `

  if (volume) {
    commandToExecute += `-filter:a "volume=${volume}" `
  }

  if (format) {
    const baseName = path.basename(videoName, path.extname(videoName))
    const outputFileName = `${baseName}-converted.${format}`
    commandToExecute += `"${filePath}\\${outputFileName}" `
  } else {
    if (!volume) {
      commandToExecute += '-c copy '
    }
    const baseName = path.basename(videoName, path.extname(videoName))
    const extName = path.extname(videoName)
    commandToExecute += `"${filePath}\\${baseName}-converted${extName}" `
  }

  commandToExecute += '-y'
  console.log(commandToExecute)
  // exec(commandToExecute, (error, stdout, stderr) => {
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
