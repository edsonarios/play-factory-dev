'use strict'
const { spawn } = require('child_process')
const shellQuote = require('shell-quote')
let isKilling = false
let countKilling = 0
function runFFmpegCommand(commandToExecute) {
  const parsed = shellQuote.parse(commandToExecute)
  const command = parsed[0]
  const args = parsed.slice(1)

  const ffmpegProcess = spawn(command, args)

  ffmpegProcess.stdout.on('data', (data) => {
    process.send({ type: 'stdout', data: data.toString() })
  })

  ffmpegProcess.stderr.on('data', (data) => {
    process.send({ type: 'stderr', data: data.toString() })
  })

  ffmpegProcess.on('close', (code) => {
    if (isKilling) {
      isKilling = false
      countKilling++
      return
    }
    if (countKilling === 2) {
      countKilling = 0
      return
    }

    process.send({ type: 'close', code })
  })

  process.on('message', (message) => {
    console.log('4. ', message)
    if (message === 'kill') {
      console.log('5. ', 'killing ffmpeg')
      ffmpegProcess.kill('SIGTERM')
      isKilling = true
      countKilling++
    }
  })
}

process.on('message', (command) => {
  runFFmpegCommand(command)
})
