should = require 'should'
assert = require 'assert'
{Lineizer} = require '../js/lineizer'

describe 'Lineizer', ->
  it "should instantiate", ->
    new Lineizer

  describe 'a new instance', ->
    beforeEach ->
      @lineizer = new Lineizer

    it "should return undefined for popLine", ->
      assert.equal @lineizer.popLine(), undefined

    describe 'with a simple line of text pushed', ->
      beforeEach ->
        @text = 'simple line of text'
        @lineizer.push @text

      it "should pop the text unmolested", ->
        @lineizer.popLine().should.be.exactly @text

      it "should be empty after the first pop", ->
        @lineizer.popLine()
        assert.equal @lineizer.popLine(), undefined
