document.querySelectorAll('[data-jiu-open]').forEach((button)=>{button.addEventListener("click",()=>{
  const name=button.dataset.jiuOpen;
  if(typeof window.jiuOpenModal==="function")window.jiuOpenModal(name);
  else document.querySelector(".loading-screen-button")?.focus();
});});
