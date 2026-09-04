export const handleLoader = (value: boolean) => {
  const loader = document.querySelector('#loader');
  if (loader) {
    if (value) loader.classList.add('displayBlock');
    else loader.classList.remove('displayBlock');
  }
};
