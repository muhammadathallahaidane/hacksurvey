function yearOnly(input) {
    let calendarFormat = new Date(input)
      let yearOnly = calendarFormat.getFullYear()
      return yearOnly
}

module.exports = yearOnly