class Shouldbe {
    constructor() {
        this._value = null;
        this.errors = [];
        this.type = null;
        this.isAllow = false;
        this.propertyName = null;
    }

    // Set
    static value(value = null) {
        this._value = value;
        this.errors = [];
        this.isAllow = false;
        this.type = typeof value !== 'object' ? typeof value : Array.isArray(value) ? 'array' : 'object';
        return this;
    }

    // Get
    static val() {
        return {
            value: this._value,
            errors: this.isAllow ? [] : this.errors
        }
    }

    static string() {
        this.errors = [];
        if (typeof this._value !== 'string') {
            this.errors = [...this.errors, `value must be a String`];
        }
        return this;
    }

    static number() {
        const regex = /^[0-9]*$/;
        if (!regex.test(this._value) || this.type === 'string') {
            this.errors = [...this.errors, `value must be a Number (Integer)`];
        }
        return this;
    }

    static array() {
        if (!Array.isArray(this._value)) {
            this.errors = [...this.errors, `value must be an Array`];
        }
        return this;
    }

    static object() {
        if (Array.isArray(this._value) || typeof this._value !== 'object') {
            this.errors = [...this.errors, `value must be an Object`];
        }
        return this;
    }

    static min(minValue = 1) {
        let isValid = true;
        switch (this.type) {
            case 'number':
                if (this._value < minValue) {
                    isValid = false;
                }
                break;
            case 'object':
                let _isValid = false;
                let keyCount = 0;

                _isValid = keyCount >= minValue;
                for (let key in this._value) {
                    if (key) keyCount++;
                    _isValid = keyCount >= minValue;
                    if (_isValid) break;
                }
                if (!_isValid) {
                    isValid = false;
                }
                break;
            default:
                if (this._value.length < minValue) {
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.errors = [...this.errors, `value length must be greater than ${minValue}`];
        }

        return this;
    }

    static max(maxValue = 1) {
        let isValid = true;
        switch (this.type) {
            case 'number':
                if (this._value > maxValue) {
                    isValid = false;
                }
                break;
            case 'object':
                let _isValid = false;
                let keyCount = 0;
                for (let key in this._value) {
                    if (key) {
                        keyCount++;
                    }
                }
                _isValid = keyCount <= maxValue;
                if (!_isValid) {
                    isValid = false;
                }
                break;
            default:
                if (this._value.length > maxValue) {
                    isValid = false;
                }
                break;
        }
        if (!isValid) {
            this.errors = [...this.errors, `value length must be less than ${maxValue}`];
        }

        return this;
    }

    static alphanum() {
        const regex = /^[0-9a-zA-Z ]+$/;
        if (!regex.test(this._value)) {
            this.errors = [...this.errors, `value must be a Alphanumeric`];
        }
        return this;
    }

    static phone(length = 10) {
        let isValid = true;
        const regex = /^[0-9]*$/;
        if (this.type !== 'object' && this.type !== 'array') {
            let phoneNumber = this._value.toString();
            isValid = !regex.test(this._value) ? false : phoneNumber.length < length ? false : true
        }

        if (!isValid) {
            this.errors = [...this.errors, `Phone number must be number and ${length} digit long`];
        }
        return this;
    }

    static url() {
        const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;
        if (!regex.test(this._value)) {
            this.errors = [...this.errors, `Invalid url`];
        }
        return this;
    }

    static regex(regex = '') {
        const pattern = new RegExp(regex);
        if (!pattern.test(this._value)) {
            this.errors = [...this.errors, `value pattern is not matched`];
        }
        return this;
    }

    static email() {
        const regex = /^\w+([/\\.-]?\w+)*@\w+([/\\.-]?\w+)*(\.\w{2,3})+$/;
        if (!regex.test(this._value)) {
            this.errors = [...this.errors, `Invalid email`];
        }
        return this;
    }

    static trim() {
        if (this.type === 'string' && this._value.trim() === '') {
            this.errors = [...this.errors, `Value must not have leading or trailing whitespace`];
        }
        if (this.type !== 'string') {
            this.errors = [...this.errors, `Invalid Schema!, 'trim()' only work with 'String'`];
        }
        return this;
    }

    static required() {
        let isValid = true;
        switch (this.type) {
            case 'array':
                if (this._value.length === 0) {
                    isValid = false;
                }
                break;
            case 'object':
                let keys = 0;
                for (let key in this._value) {
                    if (key) {
                        keys++;
                    }
                }
                if (keys === 0) {
                    isValid = false;
                }
                break;
            default:
                if (this._value !== 0 && !this._value) {
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.errors = [...this.errors, `Value is required`];
        }
        return this;
    }

    static allow(value) {
        if (this._value === value) {
            this.isAllow = true;
        }
        return this;
    }

    static getErrors(obj = {}) {
        let errors = [];
        for (let key in obj) {
            if (obj[key].errors) {
                errors = [...errors, ...obj[key].errors];
            }
        }
        return errors;
    }

    static getUniqErrors(errors = []) {
        const _errors = [];
        errors.map(err => {
            const index = _errors.findIndex(_err => _err === err);
            if (index === -1) _errors.push(err);
            return '';
        });
        return _errors;
    }

    static validateItems(details = {}, schema = {}) {
        const parentErrors = [...this.errors];
        const result = this.SyncValidate(details, schema);
        const errors = this.getErrors(result);
        this.errors = [...parentErrors, ...this.errors, ...errors];
    }

    static items(schema) {
        const schemaType = typeof schema;

        if (this.type === 'object' && schemaType === 'object') {
            this.validateItems(this._value, schema);
        }

        if (this.type === 'array' && schemaType === 'function') {
            this._value.map(v => {
                const _details = {};
                _details[this.propertyName] = v;
                const _schema = {};
                _schema[this.propertyName] = schema;
                this.validateItems(_details, schema);
                return '';
            });
        }

        if (this.type === 'array' && schemaType === 'object') {
            this._value.map(v => {
                this.validateItems(v, schema);
                return '';
            });
        }
        return this;
    }

    static SyncValidate(details = {}, schema = {}) {
        const result = {};

        for (let key in schema) {
            const _value = details[key] || null;
            this.propertyName = key;
            this.value(_value);

            // check multiple schemas
            if (typeof schema[key] === 'function') {
                this.errors = [];
                schema[key]();
                result[key] = this.val();
            } else if (Array.isArray(schema[key])) {
                let _result = [];
                schema[key].map(s => {
                    this.errors = [];
                    s();
                    _result = [..._result, this.val()];
                    return '';
                });

                const validDetails = _result.filter(r => r.errors.length === 0);

                if (validDetails.length !== 0) {
                    result[key] = { ...validDetails[0] };
                } else {
                    let _errors = [];
                    _result.map(r => {
                        let errorMessage = r.errors.join(',');
                        _errors = [..._errors, errorMessage];
                        return '';
                    });
                    result[key] = { value: this._value, errors: [_errors.join(' or ')] }
                }
            } else {
                result[key] = { value: this._value, errors: ['Invalid Schema!'] }
            }
        }

        let isValid = true;
        for (let key in result) {
            if (isValid) {
                isValid = result[key].errors.length === 0;
            }
            result[key].errors = this.getUniqErrors(result[key].errors);
            if (!isValid) break;
        }

        result.isValid = isValid;
        return result;
    }

    static AsyncValidate(details = {}, schema = {}) {
        return new Promise((resolve, reject) => {
            const result = this.SyncValidate(details, schema);
            result.isValid ? resolve(result) : reject(result);
        });
    }
}

module.exports = Shouldbe;