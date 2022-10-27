export default class Forms {
    constructor (forms) {
        this.forms = document.querySelectorAll(forms);
        this.messages = {
            success: 'Success! Your form has been submitted successfully',
            failur: 'Oops... something went wrong',
            loading: 'Sending, please wait',
        }
        this.path = 'assets/question.php';
        this.inputs = document.querySelectorAll('input');
    }

    noCyrillicInputValidation (selector) {
        this.inputs.forEach(input => {
            if (input.getAttribute('name') == selector) {
                input.addEventListener('input', () => {
                    input.value = input.value.replace(/[а-яё]/, '');
                });
            }
        });
    }

    clearInputs () {
        this.inputs.forEach(input => input.value = '');
    }

    removeStatusMessage () {
        document.querySelectorAll('.status-message').forEach(item => item.remove());
    }

    changeStatusMessage (text, num) {
        this.forms[num].querySelector('.status-message').textContent = text;
    }

    async postData (url, data, num) {
        const message = document.createElement('div');
        message.classList.add('status-message' ,'animated', 'fadeInUp');
        if (num === 0) {
            message.style.cssText = `
            display: flex;
            margin-top: 25px;
            align-items: center;
            font-weight: 800;
            font-size: 40px;
            color: #fff;
        `;
        } else {
            message.style.cssText = `
            display: flex;
            margin-top: 25px;
            align-items: center;
            font-size: 32px;
            font-weight: 800;
            color: #000;
        `;
        }

        message.textContent = this.messages.loading;

        this.forms[num].appendChild(message);

        let res = await fetch(url, {
            method: 'POST',
            body: data,
        });

        return await res.text();
    }

    bindTriggers () {
        this.forms.forEach((form, i) => {
            form.addEventListener('submit', async (e) => {
                try {
                    e.preventDefault();
    
                    let formData = new FormData(form);

                    await this.postData(this.path, formData, i);

                    console.log(await this.postData(this.path, formData, i));
                    this.changeStatusMessage(this.messages.success, i);

                } catch (e) {
                    this.changeStatusMessage(this.messages.failur, i);

                } finally {
                    this.clearInputs();
                    setTimeout(this.removeStatusMessage, 5000);
                }
            });
        });
    }

    cratePhoneMask (selector) {

        let setCursorPosition = (pos, elem) => {
            elem.focus();
    
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                let range = elem.createTextRange();
    
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        };
    
        function createMask(event) {
    
            let matrix = '+1 (___) ___-____',
                i = 0,
                def = matrix.replace(/\D/g, ''),
                val = this.value.replace(/\D/g, '');
            
            if (def.length >= val.length) {
                val = def;
            }
    
            this.value = matrix.replace(/./g, function (a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
            });
    
            if (event.type === 'blur') {
                if (this.value.length == 2) {
                    this.value = '';
                }
            } else {
                setCursorPosition(this.value.length, this);
            }
        }
    
        let inputs = document.querySelectorAll(selector);
    
        inputs.forEach(input => {
            input.addEventListener('input', createMask);
            input.addEventListener('focus', createMask);
            input.addEventListener('blur', createMask);
        });
    }

    init () {
        this.bindTriggers();
        this.noCyrillicInputValidation('email');
        this.cratePhoneMask('#phone');
    }
}