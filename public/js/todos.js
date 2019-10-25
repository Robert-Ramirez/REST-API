// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('UL');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
      console.log(ev);
	  ev.target.classList.toggle('checked');
  }
}, false);
