//  app store
const store = {
  notes: [],
  appsTheme: "light",
};

// Generate id instance
const g = new GenerateId();

const STORAGE_KEY = { notes: "notes", appsTheme: "appsTheme" };

// Elements
const noteList = document.querySelector(".js-notes-list");
const card = document.querySelector(".js-card");
const form = document.querySelector(".js-form");
const btnDelete = document.querySelector(".js-delete-btn");
const theme = document.querySelector(".js-btn-change-theme");
const body = document.querySelector("#body");
console.log("🚀 ~ body:", body);

// Listener
form.addEventListener("submit", onFormSubmit);
noteList.addEventListener("click", removeNote);
theme.addEventListener("change", changeTheme);

// Functions

store.notes = loadLS(STORAGE_KEY.notes, []);
renderNotes(store.notes);
store.appsTheme = loadLS(STORAGE_KEY.appsTheme, "light");
applyTheme(store.appsTheme);

function onFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const notesData = {
    id: g.generate(5),
    ...Object.fromEntries(new FormData(form)),
  };
  store.notes = [...store.notes, notesData];

  renderNotes(store.notes);
  saveLS(STORAGE_KEY.notes, store.notes);
  form.reset();
}

function createNotes({ id, name, body }) {
  return `<li class="card js-card">
            <h5 class="card-header">${name}</h5>
            <div class="card-body">
              <p class="card-text">${body}</p>
                <div class="mb-3 form-check">
                  <input
                  type="checkbox"
                  class="form-check-input"
                  id="exampleCheck1"
                  />
                  <label class="form-check-label" for="exampleCheck1"
                  >Check me out</label
                  >
                </div>
              <button
              class="btn btn-primary js-delete-btn"
              type="button"
              data-noteid="${id}"
              >
              Delete
              </button>
            </div>
          </li>`;
}

function renderNotes(notes) {
  const renderNote = notes.map((note) => createNotes(note)).join("");
  noteList.innerHTML = renderNote;
}

function removeNote(event) {
  const btn = event.target.closest(".js-delete-btn");
  if (btn.tagName !== "BUTTON") {
    return;
  }

  const noteId = btn.dataset.noteid;

  store.notes = store.notes.filter((note) => note.id !== noteId);
  renderNotes(store.notes);
  saveLS(STORAGE_KEY.notes, store.notes);
}

function saveLS(key, value) {
  try {
    const json = JSON.stringify(value);
    localStorage.setItem(key, json);
  } catch (error) {
    console.log("Error😒");
  }
}

function loadLS(key, defaultValue) {
  try {
    const json = localStorage.getItem(key);
    return json === null ? defaultValue : JSON.parse(json);
  } catch (error) {
    console.log("Error😒");
  }
}

function changeTheme(event) {
  const themeChanger = event.target;
  if (themeChanger.id !== "btnradio1") {
    body.setAttribute("data-bs-theme", "dark");
    store.appsTheme = "dark";
    localStorage.setItem(STORAGE_KEY.appsTheme, "dark");
  } else {
    body.setAttribute("data-bs-theme", "light");
    store.appsTheme = "light";
    localStorage.setItem(STORAGE_KEY.appsTheme, "light");
  }

  saveLS(STORAGE_KEY.appsTheme, store.appsTheme);
}
