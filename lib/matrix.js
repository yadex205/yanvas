class Matrix {
  static createIdentity(order) {
    let values = []

    for (let row = 0; row < order; row++) {
      for (let col = 0; col < order; col++) {
        values.push(row === col ? 1 : 0)
      }
    }

    return new this(values)
  }

  constructor(values) {
    this.values = values instanceof Matrix ? values.values : values
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
    return new Float32Array(this.transpose().values)
  }

  get order() {
    return this._order
  }

  // @see http://www.ced.is.utsunomiya-u.ac.jp/lecture/2011/prog/p2/kadai3/no3/lu.pdf
  get lu() {
    let l = this.constructor.createIdentity(this.order)
    let u = this.constructor.createIdentity(this.order)
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
      tmpMatrix = tmpMatrix.sub(new this.constructor(values))
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

    return new this.constructor(values)
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
    return new this.constructor(values)
  }

  sub(other) {
    if (this.order !== other.order) { return }

    let values = this.values.map((val, index) => val - other.values[index])
    return new this.constructor(values)
  }

  multiply(other) {
    if (this.length !== other.length) { return }

    let matrix = this.constructor.createIdentity(this.order)

    for (let row = 0; row < this.order; row++) {
      for (let col = 0; col < this.order; col++) {
        let value = 0

        for (let i = 0; i < this.order; i++) {
          value += this.getValue(row, i) * other.getValue(i, col)
        }
        matrix.setValue(row, col, value)
      }
    }

    return matrix
  }

  transpose() {
    let values = []

    for (let col = 0; col < this.order; col++) {
      let vec = this.values.filter((_val, index) => index % this.order === col)
      values = values.concat(vec)
    }

    return new this.constructor(values)
  }

  inverse() {
    let lu = this.lu
    let l = lu.L
    let u = lu.U
    let ident = this.constructor.createIdentity(this.order)
    let lInv  = this.constructor.createIdentity(this.order)
    let uInv  = this.constructor.createIdentity(this.order)

    for (let row = 0; row < this.order; row++) {
      for (let col = 0; col < row + 1; col++) {
        let val = 0

        for (let i = 0; i < row; i++) {
          val += l.getValue(row, i) * lInv.getValue(i, col)
        }

        lInv.setValue(row, col, (ident.getValue(row, col) - val) / l.getValue(row, row))
      }
    }

    for (let row = this.order - 1; row >= 0; row--) {
      for (let col = this.order - 1; col >= row; col--) {
        let val = 0

        for (let i = this.order - 1; i > row; i--) {
          val += u.getValue(row, i) * uInv.getValue(i, col)
        }

        uInv.setValue(row, col, (ident.getValue(row, col) - val) / u.getValue(row, row))
      }
    }

    return uInv.multiply(lInv)
  }
}

module.exports = Matrix
