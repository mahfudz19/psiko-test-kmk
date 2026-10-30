/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */

import { ParsedUrlQuery } from 'querystring'
import { CSSProperties, JSX } from 'react'
import { DAYS_OF_WEEK } from '@/constant'
import { useAppContext } from '@/hooks/useAppContext'
import { CurriculumData } from '@/type/Curriculum'
import { ISchedule } from '@/type/Schedule'
import { Student } from '@/type/Student'

// ** Checks if the passed date is today
const isToday = (date: Date | string) => {
  const today = new Date()

  return (
    new Date(date).getDate() === today.getDate() &&
    new Date(date).getMonth() === today.getMonth() &&
    new Date(date).getFullYear() === today.getFullYear()
  )
}

export const formatDateToHour = (
  value: string | Date | null | undefined,
  formatting: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  },
  locale = 'id'
) => {
  if (!value) return value

  return new Intl.DateTimeFormat(locale, formatting).format(new Date(value))
}

export const formatDate = (
  value: Date | null | undefined | string,
  formatting: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  },
  locale = 'id'
) => {
  if (!value) return value

  return new Intl.DateTimeFormat(locale, formatting).format(new Date(value))
}

export const formatNumberDate = (
  value: Date | null | undefined | string,
  formatting: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  },
  locale = 'id'
) => {
  if (!value) return value

  return new Intl.DateTimeFormat(locale, formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateMonthName = (value: Date | string, toTimeForCurrentDay = true, locale = 'id-ID') => {
  const date = new Date(value)
  let formatting: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat(locale, formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value: Date | string, toTimeForCurrentDay = true, locale = 'id-ID') => {
  const date = new Date(value)
  let formatting: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric'
  }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat(locale, formatting).format(new Date(value))
}

// Format expiration date in any credit card
export const formatExpirationDate = (value: string) => {
  const finalValue = value
    .replace(/^([1-9]\/|[2-9])$/g, '0$1/') // 3 > 03/
    .replace(/^(0[1-9]|1[0-2])$/g, '$1/') // 11 > 11/
    .replace(/^([0-1])([3-9])$/g, '0$1/$2') // 13 > 01/3
    .replace(/^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2') // 141 > 01/41
    .replace(/^([0]+)\/|[0]+$/g, '0') // 0/ > 0 and 00 > 0
    // To allow only digits and `/`
    .replace(/[^\d\/]|^[\/]*$/g, '')
    .replace(/\/\//g, '/') // Prevent entering more than 1 `/`

  return finalValue
}

// Format CVC in any credit card
// export const formatCVC = (
//   value: string,
//   cardNumber: string,
//   Payment: PaymentTypes
// ) => {
//   const clearValue = clearNumber(value);
//   const issuer = Payment.fns.cardType(cardNumber);
//   const maxLength = issuer === 'amex' ? 4 : 3;

//   return clearValue.slice(0, maxLength);
// };

export const priceFormatter = (price: number) => {
  const numToSting = price.toString().replace(/[^,\d]/g, '')
  const split = numToSting.split(',')
  const left = split[0].length % 3
  let prc = split[0].substr(0, left)
  const thousand = split[0].substr(left).match(/\d{3}/gi)

  if (price < 1e6 && thousand) return 'Rp ' + (prc += left ? '.' : '' + thousand.join('.'))

  return `Rp ${(price / 1e6 / 1).toPrecision(2).toLocaleString()} jt`
}

export const getURLParams = (obj: Record<string, any>): string => {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(obj)) {
    if (value == null) continue // Abaikan nilai null atau undefined

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof Date) {
          params.append(`${key}[${index}]`, String(item).trim())
        } else if (typeof item === 'object' && item !== null) {
          // Jika item adalah objek, tambahkan setiap properti dengan format data[index][key]=value
          Object.entries(item).forEach(([subKey, subValue]) => {
            params.append(`${key}[${index}][${subKey}]`, String(subValue).trim())
          })
        } else {
          params.append(`${key}[${index}]`, String(item).trim())
        }
      })
    } else {
      params.append(key, String(value).trim()) // Jika bukan array, langsung tambahkan
    }
  }

  return params.toString()
}

export function parseQueryToObject<T>(query: ParsedUrlQuery) {
  const parsedObj: Record<string, any> = {}

  for (const [key, value] of Object.entries(query)) {
    const arrayMatch = key.match(/^(\w+)\[(\d+)\]\[(\w+)\]$/) // Deteksi key dengan format array[index][property]

    if (arrayMatch) {
      const [, arrayName, index, property] = arrayMatch
      if (!parsedObj[arrayName]) parsedObj[arrayName] = [] // Buat array jika belum ada
      if (!parsedObj[arrayName][Number(index)]) parsedObj[arrayName][Number(index)] = {} // Buat objek dalam array
      parsedObj[arrayName][Number(index)][property] = value
    } else {
      parsedObj[key] = value // Simpan langsung jika bukan array
    }
  }

  return parsedObj as T
}

export const FormatListArray = (value?: string[] | number[], locale?: string) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return ''
  let language: Intl.LocalesArgument = 'id-ID'

  if (locale === 'en') language = 'en-US'
  if (locale === 'id') language = 'id-ID'
  const stringValue = value.map((v: string | number) => `${v}`)

  return new Intl.ListFormat(language).format(stringValue)
}

export const FormatListArrayElement = (
  value?: (string | number | JSX.Element)[],
  separator = ' , ',
  finalSeparator = ' dan '
) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return ''
  return value.reduce(
    (prev: any, curr, index) => {
      if (index === 0) return [curr]
      if (index === value.length - 1) return [...prev, finalSeparator, curr] // Add "and" before the last element
      return [...prev, separator, curr]
    },
    [] as (string | JSX.Element)[]
  )
}

export const normalPriceFormat = (value: number) => {
  const array = String(value).split('')

  return `Rp. ${array.map((char, index) => (index > 0 && index % 3 === array.length % 3 ? `.${char}` : char)).join('')}`
}

export function TrimLength(text: string, maxLength: number) {
  if (text.length > maxLength) {
    text = text.substring(0, maxLength)

    return text.substring(0, text.lastIndexOf(' ')) + '...'
  } else return text
}

export function countDate(start: Date | string, end: Date | string) {
  const diffInMs = new Date(end).valueOf() - new Date(start).valueOf()
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (days > 7) {
    const date = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7))

    return date + ' ' + 'WEEKS_AGO'
  }
  if (days > 30) {
    const date = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30))

    return date + ' ' + 'MONTH_AGO'
  }
  if (days > 365) {
    const date = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365))

    return date + ' ' + 'YEARS_AGO'
  }

  return days + ' ' + 'DAYS_AGO'
}

export const difDate = (date1: Date | number, date2: Date | string, without = 'month') => {
  const date_1 = new Date(date1).getTime()
  const date_2 = new Date(date2).getTime()
  const diff = (date_2 - date_1) / 1000 // dirubah ke second
  let day = 0
  let hour = 0
  let minute = 0
  let second = 0
  let month = 0
  let year = 0
  second = Math.floor(diff)
  if (without === 'minute') {
    return {
      second
    }
  }
  second %= 60
  minute = Math.floor((diff - second) / 60)
  if (without === 'hour') {
    return {
      second,
      minute
    }
  }
  minute %= 60
  hour = Math.floor((diff - (second + minute * 60)) / (60 * 60))
  if (without === 'day') {
    return {
      second,
      minute,
      hour
    }
  }
  hour %= 60
  day = Math.floor((diff - (second + minute * 60 + hour * 60 * 60)) / (60 * 60 * 24))
  if (without === 'month') {
    return {
      second,
      minute,
      hour,
      day
    }
  }

  // anggap saja semua bulan itu 30 hari
  day %= 30

  month = Math.floor((diff - (second + minute * 60 + hour * 60 * 60 + day * 60 * 60 * 24)) / (60 * 60 * 24 * 30))
  if (without === 'year') {
    return {
      second,
      minute,
      hour,
      day,
      month
    }
  }
  month %= 12
  year = Math.floor(
    (diff - (second + minute * 60 + hour * 60 * 60 + day * 60 * 60 * 24 * 30)) / (60 * 60 * 24 * 30 * 12)
  )

  return {
    second,
    minute,
    hour,
    day,
    month,
    year
  }
}

export function stringToColor(string: string) {
  let hash = 0
  let i

  for (i = 0; i < string?.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }

  return `${color}80`
}

export function stringToColorRGB(str: string, opacity: number = 1): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  // Ambil RGB dari hash
  const r = (hash >> 0) & 0xff
  const g = (hash >> 8) & 0xff
  const b = (hash >> 16) & 0xff
  return `rgba(${r},${g},${b},${opacity})`
}

export function convertToNumber(formattedValue: string) {
  const numericValue = Number(formattedValue.replace(/[.,]/g, ''))

  return numericValue
}

export function formatNumber(number: string | number) {
  if (typeof number === 'number') number = String(number)

  const numericValue = Number(number.replace(/\D/g, ''))

  return !number ? '' : numericValue.toLocaleString('id-ID')
}

export function removeUndefinedProperties<T extends {} | Record<string, unknown>>(obj: T): T {
  return Object.entries(obj || {})
    .filter(([_, value]) => value !== undefined)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as T)
}

export function undefinedEmptyStringProperties(obj: { [key: string]: any }): { [key: string]: any } {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim() === '') {
      obj[key] = undefined
    }
  })

  return obj
}

export function removeEmptyStringProperties<T extends {} | Record<string, unknown>>(obj: T): T {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim() === '') {
      delete obj[key]
    }
  })

  return obj
}

export function getMiddleDateOfPreviousMonth(date?: Date) {
  const today = date || new Date() // get today's date
  const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const firstDayOfPreviousMonth = new Date(
    firstDayOfCurrentMonth.getFullYear(),
    firstDayOfCurrentMonth.getMonth() - 1,
    1
  )
  const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth.getTime() - 1) // set to the day before the first day of current month
  const middleDate = new Date(
    firstDayOfPreviousMonth.getTime() + (lastDayOfPreviousMonth.getTime() - firstDayOfPreviousMonth.getTime()) / 2
  )

  return middleDate.toDateString()
}

export function getMiddleDateOfNextMonth(date?: Date) {
  const today = date || new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  const middleDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 15)

  return middleDate.toDateString()
}

export function displayTime(date: string | Date | null | undefined, includeSecond?: string): string {
  if (!date) return 'Invalid Date'

  let parsedDate: Date
  if (typeof date === 'string') parsedDate = new Date(date)
  else parsedDate = date

  if (isNaN(parsedDate.getTime())) return 'Invalid Date'

  const hours = parsedDate.getHours().toString().padStart(2, '0')
  const minutes = parsedDate.getMinutes().toString().padStart(2, '0')
  const seconds = parsedDate.getSeconds().toString().padStart(2, '0')

  return includeSecond ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`
}

export function convertToPixelSize(value: CSSProperties['width' | 'height'] | string): number {
  // Pisahkan nilai dan satuan ukuran
  const sizeRegex = /^(\d+\.?\d*)(px|%)?$/
  const stringValue = typeof value === 'string' ? value.trim() : value ? value.toString() : ''
  const match = stringValue.match(sizeRegex)

  if (!match) {
    throw new Error('Invalid input format.')
  }

  const numberValue = parseFloat(match[1])
  const unit = match[2]

  switch (unit?.toLowerCase()) {
    case 'px':
      return numberValue
    case 'em':
      return numberValue * 16
    case '%':
      throw new Error('percent(%) cannot be converted to pixels')
    case 'pt':
      return numberValue * 1.333
    case 'pc':
      return numberValue * 16
    default:
      return numberValue
  }
}

export const bobotMutuFunction = (grade?: number) => {
  if (grade === undefined || grade === null) return 'NaN'
  if (grade >= 90 && grade <= 100) return '4.0'
  if (grade >= 80 && grade <= 90) return '3.7'
  if (grade >= 75 && grade <= 80) return '3.3'
  if (grade >= 70 && grade <= 75) return '3.0'
  if (grade >= 66 && grade <= 70) return '2.7'
  if (grade >= 61 && grade <= 66) return '2.3'
  if (grade >= 56 && grade <= 61) return '2.0'
  if (grade >= 46 && grade <= 56) return '1.0'
  return '0.0'
}

export const hurufMutuFunction = (grade?: number) => {
  if (grade === undefined || grade === null) return 'NaN'
  if (grade >= 90 && grade <= 100) return 'A'
  if (grade >= 80 && grade <= 90) return 'A-'
  if (grade >= 75 && grade <= 80) return 'B+'
  if (grade >= 70 && grade <= 75) return 'B'
  if (grade >= 66 && grade <= 70) return 'B-'
  if (grade >= 61 && grade <= 66) return 'C+'
  if (grade >= 56 && grade <= 61) return 'C'
  if (grade >= 46 && grade <= 55) return 'D'
  return 'E'
}

export async function fetchImageAsBuffer(url: string) {
  const response = await fetch(url) // Fetch the image from the URL
  const arrayBuffer = await response.arrayBuffer() // Convert to ArrayBuffer
  return new Uint8Array(arrayBuffer) // Convert to Uint8Array
}

export function convertToRomawi(num: number): string {
  if (num <= 0 || num > 3999) {
    throw new Error('Angka harus berada di antara 1 dan 3999.')
  }

  const romanNumerals: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I']
  ]

  let result = ''

  for (const [arabic, roman] of romanNumerals) {
    while (num >= arabic) {
      result += roman
      num -= arabic
    }
  }

  return result
}

export const getIndexGrade = (bobotMutu: string | number, sks: string | number) => {
  const formatBobot = parseFloat(`${bobotMutu}`)
  const formatSks = parseInt(`${sks}`)

  return Number((formatBobot * formatSks).toFixed(2))
}

export const coutNumArray = (array: number[]) => {
  return array.reduce(function (a, b) {
    return a + b
  }, 0)
}

function filteredPassGrade(grade: { courseId: string; grade?: number; sks: number; gradeId?: string }[]) {
  const uniqueGrades: { [courseId: string]: { courseId: string; grade?: number; sks: number; gradeId?: string } } = {}

  grade.forEach(item => {
    const courseId = item.courseId
    const current = uniqueGrades[courseId]

    if (!current || current.grade === undefined || (item.grade !== undefined && item.grade > (current.grade ?? -1))) {
      uniqueGrades[courseId] = item
    }
  })

  return Object.values(uniqueGrades)
}

export function countStudentGrade(g: { courseId: string; grade?: number; sks: number; gradeId?: string }[]) {
  const grade = filteredPassGrade(g)
  const lostGrade = g.filter(f => !grade.some(s => s.gradeId === f.gradeId))
  const notPassedGrade = grade.filter(f => f.grade !== undefined && f.grade <= 46)
  const passedGrade = grade.filter(f => f.grade !== undefined && f.grade >= 46)
  const allIndexArr = grade.map(d => getIndexGrade(bobotMutuFunction(d?.grade || 0), `${d?.sks}`)) || []

  const sksPassed = coutNumArray(passedGrade.map(v => v.sks) || [])
  const allSksCount = coutNumArray(grade.map(v => v.sks) || [])
  const allIndexCount = coutNumArray(allIndexArr)

  const getAllIndexGrade = Number((allIndexCount / allSksCount).toFixed(2))

  return {
    allSksCount,
    sksPassed,
    allIndexCount: Number(allIndexCount.toFixed(2)),
    getAllIndexGrade,
    lostGrade,
    passedGrade,
    notPassedGrade,
    defaultGrade: g
  }
}

export function formatPhoneNumber(v: string) {
  // Jika v bukan string, konversi menjadi string
  const phoneNumber = typeof v === 'string' ? v : `${v}`

  if (!phoneNumber) return phoneNumber

  const num = phoneNumber.replace(/\D/g, '')

  // ... sisa kode fungsi sama seperti yang Anda berikan sebelumnya ...
  if (num.substring(0, 1) === '0') return num.length === 3 ? num.substring(1) : num
  const numLenght = num.length
  if (numLenght < 4) return num
  if (numLenght < 6) return `${num.slice(0, 2)}-${num.slice(2)}`
  if (numLenght < 9) return `${num.slice(0, 2)}-${num.slice(2, 5)}-${num.slice(5)}`
  return `${num.slice(0, 2)}-${num.slice(2, 5)}-${num.slice(5, 8)}-${num.slice(8, 19)}`
}

export function convertToNumericPhoneNumber(phoneNumber: string): number {
  // Menghilangkan semua karakter selain angka
  const num = phoneNumber.replace(/\D/g, '')

  // Mengonversi hasilnya menjadi angka
  const numericPhoneNumber = Number(num)

  return numericPhoneNumber
}

export function convertToISODate(inputDate: Date | string | null): string {
  if (!inputDate) return ''
  const dateObj = new Date(inputDate)
  const isoDate = dateObj.toISOString()
  return isoDate
}

export function formatCaseString(input: string): string {
  if (/^[a-z][A-Za-z]*$/.test(input)) {
    return input.charAt(0).toUpperCase() + input.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2')
  }

  if (input.includes('_') || input.includes('-')) {
    const separator = input.includes('_') ? '_' : '-'
    return input
      .split(separator)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return input
}

export function convertToTimeFormat(dateString: Date | string | null) {
  const date = new Date(dateString || '')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export function getFirstAndLastDateOfYear() {
  const today = new Date()
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1)
  const lastDayOfYear = new Date(today.getFullYear(), 11, 31)

  return {
    dateStart: firstDayOfYear.toDateString(),
    dateEnd: lastDayOfYear.toDateString()
  }
}

export function convertTimeStringToDate(timeString: string) {
  if (!timeString || typeof timeString !== 'string') {
    return null // Atau default value yang sesuai
  }
  const [hours, minutes] = timeString.split(':')
  const currentDate = new Date() // Menggunakan tanggal hari ini

  // Mengatur jam dan menit sesuai dengan nilai dari string
  currentDate.setHours(parseInt(hours, 10))
  currentDate.setMinutes(parseInt(minutes, 10))
  currentDate.setSeconds(0)
  currentDate.setMilliseconds(0)

  return currentDate
}

export function nomorUrutTable(index: number, page: number, limit: number) {
  return index + 1 + (page - 1) * limit
}

type SemesterSKS = {
  semester: number
  totalSKS: number
  totalCourses: number
}

export function calculateTotalSKSPerSemester(
  courses: CurriculumData['courses'],
  courseType: 'KONSENTRASI' | 'PILIHAN' | 'WAJIB' | 'TUGAS AKHIR/ SKRIPSI/ THESIS/ DISERTASI'
): SemesterSKS[] {
  if (!courses) return []

  const semesterSKSMap: { [key: number]: { totalSKS: number; totalCourses: number } } = {}

  courses
    .filter(course => course.course.courseType === courseType)
    .forEach(({ course, semester }) => {
      if (!semesterSKSMap[semester]) {
        semesterSKSMap[semester] = { totalSKS: 0, totalCourses: 0 }
      }
      semesterSKSMap[semester].totalSKS += course.sks
      semesterSKSMap[semester].totalCourses += 1
    })

  return Object.entries(semesterSKSMap).map(([semester, { totalSKS, totalCourses }]) => ({
    semester: Number(semester),
    totalSKS,
    totalCourses
  }))
}

export function calculateTotalGraduationSKSPerSemester(
  courses: CurriculumData['courses'],
  courseType: 'KONSENTRASI' | 'PILIHAN' | 'WAJIB' | 'TUGAS AKHIR/ SKRIPSI/ THESIS/ DISERTASI'
): SemesterSKS[] {
  if (!courses) return []

  const semesterSKSMap: { [key: number]: { totalSKS: number; totalCourses: number } } = {}

  if (courseType === 'WAJIB' || courseType === 'TUGAS AKHIR/ SKRIPSI/ THESIS/ DISERTASI') {
    courses
      .filter(course => course.course.courseType === courseType)
      .forEach(({ course, semester }) => {
        if (!semesterSKSMap[semester]) {
          semesterSKSMap[semester] = { totalSKS: 0, totalCourses: 0 }
        }
        semesterSKSMap[semester].totalSKS += course.sks
        semesterSKSMap[semester].totalCourses += 1
      })
  }

  if (courseType === 'PILIHAN') {
    // Gunakan Set untuk memastikan hanya satu course dihitung per semester
    const uniqueCoursesPerSemester = new Set<number>()

    courses
      .filter(course => course.course.courseType === courseType)
      .forEach(({ course, semester }) => {
        if (!uniqueCoursesPerSemester.has(semester)) {
          uniqueCoursesPerSemester.add(semester)
          if (!semesterSKSMap[semester]) {
            semesterSKSMap[semester] = { totalSKS: 0, totalCourses: 0 }
          }
          semesterSKSMap[semester].totalSKS += course.sks
          semesterSKSMap[semester].totalCourses += 1
        }
      })
  }

  if (courseType === 'KONSENTRASI') {
    const seenKonsentrasi: { [key: number]: string[] } = []

    courses
      .filter(course => course.course.courseType === courseType)
      .forEach(({ course, semester }) => {
        if (!seenKonsentrasi[semester]) {
          seenKonsentrasi[semester] = []
        }
        if (!seenKonsentrasi[semester].includes(course.jurusanOrKonsentrasi || '')) {
          seenKonsentrasi[semester].push(course.jurusanOrKonsentrasi || '')
        }
      })
    courses
      .filter(course => course.course.courseType === courseType)
      .forEach(({ course, semester }) => {
        if (!semesterSKSMap[semester]) {
          semesterSKSMap[semester] = { totalSKS: 0, totalCourses: 0 }
        }
        if (seenKonsentrasi[semester][0] === course.jurusanOrKonsentrasi) {
          semesterSKSMap[semester].totalSKS += course.sks
          semesterSKSMap[semester].totalCourses += 1
        }
      })
  }

  return Object.entries(semesterSKSMap).map(([semester, { totalSKS, totalCourses }]) => ({
    semester: Number(semester),
    totalSKS,
    totalCourses
  }))
}

export function sumCourses(array: SemesterSKS[]) {
  const sumTotalSKS = array.reduce((sum, { totalSKS }) => sum + totalSKS, 0)
  const sumTotalCourses = array.reduce((sum, { totalCourses }) => sum + totalCourses, 0)

  return { sumTotalSKS, sumTotalCourses }
}

export function countSKSCurriculumData(courses: CurriculumData['courses']) {
  const WAJIB = calculateTotalSKSPerSemester(courses, 'WAJIB')
  const KONSENTRASI = calculateTotalSKSPerSemester(courses, 'KONSENTRASI')
  const PILIHAN = calculateTotalSKSPerSemester(courses, 'PILIHAN')
  const SKRIPSI = calculateTotalSKSPerSemester(courses, 'TUGAS AKHIR/ SKRIPSI/ THESIS/ DISERTASI')
  const TOTAL = [...WAJIB, ...KONSENTRASI, ...PILIHAN, ...SKRIPSI]
  const WAJIB_Grad = calculateTotalGraduationSKSPerSemester(courses, 'WAJIB')
  const KONSENTRASI_Grad = calculateTotalGraduationSKSPerSemester(courses, 'KONSENTRASI')
  const PILIHAN_Grad = calculateTotalGraduationSKSPerSemester(courses, 'PILIHAN')
  const SKRIPSI_Grad = calculateTotalGraduationSKSPerSemester(courses, 'TUGAS AKHIR/ SKRIPSI/ THESIS/ DISERTASI')
  const TOTAL_Grad = [...WAJIB_Grad, ...PILIHAN_Grad, ...KONSENTRASI_Grad, ...SKRIPSI_Grad]
  const konsentrasi = sumCourses(KONSENTRASI)
  const pilihan = sumCourses(PILIHAN)
  const total = sumCourses(TOTAL)
  const wajib_grad = sumCourses(WAJIB_Grad)
  const konsentrasi_grad = sumCourses(KONSENTRASI_Grad)
  const pilihan_grad = sumCourses(PILIHAN_Grad)
  const skripsi_grad = sumCourses(SKRIPSI_Grad)
  const total_grad = sumCourses(TOTAL_Grad)

  return {
    WAJIB,
    KONSENTRASI,
    PILIHAN,
    SKRIPSI,
    TOTAL,
    WAJIB_Grad,
    KONSENTRASI_Grad,
    PILIHAN_Grad,
    SKRIPSI_Grad,
    TOTAL_Grad,
    konsentrasi,
    pilihan,
    total,
    wajib_grad,
    konsentrasi_grad,
    pilihan_grad,
    skripsi_grad,
    total_grad
  }
}

export function detectOddEven(number: number) {
  if (number % 2 === 0) {
    return 'GENAP'
  } else {
    return 'GANJIL'
  }
}

export async function syncDocuments(
  newDocuments: string[],
  existingDocuments: string[],
  deleteFun?: (e: string) => Promise<any>,
  uploadFun?: (e: string) => Promise<any>
): Promise<string[]> {
  // Menghapus dokumen lama yang tidak ada di newDocuments
  for (let oldIndex = 0; oldIndex < existingDocuments.length; oldIndex++) {
    const oldDocument = existingDocuments[oldIndex]
    if (!newDocuments.includes(oldDocument)) {
      if (deleteFun) await deleteFun(oldDocument)
    }
  }

  // Mengunggah dokumen baru dan memperbarui URL-nya di newDocuments
  for (let newIndex = 0; newIndex < newDocuments.length; newIndex++) {
    const currentDocument = newDocuments[newIndex]
    if (!existingDocuments.includes(currentDocument)) {
      let res = { url: 'new' + newIndex }
      if (uploadFun) res = await uploadFun(currentDocument)
      newDocuments[newIndex] = res.url
    }
  }

  return newDocuments
}

export async function syncSingleDocument(
  newDocument: string | null,
  existingDocument: string | null,
  deleteFun?: (e: string) => Promise<any>,
  uploadFun?: (e: string) => Promise<any>
): Promise<string> {
  // Jika dokumen baru adalah null, hapus dokumen lama
  if (newDocument === null) {
    if (existingDocument) {
      if (deleteFun) await deleteFun(existingDocument)
    }
    return ''
  }

  // Jika dokumen lama ada, hapus dokumen lama
  if (existingDocument) {
    if (deleteFun) await deleteFun(existingDocument)
  }

  // Unggah dokumen baru
  let res = { url: 'new' }
  if (uploadFun) res = await uploadFun(newDocument)
  return res.url
}

export const sortScheduleDays = (a: ISchedule, b: ISchedule) => {
  // Bandingkan hari berdasarkan urutan di DAYS_OF_WEEK
  const dayA = DAYS_OF_WEEK.findIndex(day => day.value === a.day)
  const dayB = DAYS_OF_WEEK.findIndex(day => day.value === b.day)

  // Jika hari sama, bandingkan berdasarkan timeStart
  if (dayA === dayB) {
    const timeStartA = new Date(`1970-01-01T${a.timeStart}`)
    const timeStartB = new Date(`1970-01-01T${b.timeStart}`)
    return timeStartA.getTime() - timeStartB.getTime()
  }

  // Jika hari berbeda, kembalikan perbandingan hari
  return dayA - dayB
}

export function isSequential(nik: string) {
  nik = nik.toString()
  // Periksa urutan angka berurutan hingga 8 digit
  for (let i = 0; i < nik.length - 7; i++) {
    // Menggunakan 8 digit berturut-turut
    const digits = nik
      .slice(i, i + 8) // Ambil 8 digit berturut-turut
      .split('')
      .map(Number)

    // Cek ascending (misalnya 12345678)
    if (digits.every((val, idx) => idx === 0 || val === digits[idx - 1] + 1)) {
      return true
    }

    // Cek descending (misalnya 87654321)
    if (digits.every((val, idx) => idx === 0 || val === digits[idx - 1] - 1)) {
      return true
    }
  }
  return false
}

export function formatFormDataBody(body: Record<string, any>, csrf?: string): FormData {
  const valueKey = Object.keys(body)
  const formData = new FormData()

  for (let i = 0; i < valueKey.length; i++) {
    const key = valueKey[i]
    const v = body[key]

    if (typeof v === 'string') {
      formData.append(key, String(v))
    } else if (v instanceof File) {
      formData.append(key, v)
    } else if (Array.isArray(v)) {
      v.forEach(d => {
        if (typeof d === 'string') formData.append(key, String(d))
        else if (d instanceof File) formData.append(key, d)
        else if (d instanceof Date) formData.append(key, d.toISOString())
        else formData.append(key, JSON.stringify(d))
      })
    } else if (v instanceof Date) {
      formData.append(key, v.toISOString())
    } else if (!(v === null || v === undefined || v === '')) {
      formData.append(key, JSON.stringify(v))
    }
  }

  if (csrf) formData.append('_csrf', csrf)

  return formData
}

export function processFields<T extends {} | Record<string, unknown>>(set: T): T {
  Object.keys(set).forEach(key => {
    const value = set[key]

    // Cek untuk null, undefined, string kosong, array kosong, atau object kosong
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0 &&
        !(value instanceof Date))
    ) {
      // Jika kondisi terpenuhi, tambahkan ke unset dan hapus dari set
      delete set[key]
    }
  })

  return set
}

export function generateAcademicYears(rangePast = 6, rangeFuture = 2) {
  const currentYear = new Date().getFullYear()
  const startYear = currentYear + rangeFuture
  const endYear = currentYear - rangePast
  const years: string[] = []

  for (let year = startYear; year >= endYear; year--) years.push(`${year}/${year + 1}`)

  return years
}

export function noOnlineShown(studentType?: Student['studentType']) {
  if (studentType === 'ONLINE') return 'Eksekutif'
  if (studentType === 'OFFLINE') return 'Reguler'
  if (studentType === 'SIL') return 'SIL'
  if (studentType === 'GLOBAL') return 'Global'
  return studentType
}

export function HasPermission(
  requiredPermission: string[] = [],
  more?: { allowedRoles?: number[]; isStudent?: boolean; requiredSomePermission?: string[]; hasOrganization?: boolean }
): boolean {
  const { user } = useAppContext().auth

  if (!user) return false
  if (user.Admin) return true
  if (more?.isStudent && user.isStudent) return true
  if (more?.hasOrganization && user.organizations) return true

  const userPermissions = user.permissions || []
  const userRoles = user.role || []
  const hasPermission = requiredPermission.length ? requiredPermission.every(p => userPermissions.includes(p)) : false
  const hasRole = more?.allowedRoles?.length ? more.allowedRoles.every(role => userRoles.includes(role)) : false
  const hasSomePermission = more?.requiredSomePermission?.length
    ? more.requiredSomePermission.some(p => userPermissions.includes(p))
    : false

  return hasPermission || hasRole || hasSomePermission
}

export default function deepParseJSON<T>(data: { [key: string]: string | string[] | object | undefined }): T {
  // Iterasi melalui setiap key dalam objek
  for (const key in data) {
    // Cek apakah key adalah properti dari data
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // Cek jika field adalah string yang valid untuk di-parse
      try {
        // Cek apakah field adalah string yang bisa di-parse menjadi array atau objek
        if (data[key] === '[]') {
          data[key] = [] // Jika string adalah "[]", ubah menjadi array kosong
        } else if (typeof data[key] === 'string' && data[key].startsWith('[') && data[key].endsWith(']')) {
          data[key] = JSON.parse(data[key]) // Parse string JSON array
        } else if (typeof data[key] === 'string' && data[key].startsWith('{') && data[key].endsWith('}')) {
          data[key] = JSON.parse(data[key]) // Parse string JSON object
        } else if (Array.isArray(data[key])) {
          // Jika field adalah array, kita perlu mem-parsing setiap elemen
          data[key] = (data[key] as string[]).map(item => {
            try {
              return JSON.parse(item) // Parse setiap elemen dalam array
            } catch {
              return item
            }
          })
        }
      } catch (error) {
        throw new Error(`Field "${key}" tidak dapat diparse: ${(error as Error).message}`)
      }
    }
  }

  return data as T
}
