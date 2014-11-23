
describe 'MudStream', ->
  it "should instantiate", ->
    new MudStream

  describe 'a new instance', ->
    beforeEach ->
      @mudStream = new MudStream

    context 'with a hook function', ->
      beforeEach ->
        @fn = sinon.spy()
        @mudStream.onPushLine @fn

      it "propagates pushLine to hook function", ->
        clearTextLine = "clear"
        domLine = "dom"
        @mudStream.pushLine clearTextLine, domLine
        assert @fn.calledOnce
        assert @fn.calledWith clearTextLine, domLine

      context 'with an additional hook function', ->
        beforeEach ->
          @fn2 = sinon.spy()
          @mudStream.onPushLine @fn2

        it "propagates pushLine to both children", ->
          clearTextLine = "clear"
          domLine = "dom"
          @mudStream.pushLine clearTextLine, domLine
          assert @fn.calledOnce
          assert @fn.calledWith clearTextLine, domLine
          assert @fn2.calledOnce
          assert @fn2.calledWith clearTextLine, domLine

      context 'with the added hook function removed', ->
        beforeEach ->
          @mudStream.offPushLine @fn

        it "no longer propagates pushedLine to the removed child mudStream", ->
          @mudStream.pushLine "foo", "bar"
          assert not @fn.calledOnce

    context 'with a child mudStream', ->
      beforeEach ->
        @child = new MudStream
        @mudStream.addChild @child

      it "propagates pushLine to the child mudStream", ->
        spy = sinon.spy @child, "pushLine"
        clearTextLine = "clear"
        domLine = "dom"
        @mudStream.pushLine clearTextLine, domLine
        assert spy.calledOnce
        assert spy.calledWith clearTextLine, domLine
        #spy.should.have.been.calledWith clearTextLine, domLine

      context 'with an additional child mudStream', ->
        beforeEach ->
          @child2 = new MudStream
          @mudStream.addChild @child2

        it "propagates pushLine to both children", ->
          spy = sinon.spy @child, "pushLine"
          spy2 = sinon.spy @child2, "pushLine"
          clearTextLine = "clear"
          domLine = "dom"
          @mudStream.pushLine clearTextLine, domLine
          assert spy.calledOnce
          assert spy.calledWith clearTextLine, domLine
          assert spy2.calledOnce
          assert spy2.calledWith clearTextLine, domLine

      context 'with the added child removed', ->
        beforeEach ->
          @mudStream.removeChild @child

        it "no longer propagates pushedLine to the removed child mudStream", ->
          spy = sinon.spy @child, "pushLine"
          @mudStream.pushLine "foo", "bar"
          assert not spy.calledOnce
