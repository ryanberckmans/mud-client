
describe 'TextStream', ->
  it "should instantiate", ->
    new TextStream

  describe 'a new instance', ->
    beforeEach ->
      @textStream = new TextStream

    context 'with a hook function', ->
      beforeEach ->
        @fn = sinon.spy()
        @textStream.onPushLine @fn

      it "propagates pushLine to hook function", ->
        clearTextLine = "clear"
        domLine = "dom"
        @textStream.pushLine clearTextLine, domLine
        assert @fn.calledOnce
        assert @fn.calledWith clearTextLine, domLine

      context 'with an additional hook function', ->
        beforeEach ->
          @fn2 = sinon.spy()
          @textStream.onPushLine @fn2

        it "propagates pushLine to both children", ->
          clearTextLine = "clear"
          domLine = "dom"
          @textStream.pushLine clearTextLine, domLine
          assert @fn.calledOnce
          assert @fn.calledWith clearTextLine, domLine
          assert @fn2.calledOnce
          assert @fn2.calledWith clearTextLine, domLine

      context 'with the added hook function removed', ->
        beforeEach ->
          @textStream.offPushLine @fn

        it "no longer propagates pushedLine to the removed child textStream", ->
          @textStream.pushLine "foo", "bar"
          assert not @fn.calledOnce

    context 'with a child textStream', ->
      beforeEach ->
        @child = new TextStream
        @textStream.addChild @child

      it "propagates pushLine to the child textStream", ->
        spy = sinon.spy @child, "pushLine"
        clearTextLine = "clear"
        domLine = "dom"
        @textStream.pushLine clearTextLine, domLine
        assert spy.calledOnce
        assert spy.calledWith clearTextLine, domLine
        #spy.should.have.been.calledWith clearTextLine, domLine

      context 'with an additional child textStream', ->
        beforeEach ->
          @child2 = new TextStream
          @textStream.addChild @child2

        it "propagates pushLine to both children", ->
          spy = sinon.spy @child, "pushLine"
          spy2 = sinon.spy @child2, "pushLine"
          clearTextLine = "clear"
          domLine = "dom"
          @textStream.pushLine clearTextLine, domLine
          assert spy.calledOnce
          assert spy.calledWith clearTextLine, domLine
          assert spy2.calledOnce
          assert spy2.calledWith clearTextLine, domLine

      context 'with the added child removed', ->
        beforeEach ->
          @textStream.removeChild @child

        it "no longer propagates pushedLine to the removed child textStream", ->
          spy = sinon.spy @child, "pushLine"
          @textStream.pushLine "foo", "bar"
          assert not spy.calledOnce
