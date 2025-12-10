console.log("Script Loaded");

var Picuser = document.getElementById("photoInput");
var username = document.getElementById("fullName");
var phoneuser = document.getElementById("phoneNumber");
var Emailuser = document.getElementById("emailAddress");
var Addressuser = document.getElementById("address");
var preview = document.getElementById("profilePhotoPreview");
var addbtn = document.getElementById("addbtn");
var updbtn = document.getElementById("updbtn");
var search = document.getElementById("textinput");
var total = document.getElementById("totalcount");
var fav = document.getElementById("totalfav");
var emerg = document.getElementById("totalemer");
var emergCheck = document.getElementById("emergCheck");
var favCheck = document.getElementById("favCheck");
var favBody = document.querySelector(
  ".favorites-card:nth-child(1) .favorites-body"
);
var emergBody = document.querySelector(
  ".favorites-card:nth-child(2) .favorites-body"
);

function updateTotal() {
  total.innerHTML = uList.length;
}
function updatefav() {
  fav.innerHTML = favlist.length;
}
function updateEmer() {
  emerg.innerHTML = emerglist.length;
}

function changePhoto() {
  var file = Picuser.files[0];

  var reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("profilePhotoPreview").innerHTML =
      "<img src='" + e.target.result + "'>";

    Picuser.dataset.img = e.target.result;
  };
  reader.readAsDataURL(file);
}
var favlist = [];
var emerglist = [];
var uList = [];
if (localStorage.getItem("data") != null) {
  uList = JSON.parse(localStorage.getItem("data"));
  displayuser(uList);
  updateTotal();
}

if (localStorage.getItem("favlist") != null) {
  favlist = JSON.parse(localStorage.getItem("favlist"));
  displayFavorites(favlist);
  updatefav();
}

if (localStorage.getItem("emerglist") != null) {
  emerglist = JSON.parse(localStorage.getItem("emerglist"));
  displayEmergency(emerglist);
  updateEmer();
}

function savecontact() {
  nameinputvalidation();
  phoneinputvalidation();
  emailinputvalidation();

  if (
    !username.classList.contains("is-valid") ||
    !phoneuser.classList.contains("is-valid") ||
    !Emailuser.classList.contains("is-valid")
  ) {
    Swal.fire({
      title: "Invalid Input!",
      html: "<small>Check Name, Phone, or Email fields</small>",
      icon: "warning",
      draggable: true,
      showConfirmButton: true,
    });
    return;
  }

  var users = {
    Picture: Picuser.dataset.img || "",
    Name: username.value,
    Phone: phoneuser.value,
    Email: Emailuser.value,
    Address: Addressuser.value,
    isEmerg: emergCheck.checked,
    isFav: favCheck.checked,
  };

  if (!users.Name || !users.Phone) {
    Swal.fire({
      title: "Required Fields!",
      html: "<small>Name and Phone cannot be empty</small>",
      icon: "warning",
      draggable: true,
      showConfirmButton: true,
    });
    return;
  }

  var isDuplicate = uList.some(function (u) {
    return u.Phone === users.Phone || u.Email === users.Email;
  });

  if (isDuplicate) {
    Swal.fire({
      title: "Duplicate!",
      html: "<small>This contact already exists</small>",
      icon: "warning",
      draggable: true,
      showConfirmButton: true,
    });
    return;
  }

  uList.push(users);
  localStorage.setItem("data", JSON.stringify(uList));

  if (users.isFav) {
    favlist.push(users);
    localStorage.setItem("favlist", JSON.stringify(favlist));
    displayFavorites(favlist);
  }

  if (users.isEmerg) {
    emerglist.push(users);
    localStorage.setItem("emerglist", JSON.stringify(emerglist));
    displayEmergency(emerglist);
  }

  clearinput();

  Swal.fire({
    title: "Added",
    html: "<small>Contact has been added</small>",
    icon: "success",
    draggable: true,
    showConfirmButton: false,
    timer: 2000,
  });

  displayuser(uList);
  updateTotal();
  updateEmer();
  updatefav();
}

function clearinput() {
  username.value = "";
  phoneuser.value = "";
  Emailuser.value = "";
  Addressuser.value = "";
  Picuser.value = "";
  Picuser.dataset.img = "";
  document.getElementById(
    "profilePhotoPreview"
  ).innerHTML = `<i class="fas fa-user fa-3x"></i>`;
  emergCheck.checked = false;
  favCheck.checked = false;
}

function displayuser(list) {
  var row = document.getElementById("row");

  if (list.length === 0) {
    row.classList.add("empty-state");
    row.classList.remove("row", "g-4", "mt-3");
    row.innerHTML = `
      <div class="empty-state-icon">
        <i class="fa-solid fa-address-book"></i>
      </div>
      <h5 class="empty-state-title">No contacts found</h5>
      <p class="empty-state-text">Click "Add Contact" to get started</p>
    `;
    return;
  }

  var box = "";
  for (var i = 0; i < list.length; i++) {
    var user = list[i];
    box += `
    <div class="col-12 col-md-6 mb-3">
        <div class="contact-card rounded-4 shadow">
          <div class="card-body-custom p-3">
            <div class="d-flex align-items-start mb-3">
              <img src="${
                user.Picture || "images/man-user-circle-icon.svg"
              }" class="rounded-4 me-3 profile-img" alt="Profile"/>
              <div class="flex-grow-1">
                <h5 class="mb-2 fw-bold">${user.Name}</h5>
                <div class="d-flex align-items-center mb-2">
                  <span class="fa-stack square-icon">
                    <i class="fas fa-square fa-stack-2x bg-icon"></i>
                    <i class="fas fa-phone fa-stack-1x text-primary"></i>
                  </span>
                  <span class="text-muted ms-2">${user.Phone}</span>
                </div>
              </div>
            </div>
            <div class="d-flex align-items-center my-2">
              <span class="fa-stack square-icon">
                <i class="fas fa-square fa-stack-2x bg-purple-light"></i>
                <i class="fas fa-envelope fa-stack-1x text-purple"></i>
              </span>
              <span class="text-muted ms-2">${user.Email}</span>
            </div>
            <div class="d-flex align-items-center my-2">
              <span class="fa-stack square-icon">
                <i class="fas fa-square fa-stack-2x bg-green-light"></i>
                <i class="fas fa-map-marker-alt fa-stack-1x text-success"></i>
              </span>
              <span class="text-muted ms-2">${user.Address}</span>
            </div>
          </div>
          <div class="contact-footer d-flex justify-content-between align-items-center">
            <div class="d-flex gap-2">
              <a href="tel:${
                user.Phone
              }" class="btn contact-btn"><i class="fas fa-phone"></i></a>
              <a href="mailto:${
                user.Email
              }" class="btn contact-btn"><i class="fas fa-envelope"></i></a>
            </div>
            <div class="d-flex gap-2">
<label class="action-label">
  <input type="checkbox" class="action-checkbox" onclick="toggleFav(${i})" ${
      user.isFav ? "checked" : ""
    }/>
  <i id="star-${i}" class="${
      user.isFav ? "fas fa-star text-warning" : "far fa-star"
    }"></i>
</label>
<label class="action-label">
  <input type="checkbox" class="action-checkbox" onclick="toggleEmerg(${i})" ${
      user.isEmerg ? "checked" : ""
    }/>
  <i id="heart-${i}" class="${
      user.isEmerg ? "fas fa-heart-pulse text-danger" : "far fa-heart"
    }"></i>
</label>
              <button type="button" class="action-label">
                <i class="fas fa-pencil-alt pen" onclick="setUpFormToUpdate(${i})"></i>
              </button>
              <button type="button" class="action-label" onclick="deleteUser(${i})">
                <i class="fas fa-trash trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  row.classList.remove("empty-state");
  row.classList.add("row", "g-4", "mt-3");
  row.innerHTML = box;
}

var GlobalIndex;

function setUpFormToUpdate(index) {
  var clickedUser = uList[index];
  username.value = clickedUser.Name;
  phoneuser.value = clickedUser.Phone;
  Emailuser.value = clickedUser.Email;
  Addressuser.value = clickedUser.Address;
  Picuser.dataset.img = clickedUser.Picture || "";
  favCheck.checked = clickedUser.isFav;
  emergCheck.checked = clickedUser.isEmerg;
  GlobalIndex = index;

  if (clickedUser.Picture) {
    preview.innerHTML = `<img src="${clickedUser.Picture}">`;
  } else {
    preview.innerHTML = `<i class="fas fa-user fa-3x"></i>`;
  }

  var modal = new bootstrap.Modal(document.getElementById("addContactModal"));
  modal.show();

  addbtn.classList.add("d-none");
  updbtn.classList.remove("d-none");
}

function Updateuser() {
  var user = uList[GlobalIndex];
  user.Picture = Picuser.dataset.img || "";
  user.Name = username.value;
  user.Phone = phoneuser.value;
  user.Email = Emailuser.value;
  user.Address = Addressuser.value;
  user.isFav = favCheck.checked;
  user.isEmerg = emergCheck.checked;

  displayuser(uList);
  localStorage.setItem("data", JSON.stringify(uList));

  if (user.isFav && !favlist.includes(user)) {
    favlist.push(user);
  } else if (!user.isFav) {
    for (var i = favlist.length - 1; i >= 0; i--) {
      if (favlist[i] === user) favlist.splice(i, 1);
    }
  }
  localStorage.setItem("favlist", JSON.stringify(favlist));
  displayFavorites(favlist);

  if (user.isEmerg && !emerglist.includes(user)) {
    emerglist.push(user);
  } else if (!user.isEmerg) {
    for (var i = emerglist.length - 1; i >= 0; i--) {
      if (emerglist[i] === user) emerglist.splice(i, 1);
    }
  }
  localStorage.setItem("emerglist", JSON.stringify(emerglist));
  displayEmergency(emerglist);

  Swal.fire({
    title: "Contact Updated!",
    html: "<small>The contact information has been successfully modified.</small>",
    icon: "success",
    showConfirmButton: false,
    timer: 2000,
  });

  addbtn.classList.remove("d-none");
  updbtn.classList.add("d-none");
  clearinput();
}

function deleteUser(index) {
  var user = uList[index];
  var userName = user.Name;
  var userPhone = user.Phone;

  Swal.fire({
    title: "Delete Contact?",
    html: `<small>Are you sure you want to delete <b>${userName}</b>?</small>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      uList.splice(index, 1);
      localStorage.setItem("data", JSON.stringify(uList));
      displayuser(uList);
      updateTotal();

      for (var i = favlist.length - 1; i >= 0; i--) {
        if (favlist[i].Phone === userPhone) {
          favlist.splice(i, 1);
        }
      }

      for (var i = emerglist.length - 1; i >= 0; i--) {
        if (emerglist[i].Phone === userPhone) {
          emerglist.splice(i, 1);
        }
      }

      localStorage.setItem("favlist", JSON.stringify(favlist));
      localStorage.setItem("emerglist", JSON.stringify(emerglist));

      displayFavorites(favlist);
      updatefav();
      displayEmergency(emerglist);
      updateEmer();

      Swal.fire({
        title: "Deleted!",
        html: `<small><b>${userName}</b> has been removed successfully.</small>`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}

function SearchByNamePhone() {
  var newList = [];
  var theSearch = search.value.toLowerCase().trim();

  for (var i = 0; i < uList.length; i++) {
    var currentName = uList[i].Name.toLowerCase().trim();
    var currentPhone = uList[i].Phone.trim();

    var isMatched =
      currentName.includes(theSearch) || currentPhone.includes(theSearch);

    if (isMatched) {
      newList.push(uList[i]);
    }
  }

  displayuser(newList);
}
function displayFavorites(list) {
  if (list.length === 0) {
    favBody.innerHTML = `<p class="favorites-empty">No favorites yet</p>`;
    favBody.style.padding = "3rem 1.25rem";
    return;
  }

  var box = "";
  for (var i = 0; i < list.length; i++) {
    var user = list[i];
    box += `
      <div class="card contact-card shadow-sm border-0 rounded-3 mb-2">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3">
              <img src="${
                user.Picture || "images/man-user-circle-icon.svg"
              }" alt="Profile" class="profile-img-2 rounded-3"/>
              <div>
                <h6 class="mb-0 fw-semibold text-start">${user.Name}</h6>
                <p class="mb-0 text-muted small text-start">${user.Phone}</p>
              </div>
            </div>
            <div class="phone-btn bg-success bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px">
              <i class="fas fa-phone text-success fs-5"></i>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  favBody.innerHTML = box;
  favBody.style.padding = "1.2rem 0.5rem";
}

function displayEmergency(list) {
  if (list.length === 0) {
    emergBody.innerHTML = `<p class="favorites-empty">No emergency contacts</p>`;
    emergBody.style.padding = "3rem 1.25rem";
    return;
  }

  var box = "";
  for (var i = 0; i < list.length; i++) {
    var user = list[i];
    box += `
      <div class="card contact-card shadow-sm border-0 rounded-3 mb-2">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3">
              <img src="${
                user.Picture || "images/man-user-circle-icon.svg"
              }" alt="Profile" class="profile-img-2 rounded-3"/>
              <div>
                <h6 class="mb-0 fw-semibold text-start">${user.Name}</h6>
                <p class="mb-0 text-muted small text-start">${user.Phone}</p>
              </div>
            </div>
            <div class="phone-btn emergency-btn bg-danger bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px">
            <i class="fas fa-phone text-danger fs-5"></i>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  emergBody.innerHTML = box;
  emergBody.style.padding = "1.2rem 0.75rem";
}

function toggleFav(index) {
  var user = uList[index];
  user.isFav = !user.isFav;

  localStorage.setItem("data", JSON.stringify(uList));

  var icon = document.getElementById("star-" + index);

  if (user.isFav) {
    if (!favlist.some((u) => u.Phone === user.Phone)) favlist.push(user);
    icon.className = "fas fa-star text-warning";
  } else {
    favlist = favlist.filter((u) => u.Phone !== user.Phone);
    icon.className = "far fa-star";
  }

  localStorage.setItem("favlist", JSON.stringify(favlist));
  displayFavorites(favlist);
  updatefav();
}

function toggleEmerg(index) {
  var user = uList[index];
  user.isEmerg = !user.isEmerg;

  localStorage.setItem("data", JSON.stringify(uList));

  var icon = document.getElementById("heart-" + index);

  if (user.isEmerg) {
    if (!emerglist.some((u) => u.Phone === user.Phone)) emerglist.push(user);
    icon.className = "fas fa-heart-pulse text-danger";
  } else {
    emerglist = emerglist.filter((u) => u.Phone !== user.Phone);
    icon.className = "far fa-heart";
  }

  localStorage.setItem("emerglist", JSON.stringify(emerglist));
  displayEmergency(emerglist);
  updateEmer();
}

function nameinputvalidation() {
  var pattern = /^[A-Z][a-z 0-9]{5,20}$/;
  var term = username.value;
  var Matched = pattern.test(term);

  if (Matched) {
    username.classList.add("is-valid");
    username.classList.remove("is-invalid");
  } else {
    username.classList.remove("is-valid");
    username.classList.add("is-invalid");
  }
}

function phoneinputvalidation() {
  var pattern = /^[0-9]{10,15}$/;
  var term = phoneuser.value;
  var Matched = pattern.test(term);

  if (Matched) {
    phoneuser.classList.add("is-valid");
    phoneuser.classList.remove("is-invalid");
  } else {
    phoneuser.classList.remove("is-valid");
    phoneuser.classList.add("is-invalid");
  }

}

function emailinputvalidation() {
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var term = Emailuser.value;
  var Matched = pattern.test(term);

  if (Matched) {
    Emailuser.classList.add("is-valid");
    Emailuser.classList.remove("is-invalid");
  } else {
    Emailuser.classList.remove("is-valid");
    Emailuser.classList.add("is-invalid");
  }
}
