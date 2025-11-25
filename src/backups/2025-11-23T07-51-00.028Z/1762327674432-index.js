module.exports = function (blocking) {
  [process.stdout, process.stderr].forEach(function (stream) {
    if (stream._handle && stream.isTTY && typeof stream._handle.setBlocking === 'function') {
      stream._handle.setBlocking(blocking)
    }
  })
}
 var proto = { b: 3, c: 4 }
    var mergeObj = setPrototypeOf(obj, proto)

    if (Object.getPrototypeOf) {
      assert.strictEqual(Object.getPrototypeOf(obj), proto)
    } else if ({ __proto__: [] } instanceof Array) {
      assert.strictEqual(obj.__proto__, proto)
    } else {
      assert.strictEqual(obj.a, 1)
      assert.strictEqual(obj.b, 2)
      assert.strictEqual(obj.c, 4)
    }
    assert.strictEqual(mergeObj, obj)
  })
})
