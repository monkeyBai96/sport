// 把 ./web-demo 复制到 ./dist，供 Capacitor 打包
const fs = require('fs')
const path = require('path')

const src = path.resolve(__dirname, 'web-demo')
const dest = path.resolve(__dirname, 'dist')

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
  const entries = fs.readdirSync(srcDir, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name)
    const destPath = path.join(destDir, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true })
copyDir(src, dest)
console.log('已复制 web-demo 到 dist')
