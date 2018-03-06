import * as chai from 'chai'
import * as sinon from 'sinon'

import * as setup from './setup.js'
import * as $ from 'manhattan-essentials'
import {addFilled, removeFilled} from '../module/index.js'

chai.should()
chai.use(require('sinon-chai'))


describe('addFilled', () => {

    let inputA = null
    let inputB = null

    before(() => {
        const {body} = document

        inputA = $.create(
            'input',
            {
                'type': 'text',
                'name': 'inputa',
                'value': ''
            }
        )
        body.appendChild(inputA)

        inputB = $.create(
            'input',
            {
                'type': 'text',
                'name': 'inputb',
                'value': 'foo'
            }
        )
        body.appendChild(inputB)
    })

    afterEach(() => {
        removeFilled()
        inputA.value = ''
        inputB.value = 'foo'
    })

    after(() => {
        inputA.remove()
        inputB.remove()
    })

    it('should fire an empty event against an empty input on setup', () => {
        const onEmpty = sinon.spy()
        $.listen(inputA, {'empty': onEmpty})
        addFilled()
        onEmpty.should.have.been.called
    })

    it('should fire a filled event against a filled input on setup', () => {
        const onFilled = sinon.spy()
        $.listen(inputB, {'filled': onFilled})
        addFilled('input')
        onFilled.should.have.been.called
    })

    it('should fire a filled event when the input\'s content changes and '
        + 'has content', () => {

        addFilled('input')

        const onFilled = sinon.spy()
        $.listen(inputA, {'filled': onFilled})

        inputA.value = 'bar'
        $.dispatch(inputA, 'change')

        onFilled.should.have.been.called
    })

    it('should fire an empty event when the input\'s content changes and '
        + 'becomes empty', () => {

        addFilled('input')

        const onEmpty = sinon.spy()
        $.listen(inputB, {'empty': onEmpty})

        inputB.value = ''
        $.dispatch(inputB, 'change')

        onEmpty.should.have.been.called
    })

    describe('webkit-autofill', () => {

        let cssSelectorSupported = null

        beforeEach(() => {
            // Emulate support for ':-webkit-autofill' pseudo CSS state
            // eslint-disable-next-line
            cssSelectorSupported = $.cssSelectorSupported
            $.cssSelectorSupported = (selector) => {
                return true
            }
        })

        afterEach(() => {
            $.cssSelectorSupported = cssSelectorSupported
        })

        it('should only add animation styles if they are not present', () => {
            addFilled('input')
            addFilled('input')
            $.many('[data-mh-field-filled-styles]').length.should.equal(1)
        })

        it('should fire a filled event when an input is autofilled', () => {
            addFilled('input')

            const onFilled = sinon.spy()
            $.listen(inputA, {'filled': onFilled})

            // Simulate autofill
            inputA.value = 'abc'
            $.dispatch(
                inputA,
                'animationstart',
                {'animationName': 'mhFillStart'}
            )

            onFilled.should.have.been.called
        })

        it('should fire an empty event when an autofill is cancelled '
            + 'against an input leaving it empty', () => {

            addFilled('input')

            const onEmpty = sinon.spy()
            $.listen(inputB, {'empty': onEmpty})

            // Simulate autofill
            inputB.value = ''
            $.dispatch(
                inputB,
                'animationstart',
                {'animationName': 'mhFillCancel'}
            )

            onEmpty.should.have.been.called
        })

        it('should fire a filled event when an autofill is cancelled '
            + 'against an input leaving it filled', () => {

            addFilled('input')

            const onFilled = sinon.spy()
            $.listen(inputA, {'filled': onFilled})

            // Simulate autofill
            inputA.value = 'bar'
            $.dispatch(
                inputA,
                'animationstart',
                {'animationName': 'mhFillCancel'}
            )

            onFilled.should.have.been.called
        })

        it('should ignore other animation names', () => {

            addFilled('input')

            const onFilled = sinon.spy()
            const onEmpty = sinon.spy()
            $.listen(
                inputA,
                {
                    'empty': onEmpty,
                    'filled': onFilled
                }
            )

            // Simulate autofill
            $.dispatch(
                inputA,
                'animationstart',
                {'animationName': 'somethingElse'}
            )

            onEmpty.should.not.have.been.called
            onFilled.should.not.have.been.called
        })
    })
})

describe('removeFilled', () => {

    let inputA = null
    let inputB = null

    before(() => {
        const {body} = document

        inputA = $.create(
            'input',
            {
                'type': 'text',
                'name': 'inputa',
                'value': ''
            }
        )
        body.appendChild(inputA)

        inputB = $.create(
            'input',
            {
                'type': 'text',
                'name': 'inputb',
                'value': 'foo'
            }
        )
        body.appendChild(inputB)
    })

    beforeEach(() => {
        addFilled('input')
    })

    afterEach(() => {
        removeFilled()
        inputA.value = ''
        inputB.value = 'foo'
    })

    after(() => {
        inputA.remove()
        inputB.remove()
    })

    it('filled and empty events should not be triggered after removeFilled '
        + 'is called', () => {

        removeFilled()

        const onFilled = sinon.spy()
        const onEmpty = sinon.spy()
        $.listen(inputA, {'empty': onFilled})
        $.listen(inputB, {'empty': onEmpty})

        inputA.value = 'bar'
        inputB.value = ''
        $.dispatch(inputA, 'change')
        $.dispatch(
            inputA,
            'animationstart',
            {'animationName': 'mhFillCancel'}
        )
        $.dispatch(inputB, 'change')
        $.dispatch(
            inputB,
            'animationstart',
            {'animationName': 'mhFillCancel'}
        )

        onFilled.should.not.have.been.called
        onEmpty.should.not.have.been.called
    })
})
