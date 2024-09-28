import { BigNumber } from 'bignumber.js'

export const telegramInitDataRawToObject = (encodedString: string) => {
  // Decode the URL-encoded string
  const decodedString = decodeURIComponent(encodedString)
  // Split the string into key-value pairs
  const params = decodedString.split('&')
  // Create an object to hold the parsed values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = {}
  params.forEach((param) => {
    // Split each key-value pair
    const [key, value] = param.split('=')
    // Parse JSON string if the key is 'user'
    if (key === 'user') {
      result[key] = JSON.parse(value)
    } else {
      result[key] = value
    }
  })
  return result
}

export const formatNumberDownRound = (
  number: number | null | undefined,
  decimal = 3,
  suffixes = ''
) => {
  if (number === null || number === undefined) return 0
  const bigValue = new BigNumber(number)
  const bigValueFormatted = bigValue.toFormat(decimal, BigNumber.ROUND_DOWN, {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3
  })
  if (bigValueFormatted === 'NaN') {
    return `0 ${suffixes}`
  }
  // remove zero and dot in decimal part (ex: 1,111.00 => 1,111)
  const valueConcated = bigValueFormatted.replace(/\.?0+$/, '')

  return `${valueConcated} ${suffixes}`
}
