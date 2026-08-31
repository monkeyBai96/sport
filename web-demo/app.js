const RECORDS_KEY = 'training_records'
const USER_KEY = 'user'

function $(selector) {
  return document.querySelector(selector)
}

function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getRecords() {
  const raw = localStorage.getItem(RECORDS_KEY)
  return raw ? JSON.parse(raw) : {}
}

function saveRecords(records) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
}

function getDayRecords(date) {
  return getRecords()[date] || null
}

function setDayRecord(date, partKey, values) {
  const records = getRecords()
  if (!records[date]) records[date] = {}
  records[date][partKey] = values
  saveRecords(records)
}

function hasValues(values) {
  if (!values || typeof values !== 'object') return false
  return Object.keys(values).some(k => {
    const v = values[k]
    if (typeof v === 'number') return v > 0
    if (typeof v === 'boolean') return v
    return false
  })
}

function getUser() {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function clearUser() {
  localStorage.removeItem(USER_KEY)
}

function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + c
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

function initUser() {
  let user = getUser()
  if (!user || !user.openid) {
    const seed = Date.now() + Math.random().toString()
    user = {
      openid: 'wx_' + hashCode(seed),
      id: '',
      avatarUrl: ''
    }
    saveUser(user)
  }
  return user
}

let state = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
}

function renderTraining() {
  const html = `
    <div class="container">
      <div class="card">
        ${PARTS.map(p => `
          <div class="part-row" data-key="${p.key}" onclick="goRecord('${p.key}')">
            <span>${p.label}</span>
            <span class="arrow">›</span>
          </div>
        `).join('')}
      </div>
    </div>
  `
  $('#main').innerHTML = html
  setActiveTab('training')
}

function goRecord(partKey, date) {
  date = date || formatDate(new Date())
  const part = getPart(partKey)
  const saved = (getDayRecords(date) || {})[partKey] || {}
  const values = {}

  if (partKey === 'rehab') {
    part.groups.forEach(g => g.items.forEach(i => values[i.key] = saved[i.key] === true))
  } else {
    part.items.forEach(i => values[i.key] = typeof saved[i.key] === 'number' ? saved[i.key] : 0)
  }

  let formHtml
  if (partKey === 'rehab') {
    formHtml = part.groups.map(g => `
      <div class="rehab-group">
        <div class="group-title">${g.group}</div>
        ${g.items.map(i => `
          <label class="switch-row">
            <span>${i.label}</span>
            <input type="checkbox" data-key="${i.key}" ${values[i.key] ? 'checked' : ''}>
          </label>
        `).join('')}
      </div>
    `).join('')
  } else {
    formHtml = part.items.map(i => `
      <div class="list-item">
        <span class="label">${i.label} ${part.mark}</span>
        <input type="number" min="0" data-key="${i.key}" value="${values[i.key]}">
      </div>
    `).join('')
  }

  const html = `
    <div class="container">
      <div class="card">
        ${formHtml}
      </div>
      <button class="btn-primary" onclick="saveRecord('${partKey}', '${date}')">保存</button>
      <button class="btn-secondary" onclick="goBack()">返回</button>
    </div>
  `
  $('#main').innerHTML = html
}

function saveRecord(partKey, date) {
  const part = getPart(partKey)
  const values = {}

  if (partKey === 'rehab') {
    part.groups.forEach(g => g.items.forEach(i => {
      const el = $(`input[data-key="${i.key}"]`)
      values[i.key] = el ? el.checked : false
    }))
  } else {
    part.items.forEach(i => {
      const el = $(`input[data-key="${i.key}"]`)
      let v = parseInt(el ? el.value : '0', 10)
      if (isNaN(v) || v < 0) v = 0
      values[i.key] = v
    })
  }

  setDayRecord(date, partKey, values)
  alert('已保存')
  goBack()
}

let backStack = []

function goBack() {
  if (backStack.length > 0) {
    const fn = backStack.pop()
    fn()
  } else {
    renderTraining()
  }
}

function renderCalendar() {
  const firstDay = new Date(state.year, state.month - 1, 1).getDay()
  const lastDate = new Date(state.year, state.month, 0).getDate()
  const days = []

  for (let i = 0; i < firstDay; i++) days.push({ empty: true })
  for (let d = 1; d <= lastDate; d++) {
    const date = `${state.year}-${String(state.month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dayRecords = getDayRecords(date) || {}
    const marks = PARTS
      .filter(p => hasValues(dayRecords[p.key]))
      .map(p => `<span class="mark ${p.bold ? 'bold' : ''}">${p.mark}</span>`)
      .join('')
    days.push({ day: d, date, marks })
  }

  const html = `
    <div class="container">
      <div class="card calendar-header">
        <span class="nav-btn" onclick="prevMonth()">‹</span>
        <span class="month-title">${state.year}年${state.month}月</span>
        <span class="nav-btn" onclick="nextMonth()">›</span>
      </div>
      <div class="card weekdays">
        ${['日','一','二','三','四','五','六'].map(w => `<span>${w}</span>`).join('')}
      </div>
      <div class="card days-grid">
        ${days.map(d => d.empty
          ? `<div class="day-cell empty"></div>`
          : `<div class="day-cell" onclick="goDay('${d.date}')">
               <span class="day-num">${d.day}</span>
               <div class="marks">${d.marks}</div>
             </div>`
        ).join('')}
      </div>
    </div>
  `
  $('#main').innerHTML = html
  setActiveTab('calendar')
}

function prevMonth() {
  state.month--
  if (state.month < 1) {
    state.month = 12
    state.year--
  }
  renderCalendar()
}

function nextMonth() {
  state.month++
  if (state.month > 12) {
    state.month = 1
    state.year++
  }
  renderCalendar()
}

function goDay(date) {
  const records = getDayRecords(date) || {}
  const parts = []

  PARTS.forEach(p => {
    if (!hasValues(records[p.key])) return
    const saved = records[p.key]
    if (p.key === 'rehab') {
      const groups = p.groups.map(g => ({
        group: g.group,
        items: g.items.map(i => ({ ...i, done: saved[i.key] === true }))
      }))
      parts.push({ key: p.key, label: p.label, isRehab: true, groups })
    } else {
      const items = p.items.map(i => ({ ...i, value: typeof saved[i.key] === 'number' ? saved[i.key] : 0 }))
      parts.push({ key: p.key, label: p.label, isRehab: false, items })
    }
  })

  const html = `
    <div class="container">
      <div class="card">
        <div style="font-weight:bold;margin-bottom:12px;">${date}</div>
        ${parts.length === 0 ? '<div class="empty-tip">当日暂无训练记录</div>' : ''}
        ${parts.map(p => `
          <div class="card part-card" onclick="editDayPart('${p.key}', '${date}')" style="cursor:pointer;">
            <div class="part-title">${p.label}</div>
            ${p.isRehab
              ? p.groups.map(g => `
                  <div class="rehab-group">
                    <div class="group-title">${g.group}</div>
                    ${g.items.map(i => `
                      <div class="detail-row">
                        <span>${i.label}</span>
                        <span class="detail-value">${i.done ? '✓' : '—'}</span>
                      </div>
                    `).join('')}
                  </div>
                `).join('')
              : p.items.map(i => `
                  <div class="detail-row">
                    <span>${i.label}</span>
                    <span class="detail-value">${i.value}</span>
                  </div>
                `).join('')
            }
          </div>
        `).join('')}
      </div>
      <button class="btn-secondary" onclick="renderCalendar()">返回日历</button>
    </div>
  `
  $('#main').innerHTML = html
}

function editDayPart(partKey, date) {
  backStack.push(() => goDay(date))
  goRecord(partKey, date)
}

function renderProfile() {
  const user = getUser()
  const html = `
    <div class="container">
      <div class="card profile-card">
        <label class="avatar-btn">
          ${user.avatarUrl
            ? `<img src="${user.avatarUrl}" alt="avatar">`
            : `<span class="avatar-placeholder">点击设置头像</span>`
          }
          <input type="file" accept="image/*" style="display:none" onchange="updateAvatar(this)">
        </label>
        <div class="info-row">
          <span>微信 ID</span>
          <span style="font-weight:bold;">${user.openid || '—'}</span>
        </div>
        <div class="info-row">
          <span>设置 ID</span>
          <input type="text" class="info-input" value="${user.id || ''}"
            placeholder="请输入ID" onchange="updateId(this.value)">
        </div>
      </div>
      <button class="logout-btn" onclick="logout()">退出登录</button>
    </div>
  `
  $('#main').innerHTML = html
  setActiveTab('profile')
}

function updateAvatar(input) {
  const file = input.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = e => {
    const user = getUser()
    user.avatarUrl = e.target.result
    saveUser(user)
    renderProfile()
  }
  reader.readAsDataURL(file)
}

function updateId(value) {
  const user = getUser()
  user.id = value.trim()
  saveUser(user)
}

function logout() {
  if (!confirm('退出后将清除本地登录信息，确定吗？')) return
  clearUser()
  initUser()
  renderProfile()
}

function setActiveTab(name) {
  document.querySelectorAll('.tab-bar button').forEach(btn => btn.classList.remove('active'))
  $(`#tab-${name}`).classList.add('active')
}

function init() {
  initUser()
  renderTraining()
}

window.onload = init
