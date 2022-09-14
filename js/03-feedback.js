import throttle from 'lodash.throttle';
const form = document.querySelector('.feedback-form');

onLoad();

form.addEventListener('input', throttle(onInput,1000));
form.addEventListener('submit', onSubmit);

function onInput() {
    const data = new FormData(form);
    let user = {};
    data.forEach((value, name) => (user[name] = value));
    localStorage.setItem('feedback-form-state', JSON.stringify(user));
};
    
function onLoad() {
    let savedForm = localStorage.getItem('feedback-form-state');
    if (savedForm) {
        savedForm = JSON.parse(savedForm);
        Object.entries(savedForm).forEach(([name, value]) => {
        form.elements[name].value = value;
        });
    }
}

function onSubmit(event) {
  event.preventDefault();
  localStorage.removeItem('feedback-form-state');
  let user = {};
  const data = new FormData(form);
  data.forEach((value, name) => (user[name] = value));
  console.log(user);
  form.reset();
}
