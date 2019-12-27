## Shouldbe

Object schema validator for Javascript.

## Introduction

`Shouldbe` allow you to create the Object schemas to validate javascript Object. it will simplify lots of manual conditions to validate data.

## Install
```
npm i --save shouldbe
```

## How to import

```
import Shouldbe from 'shouldbe-validator';

OR

const Shouldbe = require('shouldbe-validator');
```

## Example

```
// Details Object 

const details = {
    firstName: 'john',
    lastName: 'snow',
    age: 28,
    address: {
        line1: 'Winterfell',
        line2: 'Wall',
        country: 'Seven kingdom'
    }
};

// Schema Object

const schema = {
    firstName: () => Shouldbe.string().min(3).max(15).required(),
    lastName: () => Shouldbe.string().min(3).max(15).required(),
    age: () => Shouldbe.number().min(30).required(),
    address: () => Shouldbe.object().items({
        line1: () =>Shouldbe.string(),
        line2: () =>Shouldbe.string(),
        country: () =>Shouldbe.string(),
    })
}

const result = Shouldbe.SyncValidate(details, schema);
```
> Remember `Property Name` of `Schema` must be same as `Details Object`.

## Output

```
{ 
    firstName: { value: 'john', errors: [] },
    lastName: { value: 'snow', errors: [] },
    age:{ value: 28, errors: [ 'value length must be greater than 30' ] },
    address: { value: 'Seven kingdom', errors: [] },
    isValid: false 
}
```

## Multiple schema (OR)
```
const details = {
    phone: '1234567890',
};

const schema = {
    phone: [
        () => Shouldbe.number().phone(10),
        () => Shouldbe.string().phone(10)
    ],
}
```
> In above example we provide multiple schemas to `phone` attribute, It means phone number can be `String` or `Number` 

## Options

Rules | Description 
-------|-------------
`string`| The value must be `String` 
`number`| The value must be `Nubmer (Integer)` 
`array`| The value must be an `Array` 
`object`| The value must be an `Object` 
`min`| This will check minimum `length` of `Array`, `String` and `Object`, and `value` of `Number (Integer)` 
`max`| This will check maximum `length` of `Array`, `String` and `Object`, and `value` of `Number (Integer)` 
`alphanum`| The value must be alphanumeric 
`phone`| The value must be number and given length long `.phone(10)` 
`url`| The value must be valid `url` 
`regex`| The value must match given pattern `.regex('^[0-9]*$')` 
`email`| The value must be valid Email id 
`trim`| The value must not have leading or trailing whitespace 
`required`| The value must not have blank 
`allow`| The value can be given value `.allow(null)` 
`items`| Accept nested schema for `Object` and `Array` 

## Methods

```
// Synchronous call

    Shouldbe.SyncValidate(detailsObject, SchemaObject);

// Asynchronous call

    Shouldbe.AsyncValidate(detailsObject, SchemaObject);
```