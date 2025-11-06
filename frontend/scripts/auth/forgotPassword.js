document.addEventListener('DOMContentLoaded', ()=>{

    // Function to check if all inputs are filled
    function inputIsComplete(inputs) {
        const fullToken = Array.from(inputs).map(input => input.value).join('');
        
        if (fullToken.length === inputs.length) {
            console.log("Full Token:", fullToken);
            // Here you would typically submit the form or make an AJAX call
            // e.g., document.getElementById('forgotPasswordForm').submit();
            return true
        }
        // console.log(fullToken)
        return false
    }

    function checkPasswords() {
        // const password = passwordField.value;
        // const confirmPassword = confirmPasswordField.value;

        if (passwordField.value === confirmPasswordField.value && passwordField.value !== '') {
            password = passwordField.value;
            confirm_password = confirmPasswordField.value;
            messageDiv.textContent = 'Passwords match!';
            messageDiv.style.color = 'green';
            update_password.disabled = false

        } else if (confirmPasswordField.value !== '') {
            messageDiv.textContent = 'Passwords do not match.';
            messageDiv.style.color = 'red';
            update_password.disabled = true

        } else {
            messageDiv.textContent = ''; // Clear message if confirm password is empty
    }
}



    //===== buttons======
    const request_token = document.querySelector('#request-token')
    const verify_token = document.querySelector('#verify-token')
    const update_password = document.querySelector('#update-password')
    const reset_complete =document.querySelector('#reset-complete')
    //===================

    const email = document.querySelector('.resetInputField')
    const reset_step = document.querySelectorAll('.reset-step')
    const otpInputs = document.querySelectorAll('.otp-container input')

    input1 = document.querySelectorAll('.otp-container input')[0]
    const passwordField = document.querySelectorAll("#reset-section input")[0]
    const confirmPasswordField = document.querySelectorAll('#reset-section input')[1]
    const messageDiv = document.getElementById('password_match_message')
    let confirm_password , password
    console.log(confirmPasswordField)


    //check for valid email input and then enable request_token button
    email.addEventListener('input', (event)=>{
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(pattern.test(event.target.value)){
            request_token.disabled = false
        }else{
            request_token.disabled = true
        }
    })

    request_token.addEventListener('click', ()=>{
        // for(const step of reset_step){
        //     step.classList.toggle('hidden')
        // }

        // send mail then activate token screen and disable email screen
        reset_step[0].classList.toggle('hidden')
        reset_step[1].classList.toggle('hidden')
        input1.focus()

    })

    //Handle the otp inputs
    otpInputs.forEach((input, index) =>{
        //for each event listener, input and its index has been captured in the addEventListener
        input.addEventListener('input', (e)=>{
            // filter non-digit entries
            e.target.value = e.target.value.replace(/[^0-9]/g, '')
            // console.log(input1.value)

            // Move to the next input if the current one is filled
            if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }

            if (inputIsComplete(otpInputs)){
                verify_token.disabled = false
            }
        })

        // Handle Backspace (move focus backward and clear) ---
        input.addEventListener('keydown', (e) => {
            if ((e.key === 'Backspace' && e.target.value.length === 0 && index > 0)){
                console.log(e.target)
                // Prevent the default backspace action from affecting the previous input
                e.preventDefault(); 
                
                // Move focus to the previous input
                otpInputs[index - 1].focus();
                
                // Clear the previous input's value
                otpInputs[index - 1].value = ''; 
                
                // checkCompletion(otpInputs);
            }else if(e.key === 'Backspace' && e.target === otpInputs[4]){
                verify_token.disabled = true
            }
        });

        input.addEventListener('paste', (event)=>{
            event.preventDefault() //prevent default paste behaviour

            //get pasted data
            const pasteData = event.clipboardData.getData('text').trim().slice(0, otpInputs.length)

            // fill the inputs with the available character until all inputs are filled or until characters are exhausted
            if(pasteData > 0){
                pasteData.split('').forEach((char, i)=>{
                    if(index + i < otpInputs.length)[
                        otpInputs[index + i].value = char
                    ]
                })
                // once done, focus to the next available input or the last one
                const nextIndex = Math.min(index + pasteData.length, otpInputs.length - 1);
                otpInputs[nextIndex].focus();

                if (inputIsComplete(otpInputs)){
                verify_token.disabled = false
                }
            }
        })
    })
        

    

    // check that each token input contains a number and is the correct
    // token
    verify_token.addEventListener('click', ()=>{
        
        reset_step[1].classList.toggle('hidden')
        reset_step[2].classList.toggle('hidden')

    })

    passwordField.addEventListener('keyup', checkPasswords)
    confirmPasswordField.addEventListener('keyup', checkPasswords)

    update_password.addEventListener('click', (e)=>{
        // for(const step of reset_step){
        //     step.classList.toggle('hidden')
        // }
        //update new password in server and go to sucessful screen
        e.preventDefault()
        reset_step[2].classList.toggle('hidden')
        reset_step[3].classList.toggle('hidden')

    })

    reset_complete.addEventListener('click', (e)=>{
        e.preventDefault()
        // submit the form details and go to sign in page
        document.location.assign('../../pages/auth/login.html')

    })

    console.log(request_token)
    console.log(reset_step)
    console.log(verify_token)
    console.log(input1.pattern)
    console.log(otpInputs)
})