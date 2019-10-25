// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('UL');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
	  ev.target.classList.toggle('checked');
  }
}, false);

// Create a list of items when clicking on the "Add" button
function newElement() {
  let li = document.createElement("LI");
  let inputValue = document.getElementById("myInput").value;
  let t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("Invalid Input!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  //reset the input form
  document.getElementById("myInput").value = "";

  let span = document.createElement("SPAN");
  span.className = "fa fa-trash";
  // Click on a close button to hide the current list item
  span.onclick = () => { li.style.display = "none"; }
  li.appendChild(span);
}