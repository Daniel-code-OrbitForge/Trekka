document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.getElementById('signUpForm')
    const cards = document.getElementsByClassName('card')
    companyInfo = document.querySelectorAll('.next')[0]
    verification = document.querySelectorAll('.next')[1]
    securityAndSignup = document.querySelectorAll('.next')[2]
    progress = document.querySelectorAll('.stage')
    signUpstep = document.querySelector('.signup-step')


    // nextBtn1.addEventListener('click', ()=>{
    //     cards[0].classList.toggle('active')
    //     cards[1].classList.toggle('active')
    // })

    // backBtn1.addEventListener('click', ()=>{
    //     cards[0].classList.toggle('active')
    //     cards[1].classList.toggle('active')
    // })

    companyInfo.addEventListener('click', (event)=>{
        if(event.target === companyInfo.querySelectorAll('.btn')[0]){
           document.location.assign('../../pages/auth/signupUser.html')
            
        }else{
            cards[0].classList.toggle('active')
            cards[1].classList.toggle('active')
            progress[0].classList.toggle('active-stage')
            progress[1].classList.toggle('active-stage')
        }
    })

    verification.addEventListener('click', (event)=>{
        if(event.target === verification.querySelectorAll('.btn')[0]){
            cards[0].classList.toggle('active')
            cards[1].classList.toggle('active')
            progress[0].classList.toggle('active-stage')
            progress[1].classList.toggle('active-stage')
        }else{
            cards[1].classList.toggle('active')
            cards[2].classList.toggle('active')
            progress[1].classList.toggle('active-stage')
            progress[2].classList.toggle('active-stage')
        }
    })

    securityAndSignup.addEventListener('click', (event)=>{
        if(event.target === securityAndSignup.querySelectorAll('.btn')[0]){
            cards[1].classList.toggle('active')
            cards[2].classList.toggle('active')
            progress[1].classList.toggle('active-stage')
            progress[2].classList.toggle('active-stage')
        }
        // else (logic to sumbit form and go to company profile)
    })

    console.log(cards)
    console.log(companyInfo)
})