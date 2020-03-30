window.addEventListener('DOMContentLoaded', () => {
  const seeMore = document.querySelector('.see-more');
  const showOnClickSection = document.querySelector('.showOnClick');
  const audio = document.querySelector('#playAudio');

  let bool = false;
  seeMore.addEventListener('click', event => {
    audio.play();
    showOnClickSection.classList.toggle('show');
    bool
      ? (event.target.textContent = 'See more')
      : (event.target.textContent = 'See less');
    bool = !bool;
  });
});
