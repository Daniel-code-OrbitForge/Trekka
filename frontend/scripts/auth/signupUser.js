document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.getElementById('signUpForm')
    const cards = document.getElementsByClassName('card')
    nextBtn1 = document.querySelector('.user-next-btn1')
    toContactInfo = document.querySelectorAll('.next')[0]
    toSignUp = document.querySelectorAll('.next')[1]
    progress = document.querySelector('.progress')
    signUpstep = document.querySelector('.signup-step')
    // roleSelection = document.querySelector('.role-options')
    container = document.querySelectorAll('.container')
    user = document.querySelectorAll('.option')[0]
    driver = document.querySelectorAll('.option')[1]
    company = document.querySelectorAll('.option')[2]
    admin = document.querySelectorAll('.option')[2]


    user.addEventListener('click', ()=>{
        container[0].classList.toggle('deactivate')
        container[1].classList.toggle('deactivate')
    })

    driver.addEventListener('click', ()=>{
        container[0].classList.toggle('deactivate')
        container[1].classList.toggle('deactivate')
    })

    company.addEventListener('click', ()=>{
        document.location.assign('../../pages/auth/signupCompany.html')
    })

    // roleSelection.addEventListener('click', (event)=>{
    //     if(event.target === roleSelection.querySelectorAll('.option')[0]){
    //         container[0].classList.toggle('deactivate')
    //         container[1].classList.toggle('deactivate')
    //     }
    // })


    nextBtn1.addEventListener('click', ()=>{
        cards[0].classList.toggle('active')
        cards[1].classList.toggle('active')
        progress.style.width = '67%'
        signUpstep.firstElementChild.textContent = 'Step 2 of 3'
        signUpstep.lastElementChild.textContent = '67%'
    })

    // backBtn1.addEventListener('click', ()=>{
    //     cards[0].classList.toggle('active')
    //     cards[1].classList.toggle('active')
    // })

    toContactInfo.addEventListener('click', (event)=>{
        if(event.target === toContactInfo.querySelectorAll('.btn')[0]){
            cards[0].classList.toggle('active')
            cards[1].classList.toggle('active')
            progress.style.width = '33%'
            signUpstep.firstElementChild.textContent = 'Step 1 of 3'
            signUpstep.lastElementChild.textContent = '33%'
        }else{
            cards[1].classList.toggle('active')
            cards[2].classList.toggle('active')
            progress.style.width = '100%'
            signUpstep.firstElementChild.textContent = 'Step 3 of 3'
            signUpstep.lastElementChild.textContent = '100%'
        }
    })

    toSignUp.addEventListener('click', (event)=>{
        if(event.target === toSignUp.querySelectorAll('.btn')[0]){
            cards[1].classList.toggle('active')
            cards[2].classList.toggle('active')
            progress.style.width = '67%'
            signUpstep.firstElementChild.textContent = 'Step 2 of 3'
            signUpstep.lastElementChild.textContent = '67%'
        }
        // else{ logic to submit form to API and go to user profile}
    })
    console.log(cards[0])
    console.log(nextBtn1)
    // console.log(roleSelection.querySelectorAll('.option'))
})