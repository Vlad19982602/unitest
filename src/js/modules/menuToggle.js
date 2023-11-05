const menuToggle = () => {
    let menuToggle = document.querySelector('.menuToggle');
    let header = document.querySelector('header');
    menuToggle.onclick = function() {
        header.classList.toggle('active');
    }
}
export default menuToggle;