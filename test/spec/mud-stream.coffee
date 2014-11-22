
describe 'MudStream', ->
  it "should instantiate", ->
    new MudStream

  describe 'a new instance', ->
    beforeEach ->
      @mudStream = new MudStream

    context 'with a child mudStream', ->
      beforeEach ->
        @child = new MudStream
        @mudStream.addChild @child

      it "propagates pushLine to the child mudStream", ->
        @mudStream
