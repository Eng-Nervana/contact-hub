var fullNameInput = document.getElementById("full-name");
var phoneInput = document.getElementById("phone-num");
var emailInput = document.getElementById("email");
var addressInput = document.getElementById("address");
var groupInput = document.getElementById("group");
var notesInput = document.getElementById("notes");
var favoriteCheck = document.getElementById("favoriteCheck");
var emergencyCheck = document.getElementById("emergencyCheck");

var saveBtn = document.getElementById("saveBtn");
var favList = document.getElementById("favList");
var emergencyList = document.getElementById("emergencyList");
var searchInput = document.getElementById("searchcontact");

var totalNumSpan = document.getElementById("totalNum");
var totalCountNum = document.getElementById("total-num");
var favNumSpan = document.getElementById("favNum");
var emergencyNumSpan = document.getElementById("emergencyNum");

var phoneError = document.getElementById("phoneError");

phoneInput.addEventListener("input", function() {
  this.value = this.value.replace(/[^0-9]/g, "");
  var phoneVal = this.value;
  
  if (phoneVal === "") {
    phoneError.classList.add("d-none");
  } else {
    if (phoneVal.length === 11) {
      if (phoneVal.startsWith("010") || phoneVal.startsWith("011") || phoneVal.startsWith("012") || phoneVal.startsWith("015")) {
        phoneError.classList.add("d-none");
      } else {
        phoneError.classList.remove("d-none");
      }
    } else {
      phoneError.classList.remove("d-none");
    }
  }
});

var contactsList = [];
var updateIndex = null;

var savedData = localStorage.getItem("contactsData");
if (savedData) {
  contactsList = JSON.parse(savedData);
}

function displayContacts(listToDisplay) {
  var currentList = contactsList;
  if (listToDisplay) {
    currentList = listToDisplay;
  }

  var cartona = "";
  var favcartona = "";
  var emergencycartona = "";
  
  var totalCount = contactsList.length;
  var favCount = 0;
  var emergencyCount = 0;

  for (var i = 0; i < contactsList.length; i++) {
    if (contactsList[i].isFavorite) {
      favCount++;
    }
    if (contactsList[i].isEmergency) {
      emergencyCount++;
    }
  }

  for (var i = 0; i < currentList.length; i++) {
    var currentContact = currentList[i];
    var originalIndex = contactsList.indexOf(currentContact);

    var badgesClasses = "";
    if (currentContact.isFavorite) {
      badgesClasses += " has-star";
    }
    if (currentContact.isEmergency) {
      badgesClasses += " has-heart";
    }

    var emailText = currentContact.email;
    if (emailText === "") {
      emailText = "No email";
    }

    var addressText = currentContact.address;
    if (addressText === "") {
      addressText = "No address";
    }

    var firstLetter = currentContact.name.charAt(0).toUpperCase();

    var starColorClass = "text-muted";
    var starIconStyle = "regular";
    if (currentContact.isFavorite) {
      starColorClass = "text-warning";
      starIconStyle = "solid";
    }

    var heartColorClass = "text-muted";
    var heartIconStyle = "regular";
    if (currentContact.isEmergency) {
      heartColorClass = "text-danger";
      heartIconStyle = "solid";
    }

    cartona += `
      <div class="col-12 col-md-6 col-lg-6 mb-3">
        <div class="contact-info overflow-hidden d-flex flex-column bg-white rounded border h-100">
          <div class="d-flex ms-3 mt-3 align-items-center">
            <span id="first-litter" class="text-white rounded-3 bg-danger me-2 fs-3 d-flex justify-content-center align-items-center ${badgesClasses}">
              ${firstLetter}
            </span>
            <div class="ms-3">
              <h6 class="fw-bold mb-1">${currentContact.name}</h6>
              <div class="d-flex align-items-center">
                <span class="phone-icon bg-primary-subtle me-2 small rounded-3 d-flex justify-content-center align-items-center p-1">
                  <i class="fa-solid fa-phone text-primary"></i>
                </span>
                <span class="text-muted font-size">${currentContact.phone}</span>
              </div>
            </div>
          </div>
          
          <div class="d-flex align-items-center ms-3 mt-2">
            <span class="email-icon d-flex justify-content-center align-items-center me-2 small rounded-2 text-center p-1">
              <i class="fa-solid fa-envelope"></i>
            </span>
            <span class="text-muted font-size">${emailText}</span>
          </div>

          <div class="d-flex align-items-center ms-3 mt-1">
            <span class="location-icon d-flex justify-content-center align-items-center me-2 small rounded-2 text-center p-1">
              <i class="fa-solid fa-location-dot"></i>
            </span>
            <span class="text-muted font-size">${addressText}</span>
          </div>

          <div class="d-flex gap-2 small ms-3 mb-2 mt-2">
            <span class="bg-primary-subtle text-primary small p-1 rounded">${currentContact.group}</span>
          </div>

          <div class="bg-light p-3 d-flex justify-content-between align-items-center mt-auto">
            <div class="d-flex gap-3">
              <a href="tel:${currentContact.phone}" class="bg-success-subtle p-2 rounded text-decoration-none">
                <i class="fa-solid fa-phone text-success"></i>
              </a>
              <a href="mailto:${currentContact.email}" class="bg-mail-link p-2 rounded text-decoration-none">
                <i class="fa-solid fa-envelope"></i>
              </a>
            </div>

            <div class="d-flex gap-2 align-items-center">
              <span onclick="toggleFavorite(${originalIndex})" class="star-icon icons p-2 rounded bg-transparent ${starColorClass}" role="button">  
                <i class="fa-${starIconStyle} fa-star"></i>  
              </span>
              <span onclick="toggleEmergency(${originalIndex})" class="heart-icon icons p-2 rounded bg-transparent ${heartColorClass}" role="button"> 
                <i class="fa-${heartIconStyle} fa-heart"></i> 
              </span>
              <span onclick="setFormForUpdate(${originalIndex})" class="edit-icon icons p-2 rounded bg-transparent" role="button">  
                <i class="fa-solid fa-pen"></i> 
              </span>
              <span onclick="deleteContact(${originalIndex})" class="del-icon icons p-2 rounded bg-transparent" role="button"> 
                <i class="fa-solid fa-trash"></i> 
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  for (var i = 0; i < contactsList.length; i++) {
    var currentContact = contactsList[i];
    var firstLetter = currentContact.name.charAt(0).toUpperCase();

    if (currentContact.isFavorite) {
      favcartona += `
        <li class="li-bg-change p-2 rounded mb-2 border-bottom">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex gap-3 align-items-center">
              <span class="first-litter-fav p-2 d-flex justify-content-center align-items-center rounded bg-danger text-white">
                ${firstLetter}
              </span>
              <div class="d-flex flex-column">
                <span class="small fw-bold">${currentContact.name}</span>
                <span class="text-muted small">${currentContact.phone}</span>
              </div>
            </div>
            <a href="tel:${currentContact.phone}" class="phone-bg-change text-decoration-none bg-success-subtle p-2 rounded-3 d-flex justify-content-center align-items-center">
              <i class="fa-solid fa-phone text-success"></i>
            </a>
          </div>
        </li>
      `;
    }

    if (currentContact.isEmergency) {
      emergencycartona += `
        <li class="li-bg-change p-2 rounded mb-2 border-bottom">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex gap-3 align-items-center">
              <span class="first-litter-fav p-2 d-flex justify-content-center align-items-center rounded bg-danger text-white">
                ${firstLetter}
              </span>
              <div class="d-flex flex-column">
                <span class="small fw-bold">${currentContact.name}</span>
                <span class="text-muted small">${currentContact.phone}</span>
              </div>
            </div>
            <a href="tel:${currentContact.phone}" class="phone-bg-change text-decoration-none bg-success-subtle p-2 rounded-3 d-flex justify-content-center align-items-center">
              <i class="fa-solid fa-phone text-success"></i>
            </a>
          </div>
        </li>
      `;
    }
  }

  var dynamicCardsRow = document.getElementById("dynamicCardsRow");
  if (!dynamicCardsRow) {
    dynamicCardsRow = document.querySelector(".col-12.col-lg-8 .container .row");
  }

  if (currentList.length === 0) {
    dynamicCardsRow.innerHTML = `
      <div class="col-12 d-flex flex-column justify-content-center align-items-center text-center text-muted p-5">
        <span class="gray-div p-3 rounded-3 d-flex justify-content-center align-items-center mb-3">
          <i class="fa-solid fa-address-book fs-3 text-muted"></i>
        </span>
        <h4>No contacts found</h4>
        <p>Click "Add Contact" to get started</p>
      </div>
    `;
  } else {
    dynamicCardsRow.innerHTML = cartona;
  }

  if (favCount === 0) {
    favList.innerHTML = `<li class="text-muted text-center py-3 list-unstyled">No favorites yet</li>`;
  } else {
    favList.innerHTML = favcartona;
  }

  if (emergencyCount === 0) {
    emergencyList.innerHTML = `<li class="text-muted text-center py-3 list-unstyled">No emergency contacts</li>`;
  } else {
    emergencyList.innerHTML = emergencycartona;
  }

  totalNumSpan.innerHTML = totalCount;
  totalCountNum.innerHTML = totalCount;
  favNumSpan.innerHTML = favCount;
  emergencyNumSpan.innerHTML = emergencyCount;
}

function toggleFavorite(index) {
  if (contactsList[index].isFavorite) {
    contactsList[index].isFavorite = false;
  } else {
    contactsList[index].isFavorite = true;
  }
  localStorage.setItem("contactsData", JSON.stringify(contactsList));
  displayContacts();
}

function toggleEmergency(index) {
  if (contactsList[index].isEmergency) {
    contactsList[index].isEmergency = false;
  } else {
    contactsList[index].isEmergency = true;
  }
  localStorage.setItem("contactsData", JSON.stringify(contactsList));
  displayContacts();
}

saveBtn.addEventListener("click", function() {
  var nameVal = fullNameInput.value;
  var phoneVal = phoneInput.value;

  if (nameVal === "" || phoneVal === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill in the required fields (Name and Phone)!",
      confirmButtonColor: "#d33"
    });
    return;
  }

  var contact = {
    name: nameVal,
    phone: phoneVal,
    email: emailInput.value,
    address: addressInput.value,
    group: groupInput.value,
    notes: notesInput.value,
    isFavorite: favoriteCheck.checked,
    isEmergency: emergencyCheck.checked
  };

  if (updateIndex === null) {
    contactsList.push(contact);
    Swal.fire({
      icon: "success",
      title: "Added!",
      text: "Contact has been added successfully.",
      showConfirmButton: false,
      timer: 1500
    });
  } else {
    contactsList[updateIndex] = contact;
    updateIndex = null;
    saveBtn.innerHTML = "Save Contact";
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Contact has been updated successfully.",
      showConfirmButton: false,
      timer: 1500
    });
  }

  localStorage.setItem("contactsData", JSON.stringify(contactsList));
  displayContacts();
  clearForm();
  
  var modalElement = document.getElementById("staticBackdrop");
  var modal = bootstrap.Modal.getInstance(modalElement);
  modal.hide();
});

function clearForm() {
  fullNameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
  addressInput.value = "";
  groupInput.value = "Select a group";
  notesInput.value = "";
  
  favoriteCheck.checked = false;
  emergencyCheck.checked = false;
  phoneError.classList.add("d-none");
}

function deleteContact(index) {
  var contactName = contactsList[index].name;

  Swal.fire({
    title: "Delete Contact?",
    text: "Are you sure you want to delete " + contactName + "?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, delete it!"
  }).then(function(result) {
    if (result.isConfirmed) {
      contactsList.splice(index, 1);
      localStorage.setItem("contactsData", JSON.stringify(contactsList));
      displayContacts();
      Swal.fire("Deleted!", "Contact has been deleted.", "success");
    }
  });
}

function setFormForUpdate(index) {
  var currentContact = contactsList[index];
  
  fullNameInput.value = currentContact.name;
  phoneInput.value = currentContact.phone;
  emailInput.value = currentContact.email;
  addressInput.value = currentContact.address;
  groupInput.value = currentContact.group;
  notesInput.value = currentContact.notes;

  favoriteCheck.checked = currentContact.isFavorite;
  emergencyCheck.checked = currentContact.isEmergency;

  updateIndex = index;
  saveBtn.innerHTML = "Update Contact";

  var modalElement = document.getElementById("staticBackdrop");
  var modal = bootstrap.Modal.getInstance(modalElement);
  if (!modal) {
    modal = new bootstrap.Modal(modalElement);
  }
  modal.show();
}

searchInput.addEventListener("input", function() {
  var term = searchInput.value.toLowerCase();
  var filteredList = [];

  for (var i = 0; i < contactsList.length; i++) {
    var currentContact = contactsList[i];
    var nameLower = currentContact.name.toLowerCase();
    var phoneStr = currentContact.phone;
    
    var emailLower = "";
    if (currentContact.email) {
      emailLower = currentContact.email.toLowerCase();
    }

    if (nameLower.indexOf(term) !== -1 || phoneStr.indexOf(term) !== -1 || emailLower.indexOf(term) !== -1) {
      filteredList.push(currentContact);
    }
  }
  displayContacts(filteredList);
});

displayContacts();