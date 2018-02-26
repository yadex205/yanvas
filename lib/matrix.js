class Matrix {
  static createIdentity(order) {
    let values = []

    for (let row = 0; row < order; row++) {
      for (let col = 0; col < order; col++) {
        values.push(row === col ? 1 : 0)
      }
    }

    return new Matrix(values)
  }

  constructor(values) {
    this.values = values
  }

  set values(valueArray) {
    this._values = valueArray
    this._order  = Math.sqrt(valueArray.length)

    if (!Number.isInteger(this._order)) {
      throw 'Values length should be a square number'
    }
  }

  get values() {
    return this._values
  }

  get glValues() {
    return this.transpose()
  }

  get order() {
    return this._order
  }

  // @see http://www.ced.is.utsunomiya-u.ac.jp/lecture/2011/prog/p2/kadai3/no3/lu.pdf
  get lu() {
    let l = Matrix.createIdentity(this.order)
    let u = Matrix.createIdentity(this.order)
    let tmpMatrix = this

    for (let step = 0; step < this.order; step++) {
      let vecRow = []
      let vecCol = []

      for (let row = 0; row < this.order - step; row++) {
        vecRow.push(tmpMatrix.getValue(row, 0))
        l.setValue(step + row, step, tmpMatrix.getValue(row, 0))
      }

      if (step === this.order - 1) { break }

      for (let col = 1; col < this.order - step; col++) {
        vecCol.push(tmpMatrix.getValue(0, col) / tmpMatrix.values[0])
        u.setValue(step, step + col, tmpMatrix.getValue(0, col) / tmpMatrix.values[0])
      }

      let values = []
      for (let row = 1; row < vecRow.length; row++) {
        for (let col = 0; col < vecCol.length; col++) {
          values.push(vecRow[row] * vecCol[col])
        }
      }

      tmpMatrix = tmpMatrix.subMatrix(1, 1, tmpMatrix.order - 1, tmpMatrix.order - 1)
      tmpMatrix = tmpMatrix.sub(new Matrix(values))
    }

    return { L: l, U: u }
  }

  setValue(row, col, val) {
    this._values[this.order * row + col] = val
  }

  getValue(row, col) {
    return this.values[this.order * row + col]
  }

  subMatrix(row1, col1, row2, col2) {
    if ((row2 - row1) !== (col2 - col1)) {
      throw 'Sub matrix should be a square matrix.'
    }

    let values = []
    for (let row = row1; row <= row2; row++) {
      let frag = this.values.slice(this.order * row + col1, this.order * row + col2 + 1)
      values = values.concat(frag)
    }

    return new Matrix(values)
  }

  print() {
    let values = []
    for (let row = 0; row < this.order; row++) {
      values.push(this.values.slice(this.order * row, this.order * (row + 1)))
    }
    console.table(values)
  }

  add(other) {
    if (this.order !== other.order) { return }

    let values = this.values.map((val, index) => val + other.values[index])
    return new Matrix(values)
  }

  sub(other) {
    if (this.order !== other.order) { return }

    let values = this.values.map((val, index) => val - other.values[index])
    return new Matrix(values)
  }

  multiply(other) {
    if (this.length !== other.length) { return }

    let values = []

    for (let row = 0; row < this.order; row++) {
      let vec1 = this.values.slice(row * this.order, (row + 1) * this.order)
      for (let col = 0; col < this.order; col++) {
        let value = 0
        let vec2 = other.values.filter((_val, index) => index % this.order === col)

        vec1.forEach((val, index) => value = val + vec2[index])
        values[row * this.order + col] = value
      }
    }

    return new Matrix(values)
  }

  transpose() {
    let values = []

    for (let col = 0; col < this.order; col++) {
      let vec = this.values.filter((_val, index) => index % this.order === col)
      values = values.concat(vec)
    }

    return new Matrix(values)
  }
}

module.exports = Matrix
