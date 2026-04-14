const API = "http://localhost:5000";

async function loadLists() {
  const res = await fetch(`${API}/lists`);
  const lists = await res.json();

  const ul = document.getElementById("lists");
  ul.innerHTML = "";

  lists.forEach(list => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span onclick="viewList('${list._id}')">${list.title}</span>
      <button onclick="deleteList('${list._id}')">❌</button>
    `;
    ul.appendChild(li);
  });
}

async function createList() {
  const title = document.getElementById("listTitle").value;

  await fetch(`${API}/lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });

  loadLists();
}

async function viewList(id) {
  const res = await fetch(`${API}/lists`);
  const lists = await res.json();
  const list = lists.find(l => l._id === id);

  const div = document.getElementById("entriesSection");

  div.innerHTML = `
    <h2>${list.title}</h2>
    <input id="entryText" placeholder="New entry">
    <button onclick="addEntry('${id}')">Add</button>
    <ul>
      ${list.entries.map(e => `
        <li>
          <span style="text-decoration:${e.status ? 'line-through' : 'none'}">
            ${e.text}
          </span>
          <button onclick="toggle('${id}','${e._id}')">✔</button>
          <button onclick="deleteEntry('${id}','${e._id}')">❌</button>
        </li>
      `).join("")}
    </ul>
  `;
}

async function addEntry(id) {
  const text = document.getElementById("entryText").value;

  await fetch(`${API}/lists/${id}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  viewList(id);
}

async function toggle(listId, entryId) {
  await fetch(`${API}/lists/${listId}/entries/${entryId}`, {
    method: "PUT"
  });

  viewList(listId);
}

async function deleteEntry(listId, entryId) {
  await fetch(`${API}/lists/${listId}/entries/${entryId}`, {
    method: "DELETE"
  });

  viewList(listId);
}

async function deleteList(id) {
  await fetch(`${API}/lists/${id}`, {
    method: "DELETE"
  });

  loadLists();
}

loadLists();