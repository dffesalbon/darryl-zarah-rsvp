const SHEET_CSV_URL = import.meta.env.VITE_SHEET_CSV_URL; 
const FORM_ACTION_URL = import.meta.env.VITE_FORM_ACTION_URL; 

// Entry IDs from the Google Form (searched via inspect/dev tools)
const ENTRY_NAME = import.meta.env.VITE_ENTRY_NAME; 
const ENTRY_STATUS = import.meta.env.VITE_ENTRY_STATUS; 

let inviteList = [];

//Fetch invites (read-only list from published sheet)
async function loadInvites() {
  try {
    const formGroup = document.getElementById("formGroup");
    formGroup.style.display = "none";
    inviteList = [];
    const response = await fetch(SHEET_CSV_URL);
    const text = await response.text();
    const rows = text.split("\n").map(r => r.split(","));
    inviteList = rows.map(r => {return {'name': r[0].trim().toLowerCase(), 'status': r[1].trim().toLowerCase()}});
    console.log(inviteList);
    formGroup.style.display = "flex";
  } catch (err) {
    console.log(err);
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "<p>Something went wrong. Please try again later.</p>";
  }

}

// Search function
async function searchInvite() {
  const input = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  if (!input) {
    resultDiv.innerHTML = "<p>Please enter a name.</p>";
    return;
  }

  let person = inviteList.find(p => p.name === input);
  console.log(person)
  if (person){

    checkStatus(person, input);
  
  } else {

    resultDiv.innerHTML = `<p>Sorry, <b>${input}</b> is not on the invite list.</p>`;
  
  }
}

// Check Invite Status 
function checkStatus(person, input) {
  const resultDiv = document.getElementById("result");
  let { status } = person;
  let name = input.toUpperCase();

  if (!status || (status != "confirmed" && status != "declined")) {
    // Not yet responded
    resultDiv.innerHTML = `
      <p>Welcome <b>${name}</b>! You are invited. 🎉</p>
      <div class="confirmation-actions">
        <button id="confirmBtn" class="confirmation-button">Confirm Attendance</button>
        <button id="declineBtn" class="confirmation-button">Decline</button>
      </div>
    `;

    document.getElementById("confirmBtn").addEventListener("click", () => submitRSVP(input, "Confirmed"));
    document.getElementById("declineBtn").addEventListener("click", () => submitRSVP(input, "Declined"));

  } else {
    // Already responded
    resultDiv.innerHTML = `
      <p>Hi <b>${name}</b>, you are invited and already responded. Current status: <b>${status.toUpperCase()}</b></p>
      <p>If you’d like to change your response, you may update so we can inform the soon to be couple with your availability.</p>
      <div class="confirmation-actions">
        <button id="updateConfirmBtn" class="confirmation-button">Update to Confirmed</button>
        <button id="updateDeclineBtn" class="confirmation-button">Update to Declined</button>
      </div>
    `;

    document.getElementById("updateConfirmBtn").addEventListener("click", () => submitRSVP(input, "Confirmed"));
    document.getElementById("updateDeclineBtn").addEventListener("click", () => submitRSVP(input, "Declined"));


    let updateConfirmBtn = document.getElementById("updateConfirmBtn");
    let updateDeclineBtn = document.getElementById("updateDeclineBtn");

    if (status === "confirmed" || status === "Confirmed") {
      updateConfirmBtn.style.display = "none";
      updateDeclineBtn.style.display = "inline-block";
    } else if (status === "declined" || status === "Declined") {
      updateDeclineBtn.style.display = "none";
      updateConfirmBtn.style.display = "inline-block";
    } else {
      updateConfirmBtn.style.display = "none";
      updateDeclineBtn.style.display = "none";
    }

  }
}

// Submit RSVP (write to Google Form)
async function submitRSVP(name, status) {
  const formData = new FormData();
  formData.append(ENTRY_NAME, name.toUpperCase());
  formData.append(ENTRY_STATUS, status);

  try {
    await fetch(FORM_ACTION_URL, {
      method: "POST",
      mode: "no-cors", // required
      body: formData
    });
    alert(`Thank you, ${name.toUpperCase()}! Your RSVP has been recorded."`);
    window.location.replace(window.location.href);
  //   await loadInvites();
  //   document.getElementById("result").innerHTML = `
  //     <p>Thank you, <b>${name.toUpperCase()}</b>! Your RSVP has been recorded as <b>${status}</b>.</p>
  //   `;
  //   const input = document.getElementById("searchInput");
  //   input.value = "";
  //   await loadInvites();
  } catch (err) {
    console.error(err);
    alert("There was an error submitting your RSVP.");
  }
}

function init() {
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  // Close menu when a link is clicked
  const navItems = navLinks.querySelectorAll("a");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navLinks.classList.remove("show");
    });
  });

}

// Init
init();
document.getElementById("searchBtn").addEventListener("click", searchInvite);
await loadInvites();
