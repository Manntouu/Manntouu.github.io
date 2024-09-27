

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(typeEffect, 1000);
});

const goose=document.querySelector('.logo');
const speed = 5;
document.addEventListener('click',function(event) {
    const x= event.pageX;
    const y=event.pageY;
    goose.style.left=(x-goose.offsetWidth/2)+'px';
    goose.style.top= (y-goose.offsetHeight/2)+'px';

});