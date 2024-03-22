import config from './config'
import fs from 'node:fs'
import { app, net, protocol, shell } from 'electron'
import { escapePath } from '@ra2inier/core/node'

// 开启文件传输协议
protocol.registerSchemesAsPrivileged([{
   scheme: config.FILE_PROTOCOL,
   privileges: {
      bypassCSP: true,
      standard: true,
      secure: true,
      supportFetchAPI: true
   }
}])


const diskCode = /^[cdefgh]{1}\//

// 处理文件传输协议的内容
app.whenReady().then(() => import('node:url')).then(nodeUrl => {
   const pathToFileURL = nodeUrl.pathToFileURL
   // 处理lfp文件获取协议
   protocol.handle(config.FILE_PROTOCOL, (req) => {
      // 处理文件请求，将url改为文件地址
      let url = req.url.slice(config.FILE_PROTOCOL.length + 3)
      if (url.match(diskCode)) url = escapePath(url.replace(diskCode, url[0].toUpperCase() + ':/'))
      else url = escapePath(config.CWD, url)
      // 拒绝访问在本程序根目录文件夹之外的文件
      if (!url.startsWith(config.CWD)) {
         return new Response('access denied', { status: 403 })
      }
      // 返回文件，如果不存在文件则返回404
      if (fs.existsSync(url)) return net.fetch(pathToFileURL(url).toString())
      else return new Response('', { status: 404 })
   })
})
