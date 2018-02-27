<div align="center">
    <img width="196" height="96" vspace="20" src="http://assets.getme.co.uk/manhattan-logo--variation-b.svg">
    <h1>Manhattan Field Filled</h1>
    <p>Dispatch a 'filled' and 'empty' event against text inputs, selects and textareas whenever the field is filled or emptied.</p>
    <a href="https://badge.fury.io/js/manhattan-field-filled"><img src="https://badge.fury.io/js/manhattan-field-filled.svg" alt="npm version" height="18"></a>
    <a href="https://travis-ci.org/GetmeUK/manhattan-js-field-filled"><img src="https://travis-ci.org/GetmeUK/manhattan-js-field-filled.svg?branch=master" alt="Build Status" height="18"></a>
    <a href='https://coveralls.io/github/GetmeUK/manhattan-js-field-filled?branch=master'><img src='https://coveralls.io/repos/github/GetmeUK/manhattan-js-field-filled/badge.svg?branch=master' alt='Coverage Status' height="18"/></a>
    <a href="https://david-dm.org/GetmeUK/manhattan-js-field-filled/"><img src='https://david-dm.org/GetmeUK/manhattan-js-field-filled/status.svg' alt='dependencies status' height="18"/></a>
</div>

## Installation

`npm install manhattan-field-filled --save-dev`


## Usage

```JavaScript
import * as $ from 'manhattan-essentials'
import {addFilled} from 'manhattan-field-filled' 


$.listen(
    $.one('.some-input'),
    {
        'empty': (ev) => {
            this.classList.add('empty')
        },
        'filled': (ev) => {
            this.classList.add('filled')
        }
    }
)

addFilled()
```
