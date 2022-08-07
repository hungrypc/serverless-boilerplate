const isCastableToNumber = (value: string) => {
  return value !== '' && !Number.isNaN(Number(value))
}

export { isCastableToNumber }
