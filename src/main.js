import "./css/index.css";
import IMask from 'imask';

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
    const colors = {
        visa: ["#436D99", "#2D57F2"],
        mastercard: ["#DF6F29", "#C69347"],
        cielo: ["#E51B70", "#DC6EEE"],
        default: ["black", "gray"],
    }

ccBgColor01.setAttribute("fill", colors[type][0])
ccBgColor02.setAttribute("fill", colors[type][1])
ccLogo.setAttribute("src", `cc-${type}.svg`)
} 

/*setCardType("visa") or*/
globalThis.setCardType = setCardType

// CVC security code
const securityCode = document.querySelector('#security-code')
const securityCodePattern = {
    mask: "0000",      //Standard 4 digit
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

//expiration-date
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
         YY: {
          mask: IMask.MaskedRange,
          from: String(new Date().getFullYear()).slice(2),
          to: String(new Date().getFullYear() + 10).slice(2)   /*get the  o ano atual ate more 10 yeas*/
        },
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        }  
        
        },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

//card number
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex:/^4\d{0,15}/,
            cardtype: "visa",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard",
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default",
        },
    ],
    dispatch: function(appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g,"")
        const foundMask = dynamicMasked.compiledMasks.find(function (item) {
            return number.match(item.regex)
        })
        //console.log(foundMask)  
        return foundMask      
    },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)    

//events DOM => add card button
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
    //console.log("Your click here") OR Alert
    alert("Card Add💸.")
} )
    
    //don't remove the consolation log the F12 
    document.querySelector("form").addEventListener("submit", (event) => {
        event.preventDefault() //do wait i determine
    })  

//capture card name
const cardHolder = document.querySelector("#card-holder")
    cardHolder.addEventListener("input", () => {
        const ccHolder = document.querySelector(".cc-holder .value")

        ccHolder.innerText = cardHolder.value.length === 0 ? "Enter Card Name" : cardHolder.value
        // ternary (condition, true, false) => length === 0 ? "Enter Card Name"=> continues the information inside the card
        // : cardHolder.value => opposite case 
    })

    //access cvc card 
    securityCodeMasked.on("accept", () => {
        updateSecurityCode(securityCodeMasked.value);

    })

    //access function cvc card 
    function updateSecurityCode(code) {
        const ccSecutiry = document.querySelector(".cc-security .value")

        ccSecutiry.innerText = code.length === 0 ? "123" : code
    }
 
    //access number card
    cardNumberMasked.on("accept", () => {
        const cardType = cardNumberMasked.masked.currentMask.cardtype
        setCardType(cardType) //type card
        updateCardNumber(cardNumberMasked.value);
    })

    //access function number card
    function updateCardNumber(number){
        const ccNumber = document.querySelector(".cc-number")
        ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
    }

    //expiration date
    expirationDateMasked.on("accept", () => {
        updateExpirationDate(expirationDateMasked.value)

    })
    
    //access function expiration date
    function updateExpirationDate(date){
        const ccExpiration = document.querySelector(".cc-extra .value")
        ccExpiration.innerText = date.length === 0 ? "02/32" : date

    }