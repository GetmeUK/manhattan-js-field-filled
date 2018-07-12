import * as $ from 'manhattan-essentials'


// -- Event handlers --

/**
 * Handle the contents of a field changing
 */
function onChange(ev) {
    const field = ev.currentTarget
    if (field.value === '') {
        $.dispatch(field, 'empty')
    } else {
        $.dispatch(field, 'filled')
    }
}

/**
 * Handle the autofill events on Chrome (captured via animations)
 */
function onAutofill(ev) {
    const field = ev.currentTarget
    if (ev.animationName === 'mhFillStart') {
        $.dispatch(field, 'filled')
    } else if (ev.animationName === 'mhFillCancel') {
        if (field.value === '') {
            $.dispatch(field, 'empty')
        } else {
            $.dispatch(field, 'filled')
        }
    }
}


// -- Public functions --

/**
 * Add the `filled` event from any element matching the selector.
 */
export function addFilled(selector='input, select, textarea') {

    // Select all the fields we need to add the filled event to
    const fields = $.many(selector)

    if ($.cssSelectorSupported(':-webkit-autofill')) {
        // Detecting if an input is populated in Chrome/Webkit is tricky, to
        // cater for autofill we have to add animations that are triggered by
        // the :-webkit-autofill CSS pseudo class and listen for the animation
        // start/cancel events.

        // Check to see if we've already added the styles to capture autofill,
        // if not add them.
        if (!$.one('[data-mh-field-filled-styles]')) {
            // Insert the stylesheet
            const style = $.create(
                'style',
                {'data-mh-field-filled-styles': true}
            )
            style.appendChild(document.createTextNode(''))
            document.head.appendChild(style)

            // Add rules
            const {sheet} = style
            sheet.insertRule(
                '@keyframes mhFillStart {  from {/**/}  to {/**/}}',
                0
            )
            sheet.insertRule(
                '@keyframes mhFillCancel {  from {/**/}  to {/**/}}',
                0
            )
            sheet.insertRule(
                'input:-webkit-autofill { animation-name: mhFillStart; }',
                0
            )
            sheet.insertRule(
                'input:not(:-webkit-autofill) '
                    + '{ animation-name: mhFillCancel; }',
                0
            )

            // Listen for animation events
            for (let field of fields) {
                $.listen(field, {'animationstart': onAutofill})
            }
        }
    }

    // Listen for change/input events
    for (let field of fields) {
        $.listen(
            field,
            {
                'change': onChange,
                'input': onChange
            }
        )

        // Set the initial state of the field
        onChange({'currentTarget': field})
    }
}

/**
 * Remove the `filled` event from any element matching the selector.
 */
export function removeFilled(selector='input, select, textarea') {
    for (let field of $.many(selector)) {
        $.ignore(
            field,
            {
                'animationstart': onAutofill,
                'change': onChange,
                'input': onChange
            }
        )
    }

    if ($.one('[data-mh-field-filled-styles]')) {
        const animationStyles = $.one('[data-mh-field-filled-styles]')
        animationStyles.parentNode.removeChild(animationStyles)
    }
}
